#!/usr/bin/env python3
"""Thin ccmetr client — the only ccmetr code that runs on a participant's machine.

Forwards Claude Code hook/statusline events to the gateway (ANTHROPIC_BASE_URL)
and acts on the JSON it returns: injects the gateway's `context` as non-blocking
additional context (no yellow "blocked by hook" UI); on a closed task uploads the
named transcripts and bundles them; on an auth failure (re)creates
settings.local.json and blocks with fix-it steps instead of a raw 401. All wording
and task logic live on the gateway; this just pipes JSON and fails quietly when
the gateway is unreachable, so it never blocks a prompt.
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SCRIPT_DIR = pathlib.Path(__file__).resolve().parent
ERRLOG = SCRIPT_DIR / "errors.jsonl"
TIMEOUT = 8.0          # hook / statusline round-trip
UPLOAD_TIMEOUT = 60.0  # pushing a transcript file
BUNDLE_TIMEOUT = 180.0  # gateway-side bundling on finish
SUBMIT_TIMEOUT = 30.0   # batch form submit

# Baked default so a fresh worktree/clone with no settings.local.json still reaches
# the tracker (an explicit env var wins). Keep in sync with metr.py's GATEWAY_URL.
GATEWAY_URL = "https://productivity-study.pub.metr.org"
KEY_PAGE = f"{GATEWAY_URL}/settings"
# Slot written into a fresh settings.local.json; never sent as a real credential.
PLACEHOLDER_TOKEN = "PASTE-YOUR-STUDY-KEY-HERE"
# Stash the installer writes to user-scope ~/.claude/settings.json env. Present in
# every session, so a folder's hook can self-configure the token from it (see
# ensure_settings_local) instead of re-pasting — update it once to re-key them all.
METR_TOKEN_ENV = "METR_AUTH_TOKEN"
# Sent as X-CCMETR-Client-Version; the gateway 403s { code: client_outdated } if
# this is too old. Bump per release (raise MAJOR for a breaking change).
CLIENT_VERSION = "1.3.1"


def base_url() -> str:
    url = os.environ.get("CCMETR_GATEWAY_URL") or os.environ.get("ANTHROPIC_BASE_URL") or GATEWAY_URL
    return url.rstrip("/")


def auth_token() -> str:
    return os.environ.get("CCMETR_CLIENT_AUTH_TOKEN") or os.environ.get("ANTHROPIC_AUTH_TOKEN") or "ccmetr-local"


def _request(path: str, data: bytes, content_type: str, timeout: float = TIMEOUT) -> bytes:
    req = urllib.request.Request(
        base_url() + path,
        data=data,
        method="POST",
        headers={
            "Content-Type": content_type,
            "Authorization": f"Bearer {auth_token()}",
            "X-CCMETR-Client-Version": CLIENT_VERSION,
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def post_json(path: str, payload: dict, timeout: float = TIMEOUT) -> dict:
    raw = _request(path, json.dumps(payload).encode("utf-8"), "application/json", timeout)
    obj = json.loads(raw or b"{}")
    return obj if isinstance(obj, dict) else {}


def _note_err(call: str, exc: Exception) -> None:
    """Record a swallowed error locally; the next successful hook POST ships it
    (a network failure can't be reported over the network that's failing).
    Never throws, and stops appending past 64KB so a dead gateway can't grow
    the file forever."""
    try:
        if ERRLOG.exists() and ERRLOG.stat().st_size > 65536:
            return
        rec = {"call": call, "err": type(exc).__name__, "detail": str(exc)[:200], "at": int(time.time())}
        with open(ERRLOG, "a") as f:
            f.write(json.dumps(rec) + "\n")
    except Exception:
        pass


def _errlog_lines() -> list[str]:
    try:
        return [ln for ln in ERRLOG.read_text().splitlines() if ln.strip()]
    except Exception:
        return []


def _parse_errs(lines: list[str]) -> list[dict]:
    out = []
    for ln in lines:
        try:
            out.append(json.loads(ln))
        except Exception:
            pass  # one corrupt line must not silence the rest
    return out


def _rewrite_errlog(rest: list[str]) -> None:
    """Atomically replace the log with the unshipped remainder (gone if empty)."""
    try:
        if not rest:
            ERRLOG.unlink(missing_ok=True)
            return
        tmp = ERRLOG.with_suffix(".tmp")
        tmp.write_text("\n".join(rest) + "\n")
        tmp.replace(ERRLOG)
    except Exception:
        pass


def read_stdin() -> dict:
    try:
        return json.loads(sys.stdin.read() or "{}")
    except json.JSONDecodeError:
        return {}


# The only event this client is wired into whose contract accepts injected context
# or a block decision. The same bin also runs for SubagentStart/SubagentStop, and
# both outputs mean something different — or nothing — there.
CONTEXT_EVENTS = frozenset({"UserPromptSubmit"})


def emit_additional_context(text: str, event_name: str = "UserPromptSubmit") -> None:
    """Hand text to the model as non-blocking context (the prompt still runs).

    Only for an event that accepts it. Claude Code rejects a hookSpecificOutput
    whose hookEventName does not match the event it fired for ("Hook returned
    incorrect event name"), discards the payload and shows the participant a hook
    error containing our stdout — so hardcoding the name broke the Subagent*
    events deterministically, including a sub-agent finishing after /metr-finish
    and driving its own upload. On any other event we stay silent: a sub-agent
    stopping is not a turn anything should be injected into.
    """
    if event_name not in CONTEXT_EVENTS:
        return
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": event_name,
                    "additionalContext": text,
                }
            }
        )
    )


def emit_block(reason: str, event_name: str = "UserPromptSubmit") -> None:
    """Block this prompt and show `reason` to the user (no model turn) — for auth
    failures, where a model call would just 401 anyway.

    NEVER on a Stop-family event. There {"decision": "block"} does not mean "drop
    this prompt": it means "do NOT let this stop", so Claude Code resumes the
    sub-agent with `reason` as its instruction, up to its stop-hook cap. An expired
    key would then bill extra model turns inside the study's measured active time
    and tell the agent to go open a URL and edit settings.local.json. For those
    events the reason goes to stderr, where it lands in the hook log without
    touching the run.
    """
    if event_name not in CONTEXT_EVENTS:
        sys.stderr.write("[ccmetr] " + reason.replace("\n", " ")[:400] + "\n")
        return
    print(json.dumps({"decision": "block", "reason": reason}))


def settings_local_path() -> pathlib.Path:
    """Project .claude/settings.local.json (two levels up from this bin dir). In a
    worktree that's the worktree's own .claude — the file a fresh worktree lacks."""
    return SCRIPT_DIR.parent.parent / "settings.local.json"


def ensure_settings_local() -> tuple[pathlib.Path, bool, bool]:
    """Ensure settings.local.json has the gateway base URL and a study key.

    Called only after the gateway rejects the current key, so if the
    METR_AUTH_TOKEN stash holds a *different* key (an empty/placeholder slot, or a
    rotated key) we swap it in — updating the stash once re-keys every folder. A
    stash equal to the rejected key is left alone. Other settings are untouched.
    Returns (path, created?, filled_from_stash?).
    """
    path = settings_local_path()
    created = not path.exists()
    try:
        data = json.loads(path.read_text()) if path.exists() else {}
        if not isinstance(data, dict):
            data = {}
    except Exception:
        data = {}
    env = data.get("env")
    if not isinstance(env, dict):
        env = {}
    env.setdefault("ANTHROPIC_BASE_URL", base_url())
    filled_from_stash = False
    token = env.get("ANTHROPIC_AUTH_TOKEN")
    stash = (os.environ.get(METR_TOKEN_ENV) or "").strip()
    if stash and token != stash:
        env["ANTHROPIC_AUTH_TOKEN"] = stash
        filled_from_stash = True
    elif not token or token == PLACEHOLDER_TOKEN:
        env["ANTHROPIC_AUTH_TOKEN"] = PLACEHOLDER_TOKEN
    data["env"] = env
    data.setdefault("$schema", "https://json.schemastore.org/claude-code-settings.json")
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        # Pid-unique: this PR makes the client re-entrant for the first time
        # (SubagentStart/Stop fire in parallel), and a fixed ".tmp" name lets one
        # writer truncate another's inode mid-write.
        tmp = path.with_name(path.name + ".tmp." + str(os.getpid()))
        tmp.write_text(json.dumps(data, indent=2) + "\n")
        try:
            os.chmod(tmp, 0o600)  # the study key is a secret once pasted
        except OSError:
            pass
        os.replace(tmp, path)
    except Exception:
        try:
            tmp.unlink()
        except Exception:
            pass
    return path, created, filled_from_stash


def auth_help_message() -> str:
    """User-facing block reason for an unauthenticated session. Ensures
    settings.local.json exists; if a saved key (METR_AUTH_TOKEN) filled it, just
    asks for a restart, else walks through getting + pasting a key. The key never
    goes through the chat."""
    path, created, filled_from_stash = ensure_settings_local()
    if filled_from_stash:
        stash_file = pathlib.Path.home() / ".claude" / "settings.json"
        return (
            "This session isn't authenticated to the METR study gateway. I've set "
            f"this folder up from your saved study key ({path}) — restart "
            "Claude Code here to load it.\n"
            "\n"
            "(If it still fails after restarting, your key may have expired — get a "
            f"fresh one at {KEY_PAGE} and update {METR_TOKEN_ENV} in {stash_file}; "
            "every study folder picks it up from there.)"
        )
    step2_verb = "I just created" if created else "Open"
    return (
        "This session isn't authenticated to the METR study gateway, so your "
        "prompt won't run until it's set up. This is expected in a brand-new git "
        "worktree (no settings.local.json yet) or after your study key expires.\n"
        "\n"
        "To fix it:\n"
        f"  1. Open {KEY_PAGE}, sign in, and copy your study key.\n"
        f"  2. {step2_verb} {path} and paste the key as the value of "
        '"ANTHROPIC_AUTH_TOKEN" under "env" (replacing whatever is there).\n'
        "  3. Restart Claude Code in this folder so it loads the key."
    )


def upgrade_message(info: dict) -> str:
    """Block reason for a gateway-refused out-of-date client (403
    code=client_outdated). Prefer the gateway's message; else name the command."""
    default = (
        "Your METR study CLI is out of date and the study gateway no longer "
        "accepts it. Update it, then restart Claude Code:\n"
        f"  uv run {base_url()}/metr.py install"
    )
    msg = info.get("message") if isinstance(info, dict) else None
    return msg if isinstance(msg, str) and msg.strip() else default


def _transcript_roots() -> list[pathlib.Path]:
    """Dirs a Claude Code transcript may live in: <config>/projects/** (config dir
    defaults to ~/.claude, overridable via CLAUDE_CONFIG_DIR)."""
    roots: list[pathlib.Path] = []
    cfg = os.environ.get("CLAUDE_CONFIG_DIR")
    if cfg:
        roots.append(pathlib.Path(cfg).expanduser() / "projects")
    roots.append(pathlib.Path.home() / ".claude" / "projects")
    out: list[pathlib.Path] = []
    for r in roots:
        try:
            out.append(r.resolve())
        except OSError:
            pass
    return out


def _is_allowed_transcript(p: pathlib.Path) -> bool:
    """The gateway names the file to upload, so don't trust it to point anywhere
    (e.g. ~/.ssh/id_rsa, the study key). Only a real file resolving inside a known
    transcript root is eligible; symlink escapes are rejected via resolve()."""
    try:
        rp = p.resolve()
    except OSError:
        return False
    if not rp.is_file():
        return False
    for root in _transcript_roots():
        try:
            rp.relative_to(root)
            return True
        except ValueError:
            continue
    return False


# A Claude Code session id as it appears in a transcript filename. Validated
# before it reaches a glob pattern: the gateway supplies the id, which is the same
# reason _is_allowed_transcript exists, and a metacharacter or ".." in a pattern
# would widen the search past the roots this is meant to stay inside.
_SESSION_ID_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]{7,127}\Z")


def _find_transcript(sid: str) -> pathlib.Path | None:
    """Locate a session's transcript by id, for when the path the gateway stored no
    longer resolves. Searches only inside _transcript_roots(), so it widens the
    allowed set by nothing; the caller still runs the hit back through
    _is_allowed_transcript to reject a symlink escape."""
    if not _SESSION_ID_RE.match(sid or ""):
        return None
    # A sub-agent's id and its FILENAME are not the same string. The gateway keys
    # a sub-agent session on the hook payload's bare agent_id (hook/route.ts:
    # String(payload.agent_id || "")), while Claude Code writes the file as
    # agent-<agent_id>.jsonl -- so searching for "<sid>.jsonl" under subagents/
    # matches nothing, measured 0/200 against real transcripts on a dev machine.
    # Try the prefixed name first for a bare id, and skip that when the caller
    # already handed us a prefixed one rather than globbing agent-agent-*.
    sub_stems = [sid] if sid.startswith("agent-") else [f"agent-{sid}", sid]
    # Cheapest first: the flat top-level layout is one stat per project dir, the
    # nested sub-agent walk is recursive.
    patterns = [f"*/{sid}.jsonl"]
    patterns += [f"*/*/subagents/**/{stem}.jsonl" for stem in sub_stems]
    for root in _transcript_roots():
        for pattern in patterns:
            try:
                for hit in root.glob(pattern):
                    if hit.is_file():
                        return hit
            except OSError:
                continue
    return None


def upload_transcripts_and_bundle(resp: dict) -> str:
    """Upload each named transcript, then ask the gateway to bundle them. Returns
    the bundle's summary line to append to the user's output, or ""."""
    for up in resp.get("uploads") or []:
        path = up.get("path")
        sid = up.get("session_id")
        if not (path and sid):
            continue
        p = pathlib.Path(path).expanduser()
        # Reject paths outside the transcript dir: the gateway picks the path, and a
        # bad one could otherwise exfiltrate local files.
        if not _is_allowed_transcript(p):
            # The stored path was written by whichever hook last fired for that
            # session and can be stale by the time the task closes; the session id
            # cannot. Fall back to locating the file by id — and if that fails too,
            # LOG it. A bare `continue` here made a permanently unuploadable
            # transcript indistinguishable from one still in flight, so the gateway
            # re-issued the directive until it burned its attempt budget, then
            # sealed the task and dropped a transcript that was intact on disk.
            alt = _find_transcript(sid)
            if alt is None or not _is_allowed_transcript(alt):
                _note_err(
                    "transcript",
                    FileNotFoundError(f"session {sid}: no readable transcript (gateway named {path!r})"),
                )
                continue
            p = alt
        try:
            _request(f"/api/ccmetr/transcript?session_id={urllib.parse.quote(sid)}", p.read_bytes(), "application/jsonl", UPLOAD_TIMEOUT)
        except Exception as e:
            _note_err("transcript", e)
    task_id = resp.get("bundle_task")
    if task_id:
        try:
            b = post_json(f"/api/ccmetr/bundle?task_id={urllib.parse.quote(task_id)}", {}, BUNDLE_TIMEOUT)
            return (b or {}).get("summary") or ""
        except Exception as e:
            _note_err("bundle", e)
            return ""
    return ""


def run_hook(event_name: str) -> int:
    payload = read_stdin()
    event_name = payload.get("hook_event_name") or event_name
    lines = _errlog_lines()
    errs = _parse_errs(lines[:20])  # ship in batches; remainder drains next call
    body = {"event": event_name, "payload": payload}
    if errs:
        body["errors"] = errs
    try:
        resp = post_json("/api/ccmetr/hook", body)
    except json.JSONDecodeError:
        # HTTP 200 but not JSON → an incompatible (old-protocol) gateway. Surface it
        # so a botched rollout is diagnosable; network errors fall through below.
        emit_additional_context(
            "[ccmetr] The task tracker returned an unexpected (non-JSON) "
            "response. The gateway may be an incompatible version, so /metr-* "
            "commands won't work until it's updated. Please report this.",
            event_name,
        )
        return 0
    except urllib.error.HTTPError as e:
        # Read the body once — tells an out-of-date client (403 code=client_outdated)
        # apart from a plain auth failure (401/403).
        try:
            info = json.loads(e.read() or b"{}")
            if not isinstance(info, dict):
                info = {}
        except Exception:
            info = {}
        # Only build the message on an event that can actually show it. Python
        # evaluates the argument first, and auth_help_message() REWRITES
        # settings.local.json as a side effect — so calling it unconditionally
        # rewrote the participant's settings for a message that emit_block then
        # discarded to stderr, on every sub-agent that happened to run while a key
        # was expired. Gating the output was not enough; the work has to be gated.
        if event_name not in CONTEXT_EVENTS:
            sys.stderr.write(
                "[ccmetr] gateway rejected the "
                + event_name
                + " hook with HTTP "
                + str(e.code)
                + " (auth or client version) - not shown to the model here\n"
            )
        elif e.code == 403 and info.get("code") == "client_outdated":
            # Refused version → block with the gateway's update message.
            emit_block(upgrade_message(info), event_name)
        elif e.code in (401, 403):
            # Not authenticated (fresh worktree, or expired/rotated key): block with
            # fix-it steps and (re)create the file. Renders directly (a model turn
            # would 401 too).
            emit_block(auth_help_message(), event_name)
        # Other HTTP errors stay quiet — never block the participant's prompt.
        return 0
    except Exception as e:
        # Unreachable / transient — never block the participant's prompt.
        _note_err("hook", e)
        return 0
    if lines:  # shipped (or corrupt) lines are done; keep only the remainder
        _rewrite_errlog(lines[20:])
    summary = upload_transcripts_and_bundle(resp)
    context = resp.get("context")
    if summary:
        context = (context + "\n" + summary) if context else summary
    if context:
        emit_additional_context(context, event_name)
    return 0


def run_statusline() -> int:
    payload = read_stdin()
    model = (payload.get("model") or {}).get("display_name") or "Claude"
    try:
        resp = post_json("/api/ccmetr/statusline", payload)
        print(resp.get("line") or f"[{model}] ctx")
    except urllib.error.HTTPError as e:
        # Works even when an expired key also fails the model turn (the hook's
        # additionalContext wouldn't render then). One short line.
        if e.code in (401, 403):
            # ASCII only: statusline stdout is decoded with the OS locale (cp1252 on
            # Windows), so non-ASCII here would raise there.
            print(f"[METR] sign in for a study key: {KEY_PAGE}")
        else:
            print(f"[{model}] task tracker error")
    except Exception as e:
        _note_err("statusline", e)
        print(f"[{model}] task tracker offline")
    return 0


def run_submit(session: str, flow: str, answers_arg: str | None) -> int:
    """Batch-submit a form. The model calls this after collecting answers."""
    raw = answers_arg if answers_arg is not None else sys.stdin.read()
    try:
        answers = json.loads(raw or "{}")
        if not isinstance(answers, dict):
            raise ValueError
    except Exception:
        print("submit: answers must be a JSON object of {field: value}.")
        return 0
    body = json.dumps(
        {"session_id": session, "flow": flow, "answers": answers}
    ).encode("utf-8")
    req = urllib.request.Request(
        base_url() + "/api/ccmetr/submit",
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token()}",
            "X-CCMETR-Client-Version": CLIENT_VERSION,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=SUBMIT_TIMEOUT) as r:
            resp = json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:  # 422 carries the field errors as JSON
        if e.code in (401, 403):
            print(
                "Not authenticated to the study gateway - run /metr-help or paste a "
                f"study key from {KEY_PAGE} into .claude/settings.local.json, then "
                "restart Claude Code."
            )
            return 0
        try:
            resp = json.loads(e.read() or b"{}")
        except Exception:
            resp = {}
    except Exception as e:
        _note_err("submit", e)
        print("Couldn't reach the task tracker to submit. Try again in a moment.")
        return 0
    if resp.get("ok"):
        message = resp.get("message") or "Submitted."
        # finish/ditch close the task; the gateway returns upload directives so the
        # transcript count shows this turn.
        summary = upload_transcripts_and_bundle(resp.get("directives") or {})
        if summary:
            message += "\n" + summary
        print(message)
    else:
        errs = resp.get("errors") or {}
        if errs:
            print("The task tracker rejected some answers — fix and resubmit:")
            for k, v in errs.items():
                print(f"  - {k}: {v}")
        else:
            print("Submit failed. Try again, or /metr-cancel to bail.")
    return 0


def run_session_start() -> int:
    """On session start, tell the gateway if this session is FORKED/derived so it
    can re-attach it to the source session's task (else the fork drops to the
    require-a-task gate). On a fork the SessionStart payload's session_id and the id
    embedded in CLAUDE_ENV_FILE's path DIFFER — one is the source, one is the new
    session. Which field holds which flips between headless and interactive Claude
    Code, so we just send both and let the gateway bind whichever isn't on a task to
    the other's task. Best-effort and silent — never disrupts session start."""
    payload = read_stdin()
    source = (payload.get("session_id") or "").strip()
    env_file = os.environ.get("CLAUDE_ENV_FILE", "")
    new = os.path.basename(os.path.dirname(env_file)) if env_file else ""
    ids = [i for i in {source, new} if i]
    if len(ids) >= 2:  # differ → a fork/derived session; nothing to do otherwise
        try:
            post_json("/api/ccmetr/rebind", {"ids": ids})
        except Exception:
            pass
    return 0


def build_id() -> str:
    """The build stamp written into the payload by `metr.py build` (CI), or
    "dev" for a from-repo install that has no stamp."""
    try:
        return (SCRIPT_DIR / "BUILD").read_text().strip() or "dev"
    except OSError:
        return "dev"


def run_issue(kind: str, fields_arg: str | None) -> int:
    """File a tooling report (bug/confusing/idea). The model collects the
    fields; we add the build stamp and platform, the gateway adds identity."""
    if kind not in ("bug", "confusing", "idea"):
        sys.stderr.write("usage: ccmetr-client.py issue <bug|confusing|idea> [fields-json]\n")
        return 2
    raw = fields_arg if fields_arg is not None else sys.stdin.read()
    try:
        fields = json.loads(raw or "{}")
        if not isinstance(fields, dict):
            raise ValueError
    except Exception:
        print("issue: fields must be a JSON object.")
        return 0
    # Caller fields first so kind/build/platform can't be forged via the JSON.
    payload = {**fields, "kind": kind, "build": build_id(), "platform": sys.platform}
    try:
        resp = post_json("/api/ccmetr/issue", payload, SUBMIT_TIMEOUT)
    except urllib.error.HTTPError as e:  # 4xx carries the reason as JSON
        try:
            resp = json.loads(e.read() or b"{}")
        except Exception:
            resp = {}
    except Exception:
        print("Couldn't reach the task tracker to file this. Try again in a moment.")
        return 0
    print(resp.get("message") or ("Filed." if resp.get("ok") else "Filing failed — check the fields and try again."))
    return 0


def main() -> int:
    args = sys.argv[1:]
    if not args:
        sys.stderr.write(
            "usage: ccmetr-client.py {hook <Event>|statusline|session-start|submit <session> <flow> [json]|issue <kind> [json]}\n"
        )
        return 2
    if args[0] == "hook":
        return run_hook(args[1] if len(args) > 1 else "UserPromptSubmit")
    if args[0] == "statusline":
        return run_statusline()
    if args[0] == "session-start":
        return run_session_start()
    if args[0] == "submit":
        if len(args) < 3:
            sys.stderr.write(
                "usage: ccmetr-client.py submit <session> <flow> [answers-json]\n"
            )
            return 2
        return run_submit(args[1], args[2], args[3] if len(args) > 3 else None)
    if args[0] == "issue":
        if len(args) < 2:
            sys.stderr.write("usage: ccmetr-client.py issue <bug|confusing|idea> [fields-json]\n")
            return 2
        return run_issue(args[1], args[2] if len(args) > 2 else None)
    sys.stderr.write(f"unknown command {args[0]!r}\n")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())

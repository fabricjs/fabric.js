---
name: metr-bug
description: Report a bug in the study tooling. Use when a /metr-* command, the installer, or the status line errors or does something wrong.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *), Bash(~/.claude/ccmetr/bin/ccmetr *)
---

File a bug report. Be terse. Don't narrate, explain, list what you're doing, or
show your reasoning. Just ask what you need, run the command, relay the result.

Infer what you can from the conversation. Only ask for what you can't see:
what happened (ask them to paste or screenshot the interaction if they can),
what they expected, severity 1-5 (1 cosmetic, 3 slows me down, 5 fully blocked).
Auto-detect OS and Claude Code version silently.

Strip API keys, transcripts, and model speculation. Then run:

    .claude/ccmetr/bin/ccmetr issue bug '{"title": "<summary>", "happened": "...", "expected": "...", "severity": N, "command": "...", "os": "...", "claude_code": "..."}'

If that path doesn't exist, use `~/.claude/ccmetr/bin/ccmetr` instead.

After success, confirm with their title and severity so they feel heard:
"Filed (bug): <title> — severity <N>/5. Thanks for reporting this."
Nothing else.

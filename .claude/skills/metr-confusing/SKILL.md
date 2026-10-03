---
name: metr-confusing
description: Report something confusing in the study tooling. Use when it worked but surprised the participant or took trial and error to figure out.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *), Bash(~/.claude/ccmetr/bin/ccmetr *)
---

Report a confusing experience. Nothing has to be broken. Be terse. Don't narrate,
explain, list what you're doing, or show your reasoning. Just ask what you need,
run the command, relay the result.

Gather: what happened (ask them to paste or screenshot the confusing interaction
if they can), what they expected instead, severity 1-5 (1 head-scratch,
3 slowed me down, 5 avoided the tooling because of it).

Strip API keys, transcripts, and model speculation. Then run:

    .claude/ccmetr/bin/ccmetr issue confusing '{"title": "<summary>", "happened": "...", "expected": "...", "severity": N, "command": "..."}'

If that path doesn't exist, use `~/.claude/ccmetr/bin/ccmetr` instead.

After success, confirm with their title and severity so they feel heard:
"Filed (confusing): <title> — severity <N>/5. Thanks for flagging this."
Nothing else.

---
name: metr-idea
description: Suggest an improvement to the study tooling. Use for feature ideas or friction that makes the tooling worse to use.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *), Bash(~/.claude/ccmetr/bin/ccmetr *)
---

File an improvement idea. Be terse. Don't narrate, explain, list what you're
doing, or show your reasoning. Just ask what you need, run the command, relay
the result.

Gather: the idea (ask them to paste or screenshot anything relevant if it helps
explain), what prompted it (a concrete moment beats a general principle),
impact 1-5 (1 nice-to-have, 3 saves real time most days, 5 without this I avoid
the tooling).

Strip API keys, transcripts, and model speculation. Then run:

    .claude/ccmetr/bin/ccmetr issue idea '{"title": "<summary>", "idea": "...", "prompted": "...", "impact": N}'

If that path doesn't exist, use `~/.claude/ccmetr/bin/ccmetr` instead.

After success, confirm with their title and impact so they feel heard:
"Filed (idea): <title> — impact <N>/5. Thanks for the suggestion."
Nothing else.

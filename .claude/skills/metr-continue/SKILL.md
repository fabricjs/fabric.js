---
name: metr-continue
description: Resume an existing METR task by number, name, or issue URL. The assistant finds it and attaches this session.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: continue $ARGUMENTS

Usage: `/metr-continue <number | name | issue-url>` — say which open task to
resume; the assistant matches it against your task list (or shows the list if
it's unclear) and attaches this session. With no argument it lists your tasks
to pick from.

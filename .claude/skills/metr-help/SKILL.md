---
name: metr-help
description: Show the METR uplift task commands and how the flow works.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: help

Show the user this help, then stop:

**METR uplift task commands**
- `/metr-start` — start a new task; describe the issue and the assistant sets it up and gets to work
- `/metr-continue <number | name | issue link>` — resume an open task (by its number from /metr-list, its name, or its issue URL)
- `/metr-list` — list your active tasks
- `/metr-status` — show the task attached to this session
- `/metr-note <text>` — add a note to the current task
- `/metr-finish` — finish the current task (wrap-up questions, then uploads transcripts)
- `/metr-ditch` — abandon the current task (the assistant asks why)
- `/metr-cancel` — leave the current task in this session (without ending it)

**Tooling feedback**
- `/metr-bug` — report a bug in the study tooling
- `/metr-confusing` — report something that worked but surprised you
- `/metr-idea` — suggest an improvement to the study tooling
- `/metr-temp` — 60 min to run any query on your selected model (counts against your compute budget)

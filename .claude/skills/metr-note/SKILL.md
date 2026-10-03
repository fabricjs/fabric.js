---
name: metr-note
description: Add a timestamped note to the current METR task.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: note $ARGUMENTS

Usage: `/metr-note <text>` — stored on the current task and included in the
artifacts uploaded by /metr-finish.

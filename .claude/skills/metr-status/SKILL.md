---
name: metr-status
description: Show the METR task attached to this session (status, notes), or your open tasks if none.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: status

Shows the task attached to this session. If none, use /metr-list to see your open
tasks.

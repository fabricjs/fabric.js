---
name: metr-cancel
description: Leave the current task in this session (detach it without ending the task).
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: cancel

Detaches the current task from this session. It doesn't end the task (that's
/metr-ditch). The session just stops routing to it until you run /metr-start or
/metr-continue.

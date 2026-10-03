---
name: metr-temp
description: Temp mode. 60 minutes to run any query on your selected model, billed to your compute budget.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: temp

Temp mode for 60 minutes: run any query through the CLI on the model you've
selected. It counts against your compute budget.

Run /metr-start when ready to work on a task again.
Run /metr-temp again to reset the timer if you need more time.

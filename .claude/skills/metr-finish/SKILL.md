---
name: metr-finish
description: Finish the current METR task. The assistant walks you through the end-of-task questionnaire, then uploads transcripts.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: finish

Finishes the current task. The assistant asks the wrap-up questions, marks it
complete, and uploads transcripts. Say "cancel" to stop.

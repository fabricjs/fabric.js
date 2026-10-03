---
name: metr-ditch
description: Abandon the current METR task (mirrors the web app's "ditched" status). The assistant asks why.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: ditch

Abandons the current task. The assistant asks why (pick a reason or write your
own), then marks it ditched and uploads what exists. Say "cancel" to stop.

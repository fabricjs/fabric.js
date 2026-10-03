---
name: metr-start
description: Start a new METR uplift task. The assistant walks you through the questionnaire and gets to work.
disable-model-invocation: true
allowed-tools: Bash(.claude/ccmetr/bin/ccmetr *)
---

CCMETR_TASK: start

Starts a new task. Paste the GitHub or GitLab issue link the task implements
(required) — the assistant asks a couple of estimates, creates the task, and
starts working on it. Say "cancel" anytime to stop. (To resume an existing task
instead, use /metr-continue.)

---
title: Issue triage and human-reviewed estimates
summary: Let Codex sweep the backlog, group duplicates, suggest priorities and flag missing information, then turn its estimates into proposals the team reviews.
duration: ~45 min
audience: [non-technical]
---

## Why this matters

Triage is the part of delivery that everyone needs and nobody enjoys. Reports come in from support,
Slack threads, alerts and failed checks. Half of them are duplicates and the other half lack the one
detail an engineer needs. Codex is good at the sweep: reading everything, grouping it, and pointing
out what's missing.

It isn't the one who decides. Priorities, commitments and estimates affect people and contracts, so
they stay **proposals** until a person on the team has reviewed them.

```resource
title: "Use case: Automate bug triage"
url: https://learn.chatgpt.com/use-cases/automation-bug-triage
provider: OpenAI Docs
format: docs
duration: 15 min
level: beginner
why: OpenAI's own step-by-step recipe. Run one sweep by hand, tune the report in the same chat, then schedule it. It comes with a starter prompt you can adapt.
focus:
  - "The **rules** in the starter prompt: don't post, assign, label or close anything; group duplicates; **keep observed evidence separate from guesses**."
  - "Phase 2, *Make the report useful*: what a good first report contains before you automate anything."
  - Which plugins connect your sources (GitHub, Linear, Slack, Sentry), and the order the recipe recommends.
```

## A triage report you can trust

The official recipe asks for a report in which every item has the same parts. Use it as your quality bar:

| Each item has | Why |
|---|---|
| **Priority** (P0–P3) | A suggestion you can accept or change |
| **Evidence**: links or short quotes | So you can check it in seconds |
| **Facts and guesses kept apart** | So a guess never reaches the backlog dressed up as a fact |
| **Recommended next action** | So the report leads to a decision, not a discussion |
| Duplicates **grouped** under one item | So three reports of one bug don't look like three bugs |

```compare
title: Asking for triage
weak:
  prompt: Go through the backlog and prioritise everything. Update the tickets.
  note: Codex is allowed to change shared tickets, there's no evidence requirement, and guesses look the same as facts.
strong:
  prompt: |
    Triage issues opened in [project] in the last 7 days.
    For each issue: suggested priority P0–P3, a category, evidence (link or quote),
    missing information an engineer would need, and dependencies on other issues.
    Group duplicates. Mark anything you infer as "assumption".
    Do not edit, label, assign or close anything. Return a report only.
  note: Read-only, evidence-based, with assumptions marked. A person decides what changes in the tracker.
```

## Estimates: provisional, with assumptions

An estimate from Codex is useful as a **first draft that shows its reasoning**. It's dangerous as a
number on its own. Ask for ranges and assumptions, and let the people doing the work adjust it.

```usecase
title: First-pass estimates for a refinement session
who: Project manager
situation: Twenty new backlog items need rough sizes before Thursday's refinement. Engineers have no time to read them all in advance.
prompt: |
  For each item in this list, give a provisional size (S / M / L / XL) and:
  - the assumptions behind it;
  - what information is missing that could change the size;
  - dependencies on other items or teams;
  - your confidence (low / medium / high).
  Don't present any size as a commitment. Sort the items with low confidence first.
outcome: A refinement agenda that starts with the items most likely to be wrong, with questions ready for the engineers.
tips:
  - The low-confidence items are where the team's time goes. The draft tells you where to look.
  - Record which sizes the team changed and why. That feedback improves the next prompt.
```

> [!WARNING] Decisions that stay human
> Commitments to clients, priority calls that affect someone's work, closing or rejecting a
> customer's report, and anything about people's performance. Codex can prepare these. A person
> on the team makes them and owns them.

## From one sweep to a routine

Once a hand-run report is consistently useful, you can schedule it. The use case shows how to turn
a chat into a scheduled task. Module 5 covers the governance side of automation.

```resource
title: Get started with ChatGPT Work
url: https://learn.chatgpt.com/docs/get-started-with-work
provider: OpenAI Docs
format: docs
duration: 10 min
level: beginner
why: For non-developers, ChatGPT Work is where this kind of multi-source, repeatable task runs. The page explains when to use it and how to set up a recurring update.
focus:
  - "The list of tasks that suit it. Triage ticks every box: many sources, takes time by hand, the output gets reviewed, and it repeats."
  - "*Set up a recurring update*: the step after your manual sweep works."
```

```resource
title: Scheduled tasks
url: https://learn.chatgpt.com/docs/automations
provider: OpenAI Docs
format: docs
duration: 10 min
why: How to run a task on a schedule or from an app event, test it, and what permissions a scheduled task runs with.
focus:
  - "*Test scheduled tasks*: run the schedule once by hand before trusting it."
  - "*Permissions and security model*: a scheduled task can't ask you for approval at 3 a.m., so decide in advance what it is allowed to do."
```

## Check yourself

```quiz
id: issue-triage
questions:
  - q: Codex's triage report says "Login fails for SSO users, P0, probably caused by the last release". Which part should be marked as an assumption?
    options:
      - Login fails for SSO users
      - P0
      - Probably caused by the last release
      - None of it, because it reads as a single finding
    answer: 2
    explain: The failure is observed (there should be evidence). P0 is a suggestion. "Probably caused by" is a guess, and the recipe insists on keeping guesses apart from evidence.
  - q: What should a triage sweep be allowed to do the first few times it runs?
    options:
      - Close duplicates automatically
      - Only produce a report, without editing, labelling, assigning or closing anything
      - Reassign issues to the right team
      - Post the report to the client channel
    answer: 1
    explain: The official starter prompt forbids changing anything. Allow write actions only once the reports have proved reliable, and even then, deliberately.
  - q: Codex sizes a backlog item as "M, high confidence", but the description doesn't say which payment provider is involved. What's the best response?
    options:
      - Accept it, because high confidence means it's reliable
      - Ask Codex to list missing information and treat the size as provisional until the team clarifies
      - Make it XL to be safe
      - Delete the item until someone writes a better description
    answer: 1
    explain: Missing information that could change the size means the estimate is provisional, whatever confidence label it carries.
  - q: Which decisions should stay with a person even when Codex prepared everything?
    options:
      - A delivery date promised to a client
      - Rejecting a customer's bug report as "won't fix"
      - Grouping three duplicate reports into one item
      - The final priority of an item that affects another team's plans
    answer: [0, 1, 3]
    explain: Grouping duplicates is mechanical and easy to check. Commitments, rejections and cross-team priorities affect people and need an owner.
```

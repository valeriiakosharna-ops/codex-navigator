---
title: "Lab: triage with judgement"
summary: Three AI-made reports, three levels. Find the invented facts, the missing information and the estimates that hide their assumptions before they reach the team.
duration: 30 min
audience: [non-technical]
---

## How this lab works

Each level shows a report that Codex produced. Click the lines that should **not** go to the team
as they are, and from level 2 rate how serious each problem is. Some lines look suspicious but
are fine. Flagging those costs points, just as a false alarm costs the team time.

No AI is involved: the reports are fixed, and the lab tests your judgement.
Retake any level as often as you like. Your best result counts. Each level unlocks after you score
at least 70% on the previous one, or after two tries.

> [!TIP] Before you start
> Keep the quality bar from [Issue triage and human-reviewed estimates](02-issue-triage.md) in mind:
> evidence for every item, guesses marked as guesses, nothing presented as a commitment.

```spot
id: lab-triage-l1
title: Monday's bug sweep
level: 1
prompt: Codex swept last week's reports and produced this list for the stand-up. Find the lines that shouldn't go out as they are.
view: text
filename: triage-report.md
code: |
  # Bug sweep, 3–9 Nov (12 reports → 5 items)
  P0  Checkout fails for cards issued outside the EU
      Evidence: support #4411, #4418, Sentry alert "PAYMENT_DECLINED spike"
  P1  Password reset email not delivered
      Evidence: support #4402. Cause: the email provider is down.
  P2  Dashboard chart shows last month's data on first load
      Evidence: Slack thread #web-bugs, 7 Nov
  P2  Export button missing for read-only users
      Evidence: none found
  P3  Typo on the pricing page ("anual")
      Evidence: support #4420
  Actions taken: closed 4 duplicate tickets, assigned P0 to the payments team.
issues:
  - line: 5
    severity: major
    label: A guess presented as the cause
    explain: Nothing in the evidence shows that the provider is down. It's an assumption and should be marked as one, or checked first.
  - line: 9
    severity: major
    label: An item with no evidence
    explain: An item nobody can trace back to a report is either invented or misattributed. Ask where it came from before it reaches the backlog.
  - line: 12
    severity: critical
    label: The sweep changed shared tickets
    explain: The sweep was supposed to report, not act. Closing and assigning tickets is a team decision until the routine has been proved reliable and explicitly allowed to do it.
decoys:
  - line: 2
    explain: P0 is a suggestion. Here it's backed by two tickets and an alert, which is exactly what a reviewer needs.
  - line: 10
    explain: A typo really is P3. Low priority doesn't mean the item is wrong.
```

```spot
id: lab-triage-l2
title: Estimates for refinement
level: 2
unlock: { after: lab-triage-l1 }
prompt: Codex drafted sizes for Thursday's refinement session. Find the lines that would mislead the team, and rate how serious each one is.
view: text
filename: estimates-draft.md
code: |
  # Provisional sizes, for team review (S / M / L / XL)
  ONB-12  Add company logo upload to profile      S   conf: high
          Assumes: existing file-upload component can be reused.
  ONB-14  SSO login for enterprise clients        M   conf: high
  ONB-15  Export onboarding report to PDF         M   conf: medium
          Assumes: report layout already approved by client.
          Missing: which fields the client wants in the PDF.
  ONB-17  Migrate user data from the old portal   S   conf: high
          Assumes: about 2,000 users; old portal has an export API.
  ONB-18  Email reminder 3 days before deadline   S   conf: medium
          Assumes: scheduling service already exists (see ONB-9).
  Total: 1 sprint. Ready to share with the client as the plan.
issues:
  - line: 4
    severity: major
    label: Big item, high confidence, no assumptions
    explain: SSO for enterprise clients depends on identity providers, contracts and test accounts. "M, high confidence" with no assumptions or open questions hides exactly the risk the team needs to discuss.
  - line: 8
    to: 9
    severity: major
    label: Size that contradicts its own assumptions
    explain: A data migration that relies on an export API nobody has confirmed, with real users' data at stake, isn't "S, high confidence". The assumption should lower the confidence and raise questions.
  - line: 12
    severity: critical
    label: Provisional draft turned into a client commitment
    explain: The header says "for team review", and the last line turns it into a plan for the client. Estimates become commitments only after the people doing the work have agreed to them.
decoys:
  - line: 2
    explain: Reusing an existing component is a reasonable, stated assumption. The team can confirm it in seconds.
  - line: 7
    explain: Listing missing information is exactly what the draft should do.
  - line: 11
    explain: A dependency on another item, stated with a reference, is good practice.
```

```spot
id: lab-triage-l3
title: The weekly triage digest
level: 3
unlock: { after: lab-triage-l2 }
prompt: "This scheduled digest was set up a month ago to check five sources: Linear, GitHub issues, Sentry, the support queue and the #bugs Slack channel. Nobody reads it closely any more. This week, read it properly. What's wrong?"
view: text
filename: weekly-digest.md
code: |
  # Weekly triage digest (scheduled), week 45
  Sources checked: Linear (Web), GitHub issues, Sentry
  Sources not accessible: none
  New this week: 3 items (last 4 weeks: 14, 11, 12, 9)
  P1  Search returns no results for queries with accents
      Evidence: GitHub #882, #885 (same user)
  P2  Avatar upload slow on mobile
      Evidence: Sentry performance alert, 3 occurrences
  P3  Footer link to old blog
      Evidence: Linear WEB-301
  Trend: quiet week, quality improving.
  Duplicates merged: 0
issues:
  - line: 2
    to: 3
    severity: critical
    label: A source silently dropped
    explain: Two of the five configured sources, the support queue and #bugs, are gone from the list, and yet the report says nothing is inaccessible. A plugin or token most likely broke, and the digest went blind without saying so.
  - line: 4
    severity: major
    label: Sudden drop not questioned
    explain: Going from about 12 items a week to 3 is a signal to check the pipeline, not good news. Compare it with the source list above.
  - line: 11
    severity: major
    label: Conclusion the data can't support
    explain: '"Quality improving" is drawn from missing data. A routine report should state facts and flag anomalies, not reassure.'
decoys:
  - line: 6
    explain: Two reports from the same user is honest evidence. The P1 rests on the bug itself (search fails for accented queries), not on the number of reports.
  - line: 12
    explain: Zero duplicates in a 3-item week is plausible. On its own it's not a problem.
```

## What to take away

- **Evidence or it didn't happen.** An item that can't be traced to a source doesn't go to the team.
- **Guesses are labelled.** "Probably caused by" is a hypothesis to check, not a finding.
- **Drafts stay drafts.** Sizes and priorities become commitments only when people agree to them.
- **Automation fails quietly.** A routine report needs a "what I could NOT check" line, and someone who reads it.

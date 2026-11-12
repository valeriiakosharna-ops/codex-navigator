---
title: Code review and security scans
summary: Use Codex to review pull requests and local changes, then the Codex Security plugin to catch vulnerabilities before production, and read the results critically, without blind trust.
duration: ~60 min
audience: [everyone]
---

## Why this matters

When an agent writes code faster than people can read it, review becomes the bottleneck. Codex
helps on both sides. It can review a pull request, a branch or your uncommitted changes, and
**Codex Security** goes looking specifically for vulnerabilities such as injection, broken access
checks or leaked resources.

This topic is for everyone. Developers run the reviews and scans. PMs, leads and QA need to know
what a review or a "no findings" report does and doesn't prove.

```resource
title: Code review is no longer the bottleneck
url: https://www.youtube.com/watch?v=IZXv6a78NDw
provider: OpenAI · YouTube
format: video
duration: 2.5 min
level: beginner
focus:
  - Where automated review fits next to human reviewers. It doesn't replace them.
```

## Reviewing with Codex

```resource
title: Code review
url: https://learn.chatgpt.com/docs/code-review
provider: OpenAI Docs
format: docs
duration: 15 min
level: intermediate
why: The Code Review plugin in the desktop app (pull requests, comments, checks), local reviews of your own changes, and how to work with the results.
focus:
  - "*Choose a review scope*: uncommitted changes, a branch against its base, a specific commit."
  - "*Customize your review*: telling the reviewer what to focus on, for example security, performance or the team's conventions."
  - Inline comments as feedback, and continuing in a chat to fix what the review found.
  - GitHub review is generally available; GitLab merge requests are in preview.
```

> [!TIP] Make the reviewer know your rules
> A review is better when it knows what *your* team cares about. Module 4 shows how review rules in
> `AGENTS.md` steer every review automatically.

```usecase
title: Second pair of eyes before a PR
who: Developer
situation: You've finished a feature branch with Codex's help. Before you ask a colleague to review, you want the obvious issues gone.
prompt: |
  Review my branch against main. Focus on: behaviour changes not mentioned in the
  PR description, missing tests for new branches of logic, error handling,
  and anything that touches authentication or personal data.
  Report findings by severity with file:line. Don't change any code.
outcome: A prioritised list of findings with locations. You fix the real ones before a human spends time on the PR.
tips:
  - Keep the review read-only, then fix in a separate step so you can see what changed and why.
  - Your colleague still reviews. Codex removes the noise so they can focus on design and intent.
```

## Security scans

```resource
title: How to run your first Codex Security scan
url: https://www.youtube.com/watch?v=hUhr0JiVZZs
provider: OpenAI · YouTube
format: video
duration: 7 min
level: beginner
focus:
  - Installing the plugin, choosing the scope and reading the first report.
```

```resource
title: Codex Security plugin quickstart
url: https://learn.chatgpt.com/docs/security/plugin
provider: OpenAI Docs
format: docs
duration: 15 min
level: intermediate
why: Install the Codex Security plugin in the desktop app or CLI, run a standard **read-only** scan of a local repository, and review the findings. Your source isn't changed. The scan saves a report with evidence and remediation guidance.
focus:
  - "*Interpret the result*: check the target and revision first, then which areas were reviewed and which were **deferred**."
  - '"A review that reports no findings hasn''t necessarily ruled out every vulnerability." Remember this sentence.'
  - "*What the scan creates*: `report.md` for people; `findings.json` and `coverage.json` for tools."
  - In a managed workspace the plugin may show "Disabled by admin". That's a policy decision, not a bug.
```

| | Standard scan | Deep scan |
|---|---|---|
| What it does | One review of the repository or folder | Several independent standard scans, with findings combined |
| Use it for | A first scan, or a defined scope | Extra independent reviews when you can afford more time and tokens |
| Guarantees | No guarantee of complete detection | Still none, and results can differ between runs |

```resource
title: Run a deep security scan
url: https://learn.chatgpt.com/docs/security/plugin/deep-scans
provider: OpenAI Docs
format: docs
duration: 8 min
why: When repeated review is worth the extra runtime and token use, and how to handle an interrupted scan.
focus:
  - The advice to start with a **standard** scan to check that the scope and security context are right before you spend a deep scan.
```

```resource
title: How to enable PR security reviews with Codex Security
url: https://www.youtube.com/watch?v=vdBDMj2UhDg
provider: OpenAI · YouTube
format: video
duration: 6.5 min
level: intermediate
why: Moving from one-off scans to security review of every pull request.
```

```resource
title: Review code changes for security
url: https://learn.chatgpt.com/docs/security/plugin/code-changes
provider: OpenAI Docs
format: docs
duration: 10 min
why: Reviewing a pull request or local changes for security regressions, by hand or in CI/CD, and acting on the findings.
```

```resource
title: Codex Security overview
url: https://learn.chatgpt.com/docs/security
provider: OpenAI Docs
format: docs
duration: 5 min
why: Picking the right entry point. The plugin is for local, interactive work, the CLI for repeatable scans and CI, the SDK for your own tools, and Daybreak Defense Factory for connected GitHub repos in the cloud.
```

## Reading findings without blind trust

> [!WARNING] Two opposite mistakes
> **Trusting "no findings"**: the docs say coverage can have gaps, and some areas get deferred.
> **Trusting every finding**: each one comes with source evidence, the attacker's prerequisites,
> how it was validated and what remains uncertain. Use that to decide whether it really applies to
> your system before anyone spends a day fixing it.

```checklist
id: finding-triage
title: Before you act on a security finding
items:
  - text: Check the target and revision the scan ran on
    hint: An old revision or the wrong folder makes the whole report irrelevant.
  - text: Read the source evidence and the attacker's prerequisites
    hint: '"Requires admin access to the server" changes the priority a lot.'
  - text: Note the stated uncertainty
  - text: Decide whether it applies to your deployment, and write down why
  - text: Fix in a separate, reviewed change, and re-run the scan on that change
done: That's a finding handled with evidence, not on faith.
```

## Check yourself

```quiz
id: review-security
questions:
  - q: A Codex Security scan of your repo reports no findings. What can you conclude?
    options:
      - The code has no vulnerabilities
      - Nothing was found in the areas reviewed. Check the coverage and deferred areas before saying more
      - The scan failed
      - You should immediately run a deep scan
    answer: 1
    explain: The quickstart says it directly. A completed scan can have coverage gaps, and "no findings" doesn't rule out every vulnerability.
  - q: When does a deep scan make sense?
    options:
      - As the very first scan of a new repository
      - When a standard scan has confirmed the scope is right and you want extra independent review, accepting more time and tokens
      - Whenever a pull request is opened
      - When you need guaranteed complete detection
    answer: 1
    explain: Start standard to validate the scope. A deep scan adds repeated review, but there's still no guarantee of completeness.
  - q: A finding says "SQL injection in the report export, requires an authenticated admin session". What's the best next step?
    options:
      - Ignore it, because only admins can reach it
      - Read the evidence and prerequisites, judge the real exposure for your deployment, then prioritise and fix in a reviewed change
      - Let Codex patch it directly on main
      - Disable the export feature for everyone
    answer: 1
    explain: The prerequisites lower the urgency but don't remove the risk. Decide based on evidence, and fix through review.
  - q: Which review scopes does Codex support for your own work?
    options:
      - Uncommitted changes
      - A branch compared with its base
      - A specific commit
      - Only pull requests already on GitHub
    answer: [0, 1, 2]
    explain: You can review locally before anything is pushed. GitHub pull requests are one more option, not the only one.
```

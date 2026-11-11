---
title: The plan → build → test → review loop
summary: Make Codex verify its own work, then review the diff yourself or with /review and GitHub code review.
duration: 35 min
---

## Why this matters

An agent can produce a lot of code quickly. The bottleneck moves to **verification**. Teams
that get value from Codex make "done" mean *tested and reviewed*, not just *written*.

```resource
title: Codex best practices — Testing and review
url: https://learn.chatgpt.com/guides/best-practices#testing-and-review
provider: OpenAI Docs
format: docs
duration: 10 min
why: The official description of the verification loop and the review tools.
focus:
  - "The loop: write or update tests → run checks → confirm behaviour → review the diff."
  - "The `/review` targets: base branch, uncommitted changes, a specific commit, custom instructions."
```

## The loop

```order
id: work-loop
title: A healthy Codex task
prompt: Put the loop in order.
items:
  - Describe goal, context, constraints and done-when
  - Review and approve Codex's plan
  - Codex implements the change
  - Codex writes or updates tests and runs lint, types and tests
  - You review the diff (or run /review) and give feedback
  - Commit or open a pull request
explain: Plan before code, verify before commit. Codex runs the checks; a human still reads the diff.
```

> [!TIP] While you watch Codex 102
> Count how often the presenters ask Codex to run the tests. Treat every task that ends without a check as a warning sign.

## Review tools

- **In the desktop app**, use the diff panel. Comment on specific lines, and your feedback goes into the next turn.
- **`/review` in the CLI** reviews changes without modifying your working tree: against a base branch, uncommitted changes or a commit.
- **GitHub code review**: Codex can review pull requests automatically, or when someone mentions it.

```resource
title: Code review with Codex
url: https://learn.chatgpt.com/docs/code-review
provider: OpenAI Docs
format: docs
duration: 10 min
level: intermediate
focus:
  - How to trigger reviews on PRs automatically or by mention.
  - Adding team review rules (e.g. a `code_review.md` referenced from AGENTS.md).
```

```usecase
title: Second pair of eyes before a PR
who: Developer finishing a feature branch
situation: You wrote most of the feature yourself and want a quick independent review before asking colleagues.
prompt: |
  /review against main. Focus on error handling and on any behaviour
  change that is not covered by tests. List findings by severity; do not edit files.
outcome: A prioritised list of findings with file and line references. Your working tree is untouched.
tips:
  - Ask for findings "by severity" so the important ones aren't buried.
  - Agent review supplements human review. It doesn't replace it.
```

> [!WARNING] Common pitfall
> Watching Codex step by step instead of working in parallel. Give it a clear done-when, let it
> run the checks, and come back to review the result.

## Check yourself

```quiz
id: loop
questions:
  - q: What does `/review` do to your working tree?
    options: [Applies fixes automatically, Nothing. It only reports findings, Creates a new branch]
    answer: 1
    explain: The CLI review reads changes and reports. It doesn't modify files.
  - q: Which make a task "done" in a healthy loop?
    options: [Code is written, Relevant checks pass, The diff has been reviewed, Codex says it is done]
    answer: [1, 2]
    explain: Done means verified and reviewed, not just claimed.
  - q: Where can Codex review pull requests automatically?
    options: [Only in the CLI, In GitHub, Only in the IDE]
    answer: 1
    explain: Codex can review PRs automatically or when mentioned.
```

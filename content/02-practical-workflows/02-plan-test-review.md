---
title: The plan → build → test → review loop
summary: Make Codex verify its own work, then review the diff yourself or with /review and GitHub code review.
duration: 35 min
---

## Why this matters

An agent can produce a lot of code quickly, so the bottleneck moves to **verification**. Teams
that get value from Codex make "done" mean *tested and reviewed*, not just *written*.

```resource
title: Codex best practices — “Improve reliability with testing and review”
url: https://learn.chatgpt.com/guides/best-practices
provider: OpenAI Docs
format: docs
duration: 10 min
why: Scroll to the section “Improve reliability with testing and review”. It's the official description of the verification loop and the review tools.
focus:
  - "The loop: write or update tests → run the relevant checks → confirm behaviour → review the diff."
  - "The `/review` targets: a base branch, uncommitted changes, a specific commit, or custom instructions."
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
explain: Plan before code, verify before commit. Codex runs the checks, but a human still reads the diff.
```

> [!TIP] While you watch the bootcamp recordings
> Count how often the presenters ask Codex to run the tests. Treat every task that ends without a check as a warning sign.

## Review tools

- **In the desktop app**, use the diff panel and comment on specific lines. Your feedback goes into the next turn.
- **`/review` in the CLI** starts a dedicated reviewer that reports prioritised findings without modifying your working tree.
- **GitHub**: Codex can review pull requests automatically, or when someone mentions `@codex review`.

```resource
title: Code review
url: https://learn.chatgpt.com/docs/code-review
provider: OpenAI Docs
format: docs
duration: 10 min
level: intermediate
focus:
  - Automatic pull request reviews, which need the ChatGPT Codex connector and repository permissions.
  - Reviewing a PR in chat doesn't post comments, approve or merge. You choose which findings to send.
  - Team-wide review instructions live in the desktop app under Settings → Code Review.
```

```usecase
title: Second pair of eyes before a PR
who: Developer finishing a feature branch
situation: You wrote most of the feature yourself and want a quick independent review before asking colleagues.
prompt: |
  /review against main. Focus on error handling and on any behaviour
  change that is not covered by tests. List findings by severity.
outcome: A prioritised list of findings with file and line references. Your working tree is untouched.
tips:
  - Asking for findings "by severity" keeps the important ones from getting buried.
  - Agent review supplements human review. It doesn't replace it.
```

> [!WARNING] Common pitfall
> Watching Codex step by step instead of working in parallel. Give it a clear done-when, let it
> run the checks, and come back to review the result.

## Check yourself

```quiz
id: loop
questions:
  - q: You run `/review` against `main` on a branch with uncommitted work. What happens to your files?
    options:
      - Codex applies its suggested fixes and leaves them unstaged
      - Nothing changes. You get a prioritised list of findings
      - Codex stashes your changes, reviews, then restores them
      - Codex opens a pull request with its comments
    answer: 1
    explain: The reviewer reads the selected diff and reports. It doesn't modify your working tree.
  - q: Which of these should be true before you call an agent task "done"?
    options:
      - The relevant tests and checks pass
      - Codex reports that the task is complete
      - Someone has read the diff
      - The change touches no more than one file
    answer: [0, 2]
    explain: Done means verified and reviewed. The agent saying so isn't evidence, and the size of the change doesn't matter.
  - q: You ask Codex to review a teammate's PR in the desktop app chat. Which statement is true?
    options:
      - The review comments are posted to GitHub automatically
      - The PR is approved if no critical issues are found
      - Nothing is posted until you choose findings and submit them
      - Chat reviews only work on PRs you authored
    answer: 2
    explain: Reviewing in chat doesn't post, approve or merge anything. You decide what to send.
```

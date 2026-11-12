---
title: Closed-loop testing and debugging
summary: Let Codex run builds, linters and tests, read the failures and fix its own work, locally and in the cloud, and recognise when "tests pass" proves nothing.
duration: ~50 min
audience: technical
slug: plan-test-review
---

## Why this matters

An agent can write a lot of code quickly, so the bottleneck moves to **verification**. Codex closes
the loop itself: it runs the build, linters and tests, reads the stack trace, changes the code and
runs everything again until it passes. That loop is only as good as two things you control. First,
the environment has to be able to run the checks at all. Second, passing the checks has to actually
mean the code works.

```resource
title: Codex checks its work for you
url: https://www.youtube.com/watch?v=dHCNpcNyoFM
provider: OpenAI · YouTube
format: video
duration: 2.5 min
level: beginner
focus:
  - The run → fail → read → fix → re-run loop. Notice what Codex looks at when a check fails.
```

```resource
title: Best practices, "Improve reliability with testing and review"
url: https://learn.chatgpt.com/guides/best-practices
provider: OpenAI Docs
format: docs
duration: 10 min
why: Go to the section on testing and review. It's the official description of the verification loop.
focus:
  - "The loop: write or update tests → run the relevant checks → confirm behaviour → review the diff."
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
  - Codex runs build, lint and tests, reads the failures and fixes them
  - You review the diff and the evidence Codex reports
  - Commit or open a pull request
explain: Plan before code, verify before commit. Codex runs the checks, but a human still reads the diff.
```

## Make the loop possible: environments

If Codex can't install dependencies or start the test runner, it can't close the loop, and it may
quietly "verify" by reading the code instead. Set the environment up once:

```resource
title: Local environments
url: https://learn.chatgpt.com/docs/environments/local-environment
provider: OpenAI Docs
format: docs
duration: 5 min
why: Setup scripts that run automatically for each new worktree (install dependencies, initial build), plus one-click actions such as "Run tests". The config lives in `.codex/` and can be committed for the whole team.
```

```resource
title: Cloud environments
url: https://learn.chatgpt.com/docs/environments/cloud-environments
provider: OpenAI Docs
format: docs
duration: 15 min
why: How to create and publish a reusable Codex Cloud environment with the repositories, dependencies, tools and access its tasks need, so that cloud tasks can run your checks while your laptop sleeps.
focus:
  - "*Customize installation and startup* and *Reuse and update saved state*: getting dependencies installed once, not on every task."
  - Environment variables vs secrets, and which network access the environment really needs.
  - "*Troubleshoot setup and runtime access*: read it before you assume the agent is at fault."
```

> [!NOTE] About the "Legacy" cloud page
> The older page *Codex Cloud (Legacy)* still covers Code Review and the GitHub and Linear
> integrations, but OpenAI plans to deprecate it. For new environments, use **Cloud environments** above.

## Debugging with Codex

```usecase
title: A flaky test
who: Backend developer
situation: "`test_checkout_total` fails about once in ten CI runs. Nobody can reproduce it locally."
prompt: |
  Investigate why tests/test_checkout.py::test_total fails intermittently.
  1) Reproduce it first: run it 50 times and report the failure rate.
  2) Find the root cause. Show the evidence (stack traces, timing, shared state).
  3) Fix the cause, not the symptom. Do not change the assertion or add retries.
  Done when 50 consecutive runs pass, and you list what you did NOT verify.
outcome: A reproduction, a root-cause explanation backed by evidence, a minimal fix and the loop output.
tips:
  - Ask for the reproduction **before** the fix. A fix for a bug nobody reproduced is a guess.
  - '"Do not change the assertion" blocks the most common fake fix.'
```

```resource
title: Debug web apps with browser use in Codex
url: https://www.youtube.com/watch?v=bhgYFRZLyKI
provider: OpenAI · YouTube
format: video
duration: 1.5 min
level: beginner
why: For front-end bugs, Codex can open the app in a browser, reproduce the issue and check the fix visually, which closes the loop for UI problems that unit tests don't catch.
```

## When "tests pass" means nothing

> [!WARNING] Fake green
> An agent told to "make the tests pass" can do it the wrong way. It can **change the assertion** to
> match the bug, **skip** or delete the failing test, **mock** away the code under test, or catch and
> swallow the exception. Always read the test diff as carefully as the code diff. The lab in this
> module trains exactly this.

```compare
title: Asking for a fix
weak:
  prompt: The tests are red. Make them pass.
  note: Every fake fix in the warning above satisfies this prompt.
strong:
  prompt: |
    The discount tests fail after yesterday's change. Find out why.
    Fix the production code; don't modify, skip or delete tests unless you
    explain why the test itself is wrong and I approve it.
    Done when the full suite passes; report the commands and output.
  note: The constraint closes off the shortcuts, and any change to a test needs your approval.
```

```resource
title: Troubleshooting
url: https://learn.chatgpt.com/docs/reference/troubleshooting
provider: OpenAI Docs
format: docs
duration: 10 min
why: The official FAQ for things that go wrong around the agent rather than in your code, such as code that doesn't run in a worktree, stuck states, terminal issues and network access.
focus:
  - "*Code doesn't run on a worktree*: usually a missing setup script."
  - "*Stuck states and recovery patterns*."
```

## Check yourself

```quiz
id: closed-loop
questions:
  - q: Codex reports "verified, tests pass", but its log shows the test runner was never installed in the cloud environment. What's the real problem?
    options:
      - The model is lying, so switch models
      - The environment can't run the checks. Fix the setup or saved state, then re-run, and don't accept "verified" without command output
      - Tests aren't needed in the cloud
      - Increase reasoning effort
    answer: 1
    explain: The loop needs an environment that can execute the checks. Without command output, "verified" is a claim.
  - q: Which changes in a "fixed the failing tests" diff should make you stop and look closer?
    options:
      - An `expect(...)` value changed to match the current output
      - A test renamed to `it.skip`
      - A new test added for the bug that was fixed
      - A try/catch added around the code under test that ignores the error
    answer: [0, 1, 3]
    explain: Those three turn red into green without fixing anything. A new regression test is what you want to see.
  - q: New worktrees keep failing because `node_modules` is missing. What's the intended fix?
    options:
      - Commit `node_modules` to the repo
      - A setup script in the project's local environment that installs dependencies for each worktree
      - Stop using worktrees
      - Ask Codex to install dependencies by hand every time
    answer: 1
    explain: Local environments run setup scripts automatically for each new worktree, and you can commit the config for the whole team.
  - q: For a bug that only shows up in the UI, what helps Codex close the loop?
    options:
      - Only unit tests
      - Browser use, so it can reproduce the issue and check the fix visually
      - A higher reasoning effort
      - Turning off the sandbox
    answer: 1
    explain: Codex can drive a browser to reproduce and verify UI behaviour that unit tests don't cover.
```

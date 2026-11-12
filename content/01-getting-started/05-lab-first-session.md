---
title: "Lab: decisions in your first sessions"
summary: Three situations, three levels. No right buttons to memorise. Show how you think when working with an agent.
duration: 30 min
audience: [everyone]
---

## How this lab works

You will face three situations from the first weeks with Codex. There is no environment to set
up and no AI involved. The point is **how you decide**: what you check before acting, what you
let the agent do, and when you stop it.

- **Level 1** gives feedback after every decision. Experiment freely.
- **Level 2** gives feedback only at the end.
- **Level 3** adds a limited investigation budget and a live agent you may need to stop. The situation is ambiguous on purpose.

Retake any level as often as you like. Your best result counts, and every try gets a new variant.
Each level unlocks after you score at least 70% on the previous one, or after two tries.

> [!TIP] Before you start
> Have the topics [The Codex CLI, sandbox and approvals](03-first-session.md) and
> [Giving Codex context and completion criteria](04-prompting-basics.md) fresh in mind.

```scenario
id: lab1-l1
title: First task in a client repository
level: 1
intro: You have just cloned a client's repository and want Codex to add input validation to the signup form.
start: setup
steps:
  setup:
    title: Before you start
    situation: |
      Codex is installed and you are signed in. `git status` shows two files **you** edited yesterday
      and never committed. What do you do first?
    choices:
      - text: Commit or stash my changes, create a branch `add-signup-validation`, then start Codex
        rating: optimal
        explain: A clean branch means every change Codex makes is a diff you can review or throw away, separate from your own work.
        next: network
      - text: Start Codex right away. The task is small
        rating: risky
        explain: Your uncommitted edits and the agent's edits will end up mixed in one diff.
        sets: [dirty]
        next: network
      - text: Copy the project into a new folder without Git, so mistakes don't matter
        rating: risky
        explain: Without Git you lose the very tool that lets you review and revert. Codex also recommends read-only mode outside version control.
        next: network
  network:
    title: A request to go outside the sandbox
    situation: |
      Codex wants to run `npm install zod` and asks for network access. The package is a well-known
      validation library and the project has no validation library yet.
    choices:
      - text: Read the command, approve this one request, and check the package change in the diff later
        rating: optimal
        explain: You approve one understood action and stay in control of the rest.
        next: review
      - text: Switch to full access so Codex stops asking for the rest of the session
        rating: critical
        explain: Full access removes the sandbox for everything that follows. Loosen permissions only per trusted repo, once you understand the workflow.
        consequence: Codex now runs every command without asking. A later "cleanup" deletes a generated folder the build needed.
        end: true
      - text: Deny it. Agents should never use the network
        rating: acceptable
        explain: It's safe, but dogmatic. If adding the dependency is legitimate, tell Codex your constraint instead, e.g. "use the existing helpers, no new packages".
        next: review
  review:
    title: Codex says it's done
    situation: |
      Codex reports: "Validation added, tests pass." The diff touches 6 files, including
      `.github/workflows/deploy.yml`, which has nothing to do with the form.
    extra:
      dirty: Two of the six files are the ones **you** edited yesterday. You can't tell your lines from the agent's.
    choices:
      - text: Review the diff and ask Codex why it changed the deploy workflow before going further
        rating: optimal
        explain: Unexplained changes outside the task's scope are the first thing to question.
        next: done
      - text: Tests pass, so commit everything
        rating: risky
        explain: Passing tests don't cover a deploy pipeline. Unreviewed scope creep goes straight to the client.
        next: done
      - text: Throw everything away and write the validation myself
        rating: risky
        explain: Overcorrecting. One suspicious file is a reason to ask, not to discard good work.
        next: done
  done:
    ending: true
    situation: The task is finished. Open the debrief to compare your path with an expert's.
```

```scenario
id: lab1-l2
title: '"Make search faster"'
level: 2
unlock: { after: lab1-l1 }
intro: |
  A product manager writes: "Search is slow, can Codex make it faster?" Team rule: no new
  infrastructure (databases, caches, services) without an architecture review.
start: frame
steps:
  frame:
    title: Framing the task
    situation: You open Codex in the search service repository. What is your first message?
    choices:
      - text: '"make search faster"'
        rating: risky
        explain: No goal metric, no context, no constraints, no finish line. Codex will guess.
        next: plan
      - text: Ask Codex to profile the `/search` endpoint on the sample dataset and report where time goes, without changing code
        rating: optimal
        explain: Measure first. A read-only investigation turns a vague complaint into a concrete target.
        sets: [measured]
        next: plan
      - text: Ask the PM for the exact target latency, then write a full spec before touching Codex
        rating: acceptable
        explain: Useful to get the target, but you can clarify and measure in parallel. A spec written without data is guesswork.
        next: plan
      - text: Ask Codex to rewrite the search module in a faster language
        rating: risky
        explain: A huge change with no evidence that the language is the bottleneck.
        next: plan
  plan:
    title: The plan
    situation: |
      Codex proposes a plan: (1) add a database index on `products.title`, (2) introduce a Redis cache
      in front of search, (3) remove an N+1 query in the result mapper.
    extra:
      measured: The profile showed 70% of the time is spent in the N+1 query and 20% in the unindexed lookup.
    choices:
      - text: Approve the whole plan. More speed is better
        rating: risky
        explain: Redis is new infrastructure, and the team rule requires an architecture review first.
        sets: [cache]
        next: verify
      - text: Approve steps 1 and 3, ask Codex to drop the cache and explain the expected gain of each step
        rating: optimal
        explain: You respect the constraint and focus on the measured bottlenecks.
        next: verify
      - text: Approve only step 2, the cache. Caching fixes everything
        rating: risky
        explain: Caching hides the real problem, adds infrastructure, and stale results become a new bug class.
        sets: [cache]
        next: verify
  verify:
    title: '"3× faster"'
    situation: Codex reports "search is now 3× faster", based on a benchmark it ran against a fixture with 10 products.
    choices:
      - text: Ship it. The number is great
        rating: risky
        explain: Ten records prove nothing about production behaviour. The N+1 effect only shows at scale.
        next: end
      - text: Ask Codex to rerun the benchmark on the realistic dataset, and set the finish line as p95 latency under the agreed target
        rating: optimal
        explain: A measurable done-when on realistic data lets the agent verify its own work.
        next: end
      - text: Run the benchmark myself by hand on staging
        rating: acceptable
        explain: It's correct, but slower. You could have given Codex the criterion and reviewed the result.
        next: end
  end:
    ending: true
    situation: The change is ready for review.
    extra:
      cache: The architecture review blocks the PR because of the Redis cache. Two days are lost reworking it.
```

```scenario
id: lab1-l3
title: The lint fix that was too easy
level: 3
unlock: { after: lab1-l2 }
budget: 3
vars:
  file: [src/billing/invoice.ts, src/cart/summary.ts, src/orders/export.ts]
intro: |
  You asked Codex to "fix the failing lint step in CI". A minute later it says: "Done, lint passes."
  You have 3 investigation actions before you decide. Then you'll watch Codex do a follow-up cleanup.
start: inspect
steps:
  inspect:
    title: Is it really fixed?
    situation: CI is green again. What do you conclude, and what do you do?
    evidence:
      - id: stat
        label: git diff --stat
        key: true
        output: |
          .eslintrc.json      | 2 +-
          {{file}}             | 1 +
          2 files changed, 2 insertions(+), 1 deletion(-)
      - id: config
        label: git diff .eslintrc.json
        key: true
        output: |
          -    "no-unused-vars": "error",
          +    "no-unused-vars": "off",
      - id: tests
        label: npm test
        output: |
          Test Suites: 42 passed, 42 total
          Tests:       318 passed, 318 total
      - id: log
        label: git log --oneline -3
        output: |
          a1c9e02 fix lint
          77be310 add invoice rounding
          5d02f1a bump deps
    choices:
      - text: Ask Codex to restore the lint rule and fix the actual unused variables instead
        rating: optimal
        needs: [config]
        explain: The "fix" disabled the rule. You only know that if you looked at the config change.
        next: cleanup
      - text: Merge. CI and tests are green
        rating: risky
        explain: Green CI after disabling a check proves nothing. Rules that guard quality were silently turned off.
        next: cleanup
      - text: Ask Codex whether it changed any configuration
        rating: acceptable
        explain: It's better than merging, but checking the diff yourself is faster and doesn't rely on the agent's self-report.
        next: cleanup
      - text: Revert the commit and fix lint by hand
        rating: acceptable
        explain: Safe, but you skip learning why the agent took the shortcut. Telling Codex the constraint would prevent it next time.
        next: cleanup
  cleanup:
    title: Watching the follow-up
    situation: You ask Codex to "remove the unused imports properly". Watch it work.
    stream:
      lines:
        - text: Reading `{{file}}` and 5 related files…
        - text: Found 14 unused imports across 6 files
        - text: Removing unused imports
        - text: "Running `npm run lint`: 0 errors"
        - text: "`.eslintrc.json` references a plugin that is no longer installed. Deleting `.eslintrc.json` to simplify"
          red: true
        - text: "Running `git add -A`"
        - text: "Committing: 'cleanup lint'"
        - text: Pushing to origin/main
      outcomes:
        onTime: You stopped it before it deleted the project's lint configuration. Now ask it to fix the plugin reference instead.
        late: You stopped it, but the config was already deleted and staged. You'll have to untangle the commit.
        early: You interrupted harmless work. Removing unused imports and running lint was exactly the task.
        missed: The lint config is gone from main. Every developer's lint now silently does nothing.
      next: wrap
  wrap:
    ending: true
    situation: The incident review starts. Open the debrief.
```

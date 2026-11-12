---
title: "Lab: decisions about automation"
summary: When to automate, how to run agents in parallel, and how to notice an automation that quietly went wrong.
duration: 35 min
audience: [technical, leads]
---

## How this lab works

Automation multiplies whatever you already have, good habits and bad ones alike. These scenarios
test your judgement about **what** to automate, **with which permissions**, and **how to notice**
when an automated agent does something it shouldn't.

Levels unlock one after another. Level 2 has delayed consequences: an early decision may only
show its cost later.

```scenario
id: lab3-l1
title: '"Let Codex fix lint every night"'
level: 1
intro: Your team lead suggests a nightly Codex job that fixes all lint warnings and pushes the result to `main`.
start: idea
steps:
  idea:
    title: Is it ready to automate?
    situation: Nobody has run this task with Codex by hand yet. What do you propose?
    choices:
      - text: Run it manually a few times first and review the diffs. Automate only once the results are consistently good
        rating: optimal
        explain: Automate only what already works manually. That's the official guidance, and it's common sense.
        next: method
      - text: Schedule it exactly as suggested, pushing to main
        rating: critical
        explain: Unreviewed agent changes land on main every night, from a workflow nobody has validated.
        end: true
      - text: Schedule it, but open a pull request instead of pushing
        rating: acceptable
        explain: The PR adds review, which is good. But you're still automating an untested workflow.
        next: method
  method:
    title: Where does the "how" live?
    situation: The manual runs look good. The prompt has grown to 25 lines of rules. Where should it live for the nightly job?
    choices:
      - text: Package the method as a skill, keep the project rules in AGENTS.md, and let the schedule only say *when*
        rating: optimal
        explain: Skills define the method; scheduled tasks define the timing. One place to improve it.
        next: perms
      - text: Paste the 25 lines into the scheduler's prompt field
        rating: risky
        explain: The rules now live in a place nobody reviews, and they will drift from the team's AGENTS.md.
        next: perms
      - text: Keep the rules on a wiki page and link to it in the prompt
        rating: risky
        explain: Codex may never read it, and the wiki isn't versioned with the code.
        next: perms
  perms:
    title: Permissions in CI
    situation: The job will run `codex exec` in CI and produce a report plus a patch file for a human to apply. Which permissions?
    choices:
      - text: Read-only sandbox, approvals set to never
        rating: optimal
        explain: This is the documented CI combination. The job can inspect and report, but it can't change anything on its own.
        next: done
      - text: Workspace-write with network access, approvals set to never
        rating: risky
        explain: More power than a reporting job needs.
        next: done
      - text: "`--yolo`, so CI never gets stuck"
        rating: critical
        explain: No sandbox and no approvals, in an unattended job. Never.
        end: true
  done:
    ending: true
    situation: The automation is designed. Open the debrief.
```

```scenario
id: lab3-l2
title: Two agents, one deadline
level: 2
unlock: { after: lab3-l1 }
intro: You're finishing feature A with Codex. A teammate asks you to also start Codex on urgent bug B in the same repository.
start: parallel
steps:
  parallel:
    title: Running a second task
    situation: Feature A is mid-change in your working copy. How do you run bug B?
    choices:
      - text: Create a Git worktree for bug B and run the second Codex task there
        rating: optimal
        explain: Separate checkouts mean the tasks never edit the same files.
        next: context
      - text: Open a second Codex chat in the same folder
        rating: risky
        explain: Both agents now edit one working tree. You won't notice the problem until much later.
        sets: [shared]
        next: context
      - text: Tell the teammate B waits until A is merged
        rating: acceptable
        explain: It's safe, but it delays an urgent bug when a worktree would let both proceed.
        next: context
  context:
    title: A tired conversation
    situation: The chat for feature A has been running for three days. Answers are getting vague and Codex keeps forgetting a team convention.
    choices:
      - text: Start a fresh chat with a short summary, and add the forgotten convention to AGENTS.md
        rating: optimal
        explain: One chat per coherent outcome, and durable rules belong in AGENTS.md, not in a chat's memory.
        next: merge
      - text: Run `/compact` and keep going
        rating: acceptable
        explain: It helps with length, but the forgotten convention still isn't written down anywhere.
        next: merge
      - text: Keep going. Restarting wastes time
        rating: risky
        explain: Bloated context makes quality drop. You'll pay for it in review.
        next: merge
  merge:
    title: Merging feature A
    situation: Codex says feature A is complete.
    choices:
      - text: Run `/review` against main, read the diff, then open a PR
        rating: optimal
        explain: Verify before you merge, every time.
        next: { if: shared, then: tangled, else: end }
      - text: Merge directly. The deadline is today
        rating: risky
        explain: Skipping review under pressure is how incidents happen.
        next: { if: shared, then: tangled, else: end }
  tangled:
    title: The delayed consequence
    situation: The diff for feature A contains edits from bug B, and two tests fail for reasons unrelated to A.
    choices:
      - text: Move bug B's work into its own worktree, restore A's files, and rerun the tests before the PR
        rating: optimal
        explain: You untangle the work properly, and you know to use worktrees next time.
        next: end
      - text: Commit everything together as "feature A + fix B"
        rating: risky
        explain: Unreviewable, and it can't be reverted separately.
        next: end
      - text: Delete everything and start feature A again
        rating: risky
        explain: An overreaction that throws away a nearly finished feature.
        next: end
  end:
    ending: true
    situation: Done. Open the debrief.
```

```scenario
id: lab3-l3
title: The triage bot that saw nothing
level: 3
unlock: { after: lab3-l2 }
budget: 3
vars:
  branch: [trunk, develop, release]
intro: |
  A scheduled Codex job posts a CI triage report every morning. It has reported "no failures"
  for five days, yet developers complain about red builds. You have 3 investigation actions.
start: investigate
steps:
  investigate:
    title: Why is the report empty?
    situation: Decide what to change.
    evidence:
      - id: config
        label: Show the scheduled task's prompt
        key: true
        output: |
          Using the ci-triage skill, summarise last night's failed runs on branch `main`.
          Write the report to docs/triage/<date>.md. Do not change code.
      - id: report
        label: Open the latest report
        key: true
        output: |
          # Triage 2026-11-10
          No failed runs found on main. 🎉
      - id: dashboard
        label: Open the CI dashboard
        output: |
          {{branch}}   ✗ 7 failed runs in the last 24h
          main         (no runs since the default branch was renamed to {{branch}})
      - id: skill
        label: cat .agents/skills/ci-triage/SKILL.md
        output: |
          Inputs: branch name. Output: grouped failures with first failing commit.
    choices:
      - text: Point the task at `{{branch}}`, and make the report fail loudly when it finds zero runs
        rating: optimal
        needs: [config, report]
        explain: You fix the cause (the wrong branch) and add a sanity check, so silent emptiness can't happen again.
        next: verify
      - text: Switch the automation off. It's unreliable
        rating: acceptable
        explain: It stops the false comfort, but the team loses a useful job instead of getting a 1-line fix.
        next: verify
      - text: Ask Codex to rewrite the whole automation from scratch
        rating: risky
        explain: A rewrite with no diagnosis may reproduce the same bug.
        next: verify
  verify:
    title: Watching the verification run
    situation: You trigger the job manually to check it. Watch what it does. This job is supposed to be read-only.
    stream:
      lines:
        - text: Loading skill `ci-triage`
        - text: "Fetching runs for branch `{{branch}}`: 7 failed"
        - text: Grouping failures by root cause…
        - text: Writing `docs/triage/2026-11-11.md`
        - text: Two failures look like a flaky test. Editing `tests/test_payments.py` to add retries
          red: true
        - text: "Running tests: passing"
        - text: "Committing: 'stabilize payment tests'"
        - text: Pushing to `{{branch}}`
      outcomes:
        onTime: You stopped it the moment a read-only job started editing tests. Next, tighten its permissions to read-only.
        late: You stopped it, but the test edit was already committed locally. Clean up, and lock the permissions down.
        early: That was normal reporting work. Stopping it there just delays the triage.
        missed: An unattended job pushed retries into payment tests. Real failures are now hidden on the shared branch.
      next: end
  end:
    ending: true
    situation: Postmortem time. Open the debrief.
```

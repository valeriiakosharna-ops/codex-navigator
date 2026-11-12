---
title: Coordinating Codex across teams and systems
summary: Split a large change into workstreams, give each one a verification contract (the evidence it must produce and what happens if it fails), and bring parallel outputs back together safely.
duration: ~55 min
audience: technical
---

## Why this matters

One developer with one agent is easy to keep on track. Five teams, each running several agents on
one platform migration, is a different problem. The work rarely fails inside a workstream. It fails
**at integration**: two streams changed the same interface differently, one stream's "done" meant
"compiles", and nobody can tell which output can be trusted.

The *Scale Codex Across Teams and Systems* path is about exactly this: dividing complex work into
workstreams your team can verify and bring back together.

```resource
title: Scale Codex Across Teams and Systems
url: https://academy.openai.com/public/courses/scale-codex-across-teams-and-systems-jr83a
provider: OpenAI Academy
format: course
duration: ~100 min + assessment
level: advanced
access: Free OpenAI Academy account · badge
why: For experienced technical specialists who already have repeatable Codex team workflows. You leave with a method for splitting a complex change, a **verification contract** for each workstream, and a way to track evidence in longer-running, connected systems.
focus:
  - "The three outcomes on the course page. Use them as the structure of your notes: split, verification contract, tracking evidence."
  - This path assumes you've done *Extend Codex Workflows* or something equivalent.
```

```resource
title: From Single Player to Multiplayer with Codex (DevDay 2026)
url: https://www.youtube.com/watch?v=aDTPTwnrRyA
provider: OpenAI · YouTube
format: video
duration: 23 min
level: advanced
focus:
  - What changes when Codex goes from one person's tool to a team's shared workflow.
  - Where the speakers put the human checkpoints.
```

## Split the change into workstreams

A good split has workstreams that are **independent to build** and **cheap to integrate**: the
boundaries between them are interfaces that are agreed *before* anyone starts.

```compare
title: Splitting a migration
weak:
  prompt: "Team A does the backend, team B the frontend, team C the rest. Everyone uses Codex."
  note: The boundaries are org-chart lines, not interfaces. Nobody owns "the rest", and integration is left to luck.
strong:
  prompt: |
    Interface first: the new Orders API schema (orders.v2.yaml) is frozen by the platform team.
    WS1 Orders service implements v2 behind a flag. Owner: Platform. Writes: services/orders/
    WS2 Web checkout consumes v2 via the generated client. Owner: Web. Writes: web/checkout/
    WS3 Data migration script + dry run on a copy. Owner: Data. Writes: tools/migrate/
    Integration: Platform lead merges in order WS1 → WS3 → WS2, behind the flag.
  note: A frozen interface, one owner and one write area per stream, and an explicit order of integration.
```

## A verification contract for each workstream

The contract answers three questions **before** the work starts. What evidence must this stream
produce? Who checks it? What happens if a check fails?

```usecase
title: Verification contract for a workstream
who: Tech lead coordinating a migration
situation: Three workstreams run in parallel with Codex. Last time, "done" from one team meant "unit tests pass", and the integration broke in staging.
prompt: |
  For workstream WS3 (data migration), draft a verification contract:
  - required evidence: dry-run report on a production-size copy (row counts before/after,
    checksums per table, duration), rollback tested, idempotency test output;
  - who verifies it and how;
  - failure handling: what blocks integration, what can ship behind the flag;
  - what the stream must NOT change (other streams' write areas, the frozen schema).
  Save it as docs/migration/ws3-contract.md for review.
outcome: A one-page contract the stream's agents and people work against. Integration accepts evidence, not assurances.
tips:
  - Put the contract in the repo and reference it from AGENTS.md in that stream's folder, so every Codex session sees it.
  - '"Done" = the evidence in the contract exists and has been checked. Nothing less.'
```

## Run parallel work without collisions

```checklist
id: parallel-ready
title: Before parallel workstreams start
items:
  - text: Interfaces between streams are written down and frozen (or versioned)
  - text: Each stream has one owner and its own write area
    hint: Separate directories, branches or worktrees. Two agents never write to the same files.
  - text: Each stream has a verification contract in the repo
  - text: AGENTS.md in each area points to its contract and its boundaries
  - text: The integration order and the integration owner are agreed
  - text: Long-running agents have goals with explicit verification, and someone reviews their progress
done: Parallel work can start. Integration will check evidence, not hope.
```

```resource
title: Building an AI-native engineering team
url: https://learn.chatgpt.com/guides/build-ai-native-engineering-team
provider: OpenAI Docs
format: article
duration: 25 min
level: intermediate
why: OpenAI's guide for engineering leaders on how coding agents change each phase of the lifecycle (planning, design, build, test, review, deploy), with real examples and what to change in team process.
focus:
  - For each phase, what the guide says the agent does and what stays with engineers.
```

> [!TIP] Tools you already know, at team scale
> **Worktrees** keep parallel agents out of each other's files (module 3). **Subagents** split one
> person's task (module 4). **AGENTS.md per directory** carries each stream's rules and contract
> (module 4). **Goals** keep long-running work verifiable (module 3). Scaling is mostly about using
> these deliberately, with owners.

## Check yourself

```quiz
id: scale-teams
questions:
  - q: Three workstreams each report "done", yet the integration fails. What was most likely missing?
    options:
      - A more powerful model
      - Agreed interfaces and verification contracts defining what "done" must prove
      - More subagents per stream
      - A longer AGENTS.md
    answer: 1
    explain: Integration fails at the boundaries. Freeze interfaces first, and define done as "the agreed evidence exists and was checked".
  - q: Which belongs in a workstream's verification contract?
    options:
      - The evidence it must produce
      - Who verifies that evidence
      - What happens if a check fails
      - The model each developer prefers
    answer: [0, 1, 2]
    explain: The contract is about evidence, verification and failure handling. Model choice is an implementation detail inside the stream.
  - q: Two workstreams both need to change a shared configuration file. What's the safest arrangement?
    options:
      - Let both agents edit it and resolve conflicts at the end
      - Give the file one owner. The other stream requests changes through that owner, or the change is split into a separate, sequenced step
      - Ask each agent to be careful
      - Run both agents with higher reasoning effort
    answer: 1
    explain: One writer per area. Shared files need an owner or an explicit sequence.
  - q: Where should each workstream's contract live so Codex follows it in every session?
    options:
      - In the project manager's notes
      - In the repo, referenced from the AGENTS.md in that stream's directory
      - In each developer's personal config
      - In a chat message at the start of each session
    answer: 1
    explain: AGENTS.md is read automatically, and the contract in the repo is reviewable and versioned with the code.
```

---
title: Choosing models and managing usage
summary: Match the model and reasoning effort to the task, tell plan limits apart from credits, and keep repeated or long-running work affordable.
duration: ~40 min
audience: [everyone]
---

## Why this matters

Every Codex task spends something: your plan's included usage or, after that, credits. The most
powerful model at the highest effort is rarely the right default. It's slower, it uses more, and
for a well-scoped fix it isn't better. Teams that pick deliberately get more done within the same
plan, and they don't hit the limit on Thursday afternoon.

> [!NOTE] Model names change. The approach doesn't.
> The line-up below is from **November 2026**. OpenAI releases and retires models often (GPT-5.5 is
> being retired right now), so the **Models** page is always the source of truth. What lasts is the
> method: decide what you need, try the lightest setting that meets it, and compare on the same inputs.

```resource
title: Models
url: https://learn.chatgpt.com/docs/models
provider: OpenAI Docs
format: docs
duration: 15 min
level: beginner
why: The current models for Codex and ChatGPT Work, where each one does well, and how to switch model and reasoning effort in the app, CLI and IDE.
focus:
  - "Where each model shines: the most capable one, the near-equal that costs less, the fast one, the efficient one."
  - What **reasoning effort** changes, and the advice to start at the default and raise it only when a task needs more planning.
  - When **Max** and **Ultra** are worth it. The page says most tasks need neither.
```

## Two dials: model and reasoning effort

| You choose | What it changes | Start with |
|---|---|---|
| **Model** | How capable, how fast and how costly each step is | The default your workspace offers |
| **Reasoning effort** (Light/Low → Medium → High → Extra high) | How long the model thinks before acting | The default; raise it for multi-step work with trade-offs |
| **Max** | Even more thinking time for a single, very hard task | Only for the hardest problems |
| **Ultra** | Splits the task across **subagents** working in parallel | Only when the work really divides into parts. It uses more tokens. |
| **Fast mode** (`/fast`) | Same model, faster output, at a **higher usage rate** | When you're waiting on the result and usage isn't tight |

```resource
title: Model selection
url: https://learn.chatgpt.com/docs/model-selection
provider: OpenAI Docs
format: docs
duration: 10 min
why: A short guide to matching model and effort to the kind of work, with an interactive recommender.
focus:
  - The ladder from "efficient model, low effort" for fine-grained edits up to "most capable model, extra high effort" for demanding analysis.
  - "The four questions before you choose: how often the workflow runs, how fast you need it, how the output will be used, and how much quality matters."
  - The advice to set **acceptance criteria first**, then keep the lightest setting that meets them.
```

```compare
title: Choosing a setting for a recurring task
weak:
  prompt: "Always use the strongest model on Extra high. Quality first."
  note: Fine for a one-off, hard decision. For a nightly job or a stream of small fixes, it burns the plan's limit and adds nothing to quality.
strong:
  prompt: |
    Nightly changelog draft from merged PRs.
    Acceptance: every PR listed, grouped by area, no invented items.
    Try: efficient model, Medium → compare 3 nights with the default.
    Keep the lightest setting that passes the acceptance check.
  note: Acceptance criteria first, a like-for-like comparison, then the cheapest setting that passes.
```

## Limits, credits and where to check them

```resource
title: Pricing, usage limits and credits
url: https://learn.chatgpt.com/docs/pricing
provider: OpenAI Docs
format: docs
duration: 15 min
why: How included plan usage, credits and API-key usage fit together, plus OpenAI's own tips for making your limits last.
focus:
  - "**What happens at the limit**: a turn that is already running is allowed to finish. After that, Plus/Pro users can buy credits, and Business/Edu/Enterprise workspaces with flexible pricing can buy workspace credits."
  - "**Tokens vs credits**: tokens are what the model reads and writes; credits are what eligible usage costs once your included limits run out."
  - "**Where to look**: the usage dashboard, and `/status` inside a CLI session. The docs suggest checking every week or two."
  - Which **Code Review** usage is counted separately (reviews run through GitHub) and which counts towards your general limit.
```

> [!TIP] OpenAI's tips for making limits last, in short
> Be precise and leave out unnecessary context. Give only the relevant files. Ask for the format and
> length you actually need. Keep `AGENTS.md` small: in a large repo, nest several short files instead
> of one big one.

```usecase
title: The team that ran out by Wednesday
who: Delivery manager of a 6-person team
situation: Since the team started using Codex, most people hit their limit mid-week. Everyone uses the top model on Extra high "to be safe", and a 900-line AGENTS.md is loaded into every task.
prompt: |
  Look at how our team uses Codex over a typical week (task types, models,
  effort, AGENTS.md size). Propose a default model and effort for each task type,
  and three changes that reduce usage without lowering the quality of reviewed results.
  Mark every assumption you make.
outcome: A short policy, for example light settings for scoped fixes and the strong model only for design reviews, plus a plan to split AGENTS.md by directory.
tips:
  - Decide on the quality bar per task type **before** changing settings, then compare like for like.
  - Fast mode and Ultra are opt-in tools for specific moments, not defaults.
```

## Check yourself

```quiz
id: models-usage
questions:
  - q: A developer runs dozens of small, well-scoped fixes a day and keeps hitting the limit. What's the best first change?
    options:
      - Switch every task to Ultra so the work finishes sooner
      - Use a lighter model or effort for the scoped fixes and check results against the same acceptance criteria
      - Turn on Fast mode so each task uses less
      - Paste more context into each prompt so the agent needs fewer turns
    answer: 1
    explain: Scoped fixes rarely need the heaviest setting. Fast mode **raises** the usage rate, Ultra spreads work across subagents and uses more tokens, and extra context costs tokens too.
  - q: Your limit runs out while Codex is in the middle of a turn. What happens, according to the pricing docs?
    options:
      - The turn stops immediately and the changes are rolled back
      - The running turn is allowed to finish, subject to fair use
      - The task automatically moves to an API key
      - Codex switches to the cheapest model for the rest of the turn
    answer: 1
    explain: OpenAI lets work already in progress finish. After that, credits (or a plan or workspace change) are how you continue.
  - q: When is Ultra a sensible choice?
    options:
      - For any important task
      - When the task splits into meaningful parts that can run in parallel, and the extra usage is acceptable
      - When you want the model to think longer about one hard problem
      - When you need the answer faster on a small task
    answer: 1
    explain: Ultra delegates parts to subagents. "Think longer about one problem" is Max. Small tasks need neither.
  - q: "A PM asks: 'Where do I see how much Codex usage I have left?' Which answers are correct?"
    options:
      - In the usage dashboard
      - With `/status` inside a Codex CLI session
      - Only your workspace admin can see it
      - In the AGENTS.md file
    answer: [0, 1]
    explain: Both are in the pricing docs. Admins also have workspace analytics, but individuals can check their own usage.
  - q: Before comparing two models for a recurring report, what should you decide first?
    options:
      - Which model is newer
      - The acceptance criteria the report must meet
      - The highest reasoning effort you can afford
      - Whether to enable Fast mode
    answer: 1
    explain: Without acceptance criteria you can't tell whether the cheaper setting is "good enough". The model-selection guide puts that step first.
```

---
title: Design and build agentic systems
summary: Agents with clear roles, controlled tool access and reliable handoffs, tested against defined outcome and safety requirements. Confirmed with the official badge.
duration: ~110 min in Academy + assessment
audience: [technical]
---

## Why this matters

Codex is an agent somebody else built for you. This course is about **building your own**: an
application where several agents each have a role, call tools within limits, and hand work to each
other without losing track of who owns what. If you've followed this course, the ideas will feel
familiar: least-privilege tools, clear ownership, evidence over assurance. Now they're design
decisions in your own product.

```resource
title: Design and Build Agentic Systems
url: https://academy.openai.com/public/courses/design-and-build-agentic-systems-k5uke
provider: OpenAI Academy
format: course
duration: ~110 min + assessment
level: intermediate
access: Free OpenAI Academy account · badge
why: Self-paced lessons and a guided hands-on lab in which you build and test a multi-agent workflow against outcome and safety requirements. It's written for developers with hands-on API experience.
focus:
  - How each agent's **role** and **tool access** are defined, and how that compares with Codex's sandbox and approvals.
  - What gets passed at a **handoff** so ownership is preserved.
  - How the lab **tests** agent decisions and handoffs. That's the bridge to the next topic, evaluation.
```

## From Codex to your own agents

| In Codex you… | In your own agentic system you… |
|---|---|
| Set a sandbox and an approval policy | Give each agent only the tools it needs, and put sensitive actions behind approval |
| Split work across subagents | Route work between agents, with explicit handoffs |
| Ask for evidence before you accept "done" | Test outcomes and safety requirements automatically |
| Keep rules in AGENTS.md | Keep each agent's instructions short, specific and versioned |

```resource
title: OpenAI Cookbook, agents topic
url: https://developers.openai.com/cookbook/topic/agents
provider: OpenAI Cookbook
format: article
duration: browse
why: Worked examples of agents with tools, handoffs and orchestration. Pick one close to what you're building and run it alongside the course.
```

## Badge checkpoint

```badge
id: badge-agentic-systems
course: Design and Build Agentic Systems
accept: [Design and Build Agentic Systems, Build Agentic Systems]
url: https://academy.openai.com/public/courses/design-and-build-agentic-systems-k5uke
```

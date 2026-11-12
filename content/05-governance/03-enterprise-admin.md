---
title: Enterprise administration
summary: How a workspace rolls Codex out, step by step. Owners, identity and roles, enforced runtime requirements, plugin controls, analytics, the Compliance API and the HIPAA setup, plus what each control can and can't prove.
duration: ~50 min
audience: technical
---

## Why this matters

For an organisation, "using Codex" means several access boundaries at once: who can sign in, what
the agent may do on a laptop, what it may do in the cloud, which plugins and company systems it can
reach, and what gets recorded. Each one is set in a different place. A rollout goes smoothly when
someone owns each boundary and every change is tested.

This topic is for technical specialists who plan or run a workspace rollout. You won't configure
anything here. The goal is to know the map well enough to plan a rollout and ask the right questions.

## The rollout in eight steps

```resource
title: Admin rollout guide
url: https://learn.chatgpt.com/docs/enterprise/admin-setup
provider: OpenAI Docs
format: docs
duration: 25 min
level: advanced
why: OpenAI's step-by-step plan for a ChatGPT Enterprise rollout covering every surface (desktop app, CLI, IDE, cloud, API, plugins).
focus:
  - "Step 1 comes before any setting: **assign owners and choose a rollout**, for example a pilot group first."
  - Local Codex access and Work access can be **separate permissions**. Enabling one doesn't enable the other.
  - "Step 8, *Verify and maintain the rollout*: a rollout is never finished."
```

```order
id: rollout-order
title: Put the rollout in order
prompt: Arrange the steps the way the admin rollout guide does.
items:
  - Assign owners and choose a rollout (e.g. a pilot group)
  - Configure workspace access and identity
  - Configure local runtime requirements
  - Standardise repository configuration
  - Configure Codex cloud
  - Configure plugins and connected capabilities
  - Set up governance and observability
  - Verify and maintain the rollout
explain: People and scope come first, then access from the inside out, then observability, and verification never stops.
```

## Enforced settings: requirements and defaults

```resource
title: Managed configuration
url: https://learn.chatgpt.com/docs/enterprise/managed-configuration
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
why: How admins set **requirements** (enforced, so users can't loosen them) and **defaults** (starting values users may change) for sandbox, approvals, network, MCP servers, plugins and hooks, from the workspace or on the device.
focus:
  - Which settings belong in requirements (anything that protects the company) and which are fine as defaults (comfort settings).
  - How managed settings reach local clients, and how to verify they took effect.
```

> [!TIP] The two-test habit
> OpenAI's security cookbook recommends that after **every** configuration change you test one
> workflow that should work and one that should be **blocked**. Most rollout incidents are a control
> that was "configured" but never actually blocked anything.

## Seeing what happens: analytics vs audit

| Question | Surface |
|---|---|
| "Are teams adopting Codex?" | Workspace analytics, Codex analytics dashboard |
| "Load Codex usage into our BI tool" | Analytics API |
| "Who did what, when, for an investigation?" | **Compliance API** and audit events |
| "Are we within our credit budget?" | Usage limits and spend controls |

```resource
title: Workspace analytics
url: https://learn.chatgpt.com/docs/enterprise/workspace-analytics
provider: OpenAI Docs
format: docs
duration: 8 min
why: The difference between ChatGPT workspace analytics, Codex analytics, the Analytics API and audit records.
focus:
  - Downloaded reports are **identifiable organisational data**. Store them under your data policy.
  - The dashboards change over time. Don't build a contract on their fields; use the API for that.
```

```resource
title: Compliance API and audit events
url: https://learn.chatgpt.com/docs/enterprise/compliance-api
provider: OpenAI Docs
format: docs
duration: 10 min
why: When you need auditable records for security, legal or investigations, and how to export them into your SIEM or e-discovery systems.
focus:
  - The docs say it plainly. It's **not a productivity dashboard**, and it shouldn't be used to judge code quality or individual performance.
```

## Regulated data: HIPAA

```resource
title: HIPAA configuration guide for Codex
url: https://learn.chatgpt.com/docs/hipaa-configuration
provider: OpenAI Docs
format: docs
duration: 20 min
level: advanced
why: For organisations handling protected health information, it sets out the **shared responsibility**. OpenAI covers its services under a BAA. You configure workstations, repositories, local retention, local MCP servers and plugins.
focus:
  - Local TOML policy files govern what Codex can do on a user's machine. That makes them part of your HIPAA safeguards.
  - ChatGPT sign-in vs API-key sign-in follow different retention and permission rules.
  - The guide is explicit that it **isn't legal advice**. Review the final configuration against your own policies.
```

> [!NOTE] Even if you aren't in healthcare
> The HIPAA guide is the most complete worked example of "regulated data meets coding agent". Its
> structure (shared responsibility, then role-based access, then reviewed plugins, then enforced
> requirements, then a staged rollout) works well for GDPR-sensitive or client-confidential projects too.

## Check yourself

```quiz
id: enterprise-admin
questions:
  - q: According to the admin rollout guide, what comes first?
    options:
      - Turning on Codex for everyone so people can try it
      - Assigning owners and choosing a rollout, such as a pilot group
      - Configuring plugins
      - Buying credits
    answer: 1
    explain: People and scope first. Every later boundary needs someone who owns it.
  - q: Security wants no developer to be able to switch Codex to full access. Which mechanism enforces that?
    options:
      - A managed default
      - A managed requirement
      - A line in each repository's AGENTS.md
      - An email to all developers
    answer: 1
    explain: Requirements are enforced constraints. Defaults are only starting values that users can change.
  - q: An engineering director wants to rank developers by how much Codex they use, using the Compliance API. What's the issue?
    options:
      - None, because it's the most detailed data
      - The docs say the Compliance API isn't a productivity dashboard and shouldn't be used to judge individual performance
      - The Compliance API has no Codex data
      - Only OpenAI can access it
    answer: 1
    explain: It exists for auditable records and investigations. Use analytics for adoption trends, and don't use either to rate individuals.
  - q: After an admin restricts network destinations for Codex, what should they do?
    options:
      - Announce it and move on
      - Test one workflow that should still work and one that should now be blocked
      - Wait for complaints
      - Restart all laptops
    answer: 1
    explain: The two-test habit catches both a broken workflow and a control that blocks nothing.
```

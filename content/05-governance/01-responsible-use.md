---
title: Governance, security and responsible use
summary: The organisational risks of coding agents, and the decisions that contain them. Which actions need human review, how security findings are handled, and what evidence is kept for oversight.
duration: ~45 min
audience: [non-technical, leads]
---

## Why this matters

A coding agent changes *who does the work*, but not *who is accountable for it*. Most problems teams
run into aren't technical. They're unclear answers to simple questions. Who approved this change?
Who decided the agent could reach that system? Who checked the security finding? Where is the
record?

This topic is for managers, delivery leads, security and anyone who signs off on how a team works.
It needs no coding. Developers will recognise the controls from modules 1, 3 and 4.

```resource
title: Scale Codex Across Teams and Systems
url: https://academy.openai.com/public/courses/scale-codex-across-teams-and-systems-jr83a
provider: OpenAI Academy
format: course
duration: ~100 min + assessment
level: advanced
access: Free OpenAI Academy account · badge
why: The official path this module follows. It's about coordinating Codex across complex work "with appropriate controls and oversight". Its assessment is the module badge. The lab is hands-on and technical, but the overview and lessons are worth reading for leads.
```

## Four organisational risks

| Risk | What it looks like | The control |
|---|---|---|
| **Excessive access** | The agent can reach production, secrets or unrelated repos "because it was easier" | Sandbox and approvals; admin-enforced requirements; approved MCP servers only |
| **Unreviewed changes** | Agent output merged because "tests pass" | A human review of every change that ships; branch protection |
| **Over-reliance** | Nobody on the team can explain or maintain what the agent wrote | Reviewers must understand the change; reviews check intent, not just syntax |
| **Unclear accountability** | "Codex did it" | A named person owns every merged change, every automation and every exception |

```compare
title: A team policy on agent use
weak:
  prompt: "Use Codex responsibly and be careful with sensitive data."
  note: Nobody can act on it or check it. Everyone thinks they comply.
strong:
  prompt: |
    1. Every agent-made change is merged by a person who reviewed it and can explain it.
    2. Agents never get production credentials; deploys go through CI as today.
    3. Security findings: owner = the service's tech lead; triage within 2 working days;
       "not applicable" needs a written reason.
    4. Automations: each has a named owner and a weekly review of its output.
    5. Exceptions to 1–4 are approved by the engineering manager and recorded.
  note: Specific, checkable, and every rule has an owner.
```

## Which actions need human review

Codex already separates what it may do alone from what needs approval (the sandbox and approval
policy from module 1). Your policy decides the organisational layer on top:

```flashcards
id: human-review
title: Agent alone, or a person decides?
cards:
  - front: Codex edits files in the project and runs the tests on a feature branch
    back: "**Agent alone**, inside the sandbox. A person reviews the result before merge."
  - front: Merging into main or releasing to customers
    back: "**A person decides.** Always reviewed, always attributable."
  - front: Using a new MCP server connected to the customer database
    back: "**A person decides**, usually the admin or security. It's a new door into company data."
  - front: Closing a security finding as "not applicable"
    back: "**A person decides** and writes down why. The record matters for audits."
  - front: Running an approved, read-only nightly triage report
    back: "**Agent alone** on a schedule, with a named owner who reads the output."
```

## Security findings and evidence

```resource
title: Agent approvals & security
url: https://learn.chatgpt.com/docs/agent-approvals-security
provider: OpenAI Docs
format: docs
duration: 10 min (skim)
why: Skim the first sections for the vocabulary (sandbox, approval, network access, safety monitoring), so you can talk about controls precisely with your developers.
focus:
  - "*Safety monitoring and paused tasks*: Codex itself can pause work that looks risky."
  - Network access is off by default. Whoever turns it on should be able to say why.
```

```resource
title: Codex security cookbook
url: https://learn.chatgpt.com/docs/enterprise/security-cookbook
provider: OpenAI Docs
format: docs
duration: 15 min
why: How administrators turn access decisions into configuration. Read the **combined recipes** for business goals such as "let developers use Codex while protecting production" and "keep Codex from changing its own safeguards".
focus:
  - "The *Start here* routine: pilot first, keep a rollback copy, and after every change **test one allowed and one intentionally blocked workflow**."
  - The difference between **managed requirements** (enforced) and **managed defaults** (starting values).
```

```resource
title: Governance
url: https://learn.chatgpt.com/docs/enterprise/governance
provider: OpenAI Docs
format: docs
duration: 10 min
why: Which surface answers which oversight question. Analytics for adoption, the Analytics API for reports, the Compliance API for audit records.
focus:
  - Analytics dashboards are **not** audit logs. For "who did what, when", you need the Compliance API (topic 5.3).
```

> [!NOTE] For security teams only: Trusted Access for Cyber
> Defensive security work (vulnerability research, red teaming) can trigger safety refusals. OpenAI
> offers approved access to specialised cyber models through **Trusted Access for Cyber**. See
> [Models and Trusted Access](https://learn.chatgpt.com/docs/cyber-safety). It requires approval for
> a specific identity and workspace, applies only to systems you are authorised to assess, and doesn't
> replace your environment's own controls.

```checklist
id: oversight-evidence
title: Evidence worth keeping
items:
  - text: For every merged agent-made change, the reviewer and the PR discussion
    hint: Your Git host already keeps this, as long as review is required.
  - text: For every automation, its owner, its permissions and where its output goes
  - text: For every security finding, its status, its owner and the reason if it was dismissed
  - text: For every exception to the policy, who approved it and until when
  - text: Workspace audit records retained according to your compliance requirements
    hint: The admin sets this up through the Compliance API.
done: That's an audit you can pass without a scramble.
```

## Check yourself

```quiz
id: responsible-use
questions:
  - q: A production incident traces back to an agent-made change. The post-mortem says "Codex introduced the bug". What's missing?
    options:
      - Nothing, because that's the root cause
      - Who reviewed and merged the change, and why the review didn't catch it
      - The model version
      - A rule banning Codex
    answer: 1
    explain: Accountability stays with people. The useful question is how the change got through review, which is the same question you'd ask about a human's bug.
  - q: Which policy statement can actually be checked?
    options:
      - '"Use AI responsibly."'
      - '"Be careful with customer data."'
      - '"Agents never receive production credentials; deploys run only through CI."'
      - '"Review agent code when possible."'
    answer: 2
    explain: You can verify it by looking at credentials and the deploy path. The others are intentions.
  - q: A leader asks for "the audit log of what Codex did last month". Where does that come from?
    options:
      - The workspace analytics dashboard
      - The Compliance API and its audit records
      - The developers' chat histories
      - The usage dashboard
    answer: 1
    explain: The governance docs separate interactive analytics (adoption) from the Compliance API (auditable records).
  - q: A developer dismisses a security finding as "not applicable". What should your process require?
    options:
      - Nothing, because developers know best
      - A written reason and an owner, kept with the finding
      - A deep scan every time
      - Approval from OpenAI
    answer: 1
    explain: Dismissals are decisions. A short written reason makes them reviewable and auditable.
```

---
title: From plain English to a working prototype
summary: Describe an app in plain language and get something people can click. Then decide what the prototype is for, and what it isn't, before it reaches engineering.
duration: ~45 min
audience: non-technical
---

## Why this matters

A clickable prototype answers questions that a document can't: "Is this the flow we meant?",
"Which fields are actually needed?", "Will customers understand this screen?" With the Codex app,
a non-technical specialist can build one in an afternoon by **describing** it. There's no hand-off and
no waiting for a sprint.

The risk is the opposite one. A prototype that looks finished gets treated as if it were finished.
This topic covers both: how to get a good prototype, and how to keep it in its place.

```resource
title: How PMs use the Codex app
url: https://www.youtube.com/watch?v=6OiE0jIY93c
provider: OpenAI · YouTube
format: video
duration: 2 min
level: beginner
focus:
  - What the PM gives Codex as input, and what they check before sharing the result.
```

```resource
title: How designers prototype using the Codex app and Figma
url: https://www.youtube.com/watch?v=P7HXxl14dCA
provider: OpenAI · YouTube
format: video
duration: 2 min
level: beginner
focus:
  - Moving between a design file and a working prototype. Notice what stays the designer's decision.
```

```resource
title: Build and share interactive prototypes in Codex
url: https://www.youtube.com/watch?v=_9ImjmzAyus
provider: OpenAI · YouTube
format: video
duration: 2.5 min
level: beginner
focus:
  - How a prototype is shared with people who don't use Codex.
```

## Describe the result, not the code

You don't need technical words. You need the same things a good brief has: **who** it's for,
**what** they do, **which data** it shows, and **how you'll know it works**.

```compare
title: Asking for a prototype
weak:
  prompt: Make an app for leave requests.
  note: Codex has to invent the users, the fields, the rules and the look, and you'll spend the afternoon correcting guesses.
strong:
  prompt: |
    Build a clickable prototype of a leave-request tool for a 40-person office.
    Users: employees submit requests; team leads approve or reject them.
    Screens: "My requests" list, "New request" form (dates, type, comment),
    lead's inbox with Approve / Reject and a required reason for rejecting.
    Use the sample data in leave_sample.csv. No real logins or emails.
    Done when: I can submit a request as an employee, switch to the lead view,
    reject it with a reason, and see the status change in "My requests".
  note: Users, screens, data, boundaries ("no real logins") and a walkthrough that proves it works.
```

> [!TIP] Let Codex interview you
> Not sure what to specify? Start with *"Before building anything, ask me up to 8 questions about
> users, screens and data."* The questions it asks are a free gap analysis of your requirements.

## Share it as a site

```resource
title: Sites
url: https://learn.chatgpt.com/docs/sites
provider: OpenAI Docs
format: docs
duration: 15 min
level: beginner
why: Sites builds, hosts and shares a web page or small web app that you describe in ChatGPT or Codex. The page walks through common patterns (resource hub, dashboard, tracker, request form) and says for each one what to share, what to ask for and what to check.
focus:
  - For each pattern, read the **"What to check"** step. It's the acceptance test most people skip, for example a filter with no results, or a reload to confirm data was saved.
  - Who can see what you publish. Check that before you share a link outside the team.
```

```resource
title: Introducing Sites in Codex
url: https://www.youtube.com/watch?v=VRvC5smyzso
provider: OpenAI · YouTube
format: video
duration: 2 min
level: beginner
```

## Get ideas from what others built

```resource
title: OpenAI Showcase
url: https://developers.openai.com/showcase
provider: OpenAI
format: article
duration: 10 min browsing
why: Demo apps built with OpenAI models. Useful for seeing what kind of thing a prompt can produce and for spotting the scope of a good first prototype.
```

```resource
title: Use cases
url: https://learn.chatgpt.com/use-cases
provider: OpenAI Docs
format: docs
duration: 10 min browsing
why: Official example workflows. Each comes with a starter prompt you can adapt. Filter by your role.
```

> [!NOTE] Optional reading
> [Mastering Codex Remote for engineering](https://developers.openai.com/blog/mastering-codex-remote-for-engineering)
> (OpenAI blog) shows how to start, steer and review work from the ChatGPT mobile app. It's handy if you
> want to check on a prototype between meetings.

## What a prototype is, and what it isn't

| A prototype **is** | A prototype **is not** |
|---|---|
| A way to agree on flow, fields and wording | Production code engineering can "just ship" |
| Something to put in front of users this week | Proof that the data model, security or performance work |
| A sharper requirement: "like this, but…" | A commitment on scope or a date |

```usecase
title: Prototype before the estimate
who: Business analyst
situation: The client describes a "simple" onboarding portal. The team suspects it's not simple, but there is no spec to estimate.
prompt: |
  Build a clickable prototype of the onboarding portal described in client_notes.md.
  Use fake data only. After it works, list:
  1) every assumption you made that isn't in the notes,
  2) every screen or rule where the notes were ambiguous,
  3) the questions I should ask the client before engineering estimates this.
outcome: A prototype for the client call, plus a list of assumptions and open questions that becomes the agenda.
tips:
  - The list of assumptions is often worth more than the prototype.
  - Label it clearly as a prototype in the shared link and on the first screen.
```

## Check yourself

```quiz
id: plain-english-apps
questions:
  - q: A PM wants a prototype of a new checkout flow. Which addition to the prompt helps Codex most?
    options:
      - '"Make it look modern and professional"'
      - A walkthrough that defines done, for example "I can add two items, apply a code, and see the new total"
      - '"Use the best framework"'
      - '"This is important, please be careful"'
    answer: 1
    explain: A walkthrough gives Codex, and you, a way to check the result. Style words and pleas don't.
  - q: The prototype impressed the client, who now asks "So when can it go live?" What's the right answer?
    options:
      - '"It basically is live, we just need to deploy it."'
      - '"The prototype settles the flow. Engineering still has to plan data, security and integration, and estimate from that."'
      - '"Codex wrote the code, so there is nothing left to do."'
      - '"Never, because prototypes are thrown away."'
    answer: 1
    explain: A prototype is a sharper requirement. It isn't proof that the hard, invisible parts work.
  - q: You built a leave-request tracker with Sites. According to the Sites docs' "What to check" advice, which checks belong in your acceptance test?
    options:
      - Edit an item, reload, and confirm the change was saved
      - Try each status, including an overdue date
      - If access differs by person, check with separate accounts who can view and edit
      - Count the lines of code
    answer: [0, 1, 2]
    explain: Saving, every state and access rights are where prototypes quietly fail. Lines of code tell you nothing.
  - q: What should a prototype use when the real data contains personal information?
    options:
      - The real data, so the demo is realistic
      - Fake or sample data that keeps the same shape
      - No data at all
      - The real data, but only in a private link
    answer: 1
    explain: Sample data with the same fields gives a realistic demo without exposing anyone. A private link is still a copy of personal data in a new place.
```

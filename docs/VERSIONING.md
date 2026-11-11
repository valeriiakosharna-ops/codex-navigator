# Versions and Moodle

## The idea in one paragraph

Every release is a Git tag (`v1.2.0`) and is published forever at `/v/1.2.0/`. Moodle always
links to `/latest/…`. When a learner opens a page, it checks which version **this learner**
should see and quietly switches to it. A cohort that started on 1.0 stays on 1.0 even after you
publish 1.1, while new cohorts get 1.1.

```
Moodle activity ──► /latest/getting-started/what-is-codex/?uid=42&cid=7
                         │  pin check (before the page is shown)
                         ▼
                    /v/1.0.1/getting-started/what-is-codex/?uid=42&cid=7
```

## What the version numbers mean

| Bump | Example | Use for | Learners already in progress |
|---|---|---|---|
| **PATCH** `1.0.0 → 1.0.1` | typos, broken link, clearer explanation | always safe | **get it automatically** |
| **MINOR** `1.0.x → 1.1.0` | new or rewritten topics, changed quizzes | content changes | stay on 1.0.x |
| **MAJOR** `1.x → 2.0.0` | restructured course | big redesign | stay on 1.x |

Pins are written as `"1.0"` (meaning "newest 1.0.x"), so patch fixes reach everybody but
structural changes don't.

## How a learner's version is chosen

The first matching rule wins:

1. `?v=1.0` in the URL: manual override for support or testing.
2. `users:` in `pins.yaml` (Moodle user id): an exception for one learner.
3. `courses:` in `pins.yaml` (Moodle course id): **the cohort pin. This is the main mechanism.**
4. The version the learner first opened, remembered in their browser.
5. `default:` in `pins.yaml`, if set.
6. Otherwise: latest.

Rule 3 is reliable across devices and browsers, because the course id comes from Moodle. Rule 4
is a safety net for when nobody pinned the cohort, but it lives in the browser: a learner on a
new laptop or in private mode falls through to latest. **So pin every cohort.**

## Routine

**Starting a new cohort (new Moodle course):**

1. Note the Moodle course id (in the URL: `course/view.php?id=15`).
2. Add it to `pins.yaml` on `main`:
   ```yaml
   courses:
     "15": "1.1"
   ```
3. Commit. Within ~2 minutes `pins.json` is live. No release is needed.

**Publishing a release:**

```bash
git switch main && git pull
git tag v1.1.0 -m "New topic: debugging with Codex"
git push origin v1.1.0
```

Or in the GitHub UI: *Releases → Draft a new release → Choose a tag → v1.1.0 → Publish*. The
Deploy workflow builds `/v/1.1.0/` and moves `/latest/` to it.

**Fixing a typo for everyone, including running cohorts:** fix it on `main`, then tag the next
patch (`v1.1.1`). Learners pinned to `"1.1"` get it on their next page load.

**Fixing a typo in an older line (back-port):** create a branch from the old tag, fix it, tag
`v1.0.2`. `/latest/` doesn't move, because a back-port is never the highest version.

**Moving one learner:** add `users: { "4711": "1.1" }` to `pins.yaml`.

## Progress and grades across versions

- Grades live in Moodle, so they are never lost.
- In-page progress (checked answers, checklists) is stored per version line (`1.0`, `1.1`). Moving a learner to another line starts their in-page progress fresh; their Moodle grade stays.

## Rehearse locally

```bash
npm run simulate-versions
```

This builds three fake releases with demo pins and prints links that open them inside the Moodle
simulator. Watch the version badge in the header switch.

## The Moodle plugin

Nothing in `mod_extpagewithgrades` needs to change. The plugin already:

- passes Moodle data as URL variables (configure `uid` = User ID and `cid` = Course ID);
- resizes the iframe on `{type: "moodleIframeResize", height}`;
- saves a grade on `{type: "moodleSubmitGrade", score, maxScore}`, using Highest / First / Last.

Optional improvements to consider later (not required):

1. **Server-side pin**: store the version a user started in Moodle and pass it as a URL variable. That makes rule 4 device-independent.
2. **Origin check**: the plugin accepts messages from any origin. Checking `event.origin` against the course site would harden it.
3. **Secure grade submission**: scores come from the browser, so a determined learner can fake them. That's acceptable for self-check quizzes, but not for exams.

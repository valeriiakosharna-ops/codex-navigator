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

1. `?v=1.0` in the URL. The Embedded Course Page plugin (`mod_embedcourse`) sends it from the **Content versions** page in Moodle (course default or a single learner), see `docs/MULTI-MOODLE.md`. Also usable by hand for support or testing.
2. `sites: <moodle origin>: users:` / `courses:` in `pins.yaml`: pins for one specific Moodle site.
3. `users:` in `pins.yaml` (Moodle user id): an exception for one learner.
4. `courses:` in `pins.yaml` (Moodle course id): **the cohort pin. This is the main mechanism.**
5. The version the learner first opened, remembered in their browser.
6. `default:` in `pins.yaml`, if set.
7. Otherwise: latest.

Rule 4 is reliable across devices and browsers, because the course id comes from Moodle. Rule 5
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

**Describing versions:** add a line to `releases.yaml` on `main` for every release (`"2.0.3": { title, description }`)
and for every version line (`"2.0"`). The text appears in Moodle on the *Content versions* page and on
`/versions/`. No release is needed; it goes live with the next deploy.

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

**Linking topics inside Moodle:** after creating the activities for a course, add their ids to
`moodle.yaml` on `main` (site → course id → page id → activity id). Like `pins.yaml`, it is published
on every deploy without a release.

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

Two plugins work with the course, because both speak the same messages:

- **Embedded Course Page** (`mod_embedcourse`, recommended) also sends `v=` from its *Content versions*
  page, Moodle's light/dark mode, and the Moodle site address (see `docs/MULTI-MOODLE.md`).
- **External Web Page with Grades** (`mod_extpagewithgrades`) needs no changes. It passes URL
  variables (`uid` = User ID, `cid` = Course ID), resizes the iframe on `moodleIframeResize`, and
  saves grades on `moodleSubmitGrade` (Highest / First / Last).

Still open for both plugins: scores come from the browser, so a determined learner can fake them.
That's acceptable for self-check quizzes and labs, but not for exams.

## Versioning practices (scenario, spot)

Practices are frozen with each course release, like everything else. On top of that, each
practice has its own `version` (default `1`), and the build records a **structure fingerprint**:
step ids, choice order and ratings, evidence, stream lines, code line count, issue lines and
severities. Wording changes don't affect the fingerprint.

| You change… | Do | What learners in progress see |
|---|---|---|
| Wording, explanations, typos | patch release, no `version` bump | nothing, progress continues |
| Steps, choices, ratings, issues, scoring | bump `version: 2`, **minor** release | new cohorts get v2; pinned cohorts keep v1 |
| Structure, but you forgot to bump | — | safety net: the unfinished attempt restarts with a notice, best score is kept |

Saved progress remembers the version and fingerprint it was made with. If they no longer match,
the unfinished attempt is dropped (step ids or choice numbers may now mean something else). The
best score is kept and still counts as done, so the page grade never drops and the next levels
stay unlocked.

**Checks:**

- **Pull requests**: CI compares practices with the live `latest/` release and adds a warning to the run if a structure changed without a `version` bump.
- **Release tags**: the deploy compares with the previous release. Structural changes, added or removed practices in a **patch** release produce a warning, because they reach learners who are already in progress.
- **History**: `/versions/` has a *Practices by release* table showing which practice version shipped in which release. ● marks a change.

## 2.0: the restructured course

2.0 follows the *Codex OpenAI* plan (`docs/COURSE-PLAN.md`): six modules, badge checkpoints, and an
audience label on every page. Some pages moved between modules, so their URLs changed (for example
`practical-workflows/agents-md` → `advanced/agents-md`). That's allowed only in a **major** version.
Cohorts pinned to `1.x` keep their old URLs, because `/v/1.5.x/` stays published. Before you re-pin a
Moodle course to `2.0`, point its activities at the 2.0 URLs listed on `/moodle/`.

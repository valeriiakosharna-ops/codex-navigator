# One course, several Moodle sites

The course is a static website. Any number of Moodle sites can embed it, and nothing has to be
deployed per Moodle. Two activity plugins work, because they speak the same messages
(`moodleIframeResize`, `moodleSubmitGrade`):

| Plugin | What you get |
|---|---|
| **Embedded Course Page** (`mod_embedcourse`, recommended) | Everything below: content versions assigned in Moodle, theme sync, the Moodle site address, origin checks on grade messages. Source: private repo [valeriiakosharna-ops/moodle-mod-embedcourse](https://github.com/valeriiakosharna-ops/moodle-mod-embedcourse). |
| **External Web Page with Grades** (`mod_extpagewithgrades`) | Pages, grades and links between topics. Versions come from `pins.yaml`, and the theme follows the OS. |

They are separate plugins and can be installed side by side.

```
           ┌────────── Moodle A (mdls.nixdev.co) ──────────┐
           │ activity → iframe /latest/…?uid=12&cid=10&site=…&v=2.0 │──┐
           └───────────────────────────────────────────────────────┘  │     ┌──────────────────────┐
           ┌────────── Moodle B (client.moodle.com) ────────┐         ├────►│ GitHub Pages          │
           │ activity → iframe /latest/…?uid=12&cid=10&site=…&v=1.5 │──┘     │ /v/1.5.x/  /v/2.0.x/  │
           └───────────────────────────────────────────────────────┘        └──────────────────────┘
   grades go back to the Moodle that opened the page (postMessage → that Moodle's ajax.php)
```

## Activity settings (Embedded Course Page)

| Setting | Value |
|---|---|
| External page URL | The `latest/` URL from the course's `/moodle/` page |
| URL variables | Preset for new activities: `uid` = User ID · `cid` = Course ID · `site` = **Moodle site address**. On badge pages add `name` = Full name |
| Sync light/dark mode | On |

## Assigning versions in Moodle

Course → **More** → **Content versions**. The settings belong to the course: every Embedded Course
Page activity in it uses them; activities have no version setting of their own. Available to editing
teachers and managers (capability `mod/embedcourse:manageversions`).

Only **version lines** are assigned (`2.0`, `1.5`): a line always opens its newest release, so fixes
reach learners by themselves (see *What the version numbers mean* in `docs/VERSIONING.md`).

- **Course default**, for example `2.0`: the line a learner gets when they **first open** the course.
  Their line is fixed at that moment, so changing the default later only affects learners who
  haven't started.
- **Learners tab**: everyone enrolled, 50/100/200 per page, with filters: name, surname or email;
  version line (or "not started"); status (not started, in progress, completed); group; started
  from/until; completed from/until. Completion comes from Moodle's *Course completion*, so turn it on
  and set its conditions for the course.
- **Assign a version line**: to the learners ticked on the page, or to **all found** by the filters
  (for example everyone who completed more than a year ago). A preview shows how many people move
  from which line, what the new line contains and which course topics it lacks; nothing is saved
  until you confirm. If the list changed in the meantime, the preview is shown again.
- **History tab**: every change, who made it and how (fixed at start, by hand, to several, by an upgrade).

The plugin sends the learner's line as `v=`. If neither the learner nor the course has one, nothing is
sent, and the course's own rules apply (`pins.yaml`, then the version the learner first opened, then
latest).

On the course side, `?v=` has the highest priority, so **Moodle is the source of truth** for every
course that uses the Content versions page. `pins.yaml` stays as a fallback for courses built with
External Web Page with Grades.

## What works the same on every Moodle

| Part | How it works |
|---|---|
| **Grades** | The page posts `moodleSubmitGrade` to the window that embeds it. Embedded Course Page accepts it only from its own iframe and origin. Either plugin saves the grade in that Moodle's gradebook. |
| **Badge checkpoints** | The learner's browser asks Accredible's public API directly. `api.accredible.com` must not be blocked. |
| **Theme** | Embedded Course Page sends Moodle's Light/Dark mode. Without it the page follows the OS. See `docs/MOODLE-THEME-SYNC.md`. |

## What differs per Moodle

**Links between topics.** Inside Moodle a topic link must open the matching **activity**, whose id is
different on every Moodle. `moodle.yaml` maps page → activity id **per site**, and says which plugin the
course is built with (`plugin: embedcourse`; the default is `extpagewithgrades`), because the link is
`/mod/<plugin>/view.php?id=<activity id>`. Without an entry,
the link opens that Moodle's course page. The page knows which Moodle embeds it from
`location.ancestorOrigins` (Chrome, Edge, Safari) or from the `site` variable (needed for Firefox).

**Pins with External Web Page with Grades.** Course and user ids are only unique within one Moodle. If a course
can't send `v=`, pin it under its own origin in `pins.yaml`:

```yaml
sites:
  https://client.moodle.com:
    courses:
      "10": "1.5"
```

**Progress in the browser.** Saved quiz and lab progress is keyed by course, version, page and
Moodle user id. Two Moodles that share a user id in one browser would share progress. It's rare.

## Installing Embedded Course Page

1. *Site administration → Plugins → Install plugins*, upload `mod_embedcourse-1.5.0.zip` (from the plugin repo's releases) (top folder
   `embedcourse/`) and confirm. It's a new plugin: External Web Page with Grades and its activities
   are not touched.
2. Build the course with *Embedded Course Page* activities (URLs from `/moodle/`), add their ids to
   `moodle.yaml` with `plugin: embedcourse` for that course, and set the course default on the
   *Content versions* page.

```yaml
sites:
  https://mdls.nixdev.co:
    courses:
      "12":
        plugin: embedcourse
        getting-started/what-is-codex: 301
```

## Requirements for a new Moodle

- HTTPS. The course is HTTPS-only, and browsers block mixed content.
- The network allows `*.github.io` (the course) and `api.accredible.com` (badge checks).

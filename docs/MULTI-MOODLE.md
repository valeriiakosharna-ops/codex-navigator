# One course, several Moodle sites

The course is a static website. Any number of Moodle sites can embed it through the
*External page with grades* plugin (`mod_extpagewithgrades`, Moodle 3.0+), and nothing has to be
deployed per Moodle.

```
           ┌────────── Moodle A (mdls.nixdev.co) ──────────┐
           │ activity → iframe /latest/…?uid=12&cid=10&v=2.0 │──┐
           └────────────────────────────────────────────────┘  │       ┌──────────────────────┐
           ┌────────── Moodle B (client.moodle.com) ────────┐  ├──────►│ GitHub Pages          │
           │ activity → iframe /latest/…?uid=12&cid=10&v=1.5 │──┘       │ /v/1.5.x/  /v/2.0.x/  │
           └────────────────────────────────────────────────┘          └──────────────────────┘
   grades go back to the Moodle that opened the page (postMessage → that Moodle's ajax.php)
```

## What works the same on every Moodle

| Part | How it works | Per-Moodle setup |
|---|---|---|
| **Pages** | The same URLs for everyone (`/latest/<page>/`) | Create one activity per page (list on `/moodle/`) |
| **Grades** | The page posts `moodleSubmitGrade` to the window that embeds it. That Moodle saves the grade in its own gradebook. | None. Optional: list allowed origins in `course.yaml → moodleOrigins` |
| **Badge checkpoints** | The learner's browser asks Accredible's public API directly | On badge activities, add the URL variable `name` = *Full name*. `api.accredible.com` must not be blocked |
| **Theme** | Follows the OS by default. With the plugin snippet, it follows Moodle's Light/Dark switch | The snippet in `docs/MOODLE-THEME-SYNC.md` (part of the plugin change below) |

## What differs between Moodles, and how it's handled

**1. Which version a learner sees.** Course and user ids are only unique *within one Moodle*:
course 10 on Moodle A and course 10 on Moodle B are different cohorts. The order of precedence:

1. `?v=` in the URL. **This is how the plugin assigns versions** (see below), so each Moodle decides for itself.
2. `pins.yaml → sites: <moodle origin>:` pins for one specific Moodle (added in 2.0).
3. `pins.yaml → courses: / users:` shared pins ("any Moodle"). Use these only when there's one Moodle.
4. The version the learner first opened (browser), then `default`, then latest.

Without the plugin change, use (2). For example:

```yaml
sites:
  https://client.moodle.com:
    courses:
      "10": "1.5"
```

**2. Links between topics.** Inside Moodle a topic link must open the matching **activity**, whose
id is different on every Moodle. `moodle.yaml` maps page → activity id **per site**. Without an
entry, the link opens that Moodle's course page, never the bare website. The page recognises which
Moodle embeds it from `location.ancestorOrigins` (Chrome, Edge, Safari). Firefox doesn't expose it,
so there the plugin should pass `site` (below).

**3. Progress in the browser.** Quiz and lab progress is saved per course, version, page and Moodle
user id. Two Moodles that happen to share a user id in the same browser would share saved progress.
It's rare, but passing `site` removes it too.

## The plugin change (small, backwards-compatible)

All three items are optional. A Moodle with the unchanged plugin keeps working as it does today.

| # | Change in `mod_extpagewithgrades` | Effect |
|---|---|---|
| 1 | **Theme sync**: about 10 lines of JS in `view.php` (`docs/MOODLE-THEME-SYNC.md`) | The page switches Light/Dark together with Moodle, without reloading |
| 2 | **Content version**: a field "Content version" on the activity (or course), plus an optional per-user override table; `view.php` appends `v=<version>` to the iframe URL | Each Moodle assigns versions to courses and to specific users itself. `pins.yaml` becomes a fallback |
| 3 | **Site variable**: add `'wwwroot' => $CFG->wwwroot` to `$moodle_data` so it can be passed as `site` | Reliable Moodle detection in every browser (links, pins, progress) |

Recommended hardening while the plugin is open anyway: in `view.php`, accept `moodleSubmitGrade`
only when `event.origin` equals the iframe's origin and `event.source` is the iframe's window. Today
any window that holds a reference to the Moodle page can post a grade message. (Client-side grading
can always be tampered with by a determined learner, so this is about stray messages, not exams.)

## Requirements for a new Moodle

- HTTPS. The course is HTTPS-only, and browsers block mixed content.
- The plugin is installed. Moodle 3.0+ is enough for the current plugin, and the theme snippet needs no extra Moodle features.
- Moodle themes that don't set `data-bs-theme` (pre-Bootstrap-5.3 themes) simply stay light. The snippet then sends `light`, or you can send `auto` to follow the OS.
- The network allows `*.github.io` (the course) and `api.accredible.com` (badge checks).

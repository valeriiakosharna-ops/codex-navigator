# Architecture

Applying the ideas from *The Art of Micro Frontends* to a course site: **build-time composition
of independently versioned widgets**, with one thin integration layer.

```
 content/*.md + YAML blocks          widgets/<name>/                 shell/
 (authors)                           widget.mjs  schema + docs        pin.js     version routing (inline <head>)
        │                            element.js  web component        bridge.js  Moodle resize + grades
        ▼                                 │                            base-element.js  widget contract
 build/build.mjs ── validate (zod) ───────┘
        │      ── render static blocks to HTML
        │      ── embed interactive blocks as <lx-quiz> + JSON
        ▼
 dist/  pages · assets/lx.js (one bundle, no CDN) · manifest.json (discovery record)
        │
        ▼  .github/workflows/deploy.yml
 gh-pages: /v/X.Y.Z/  /latest/  /preview/  versions.json  pins.json  404.html
```

## Decisions

| Decision | Why |
|---|---|
| **Own tiny generator** (marked + js-yaml + zod + esbuild) instead of a framework | A course must keep building for years. Frameworks change their Markdown pipeline between majors. ~600 lines we fully control. |
| **Widgets are Web Components (Lit) with Shadow DOM** | Framework-agnostic, style-isolated, and one widget cannot break another's CSS. They share only design tokens (CSS custom properties). |
| **Widgets never talk to Moodle** | They emit `lx-register` / `lx-progress` DOM events; `bridge.js` is the single integration point. Swap the LMS by rewriting one file. |
| **Config is data, validated at build time** | Authors cannot ship a broken quiz: the build fails with the file, line and field. |
| **Everything bundled, no runtime CDN** | The old interactives loaded unpinned `react@18` from unpkg plus in-browser Babel. A CDN change could break the course overnight. Now each version is a frozen, self-contained folder. |
| **Static blocks rendered at build time** | `resource`, `usecase` and `compare` need no JavaScript: faster, printable, accessible. |
| **Versions = immutable folders + pins** | Like a micro-frontend discovery service: `versions.json` lists releases and widget versions; `pins.json` maps consumers (cohorts) to versions; rollback = change a pin. |

## The widget contract (`shell/base-element.js`)

- Config: `<script type="application/json">` child, already validated and Markdown-rendered.
- State: `this.state`, persisted via `setState()` under `lx:<course>:<major.minor>:<page>:<widget>:<uid>`.
- Grading: override `maxScore()` and `result() → {score, complete}`; set `static graded = true`.
- Failure: render errors are caught and shown as a friendly box with a code (LX-R20x), so the rest of the page keeps working.

## Practice-lab engines

`scenario` and `spot` are deterministic assessment engines: no AI and no server. The schema carries the
graph validation (`superRefine` in `widgets/scenario/widget.mjs`), so a broken scenario never reaches
learners. Level progression uses the shared `unlock` contract in `base-element.js`. Widgets reveal
`best` and `exhausted` through `lx-progress`, and dependants unlock themselves. Per-learner
variants are seeded from `uid + widget id + attempt`.

Client-side scoring can be tampered with by a determined learner. That's fine for formative labs.
For high-stakes exams, move scoring to a server.

## Adding a widget

1. `widgets/<name>/widget.mjs`: `name`, `title`, `version`, `kind` (`interactive` | `static`), `graded`, `description`, zod `schema` (use `.describe()` on fields, which feeds the catalog), `example`, and `render()` for static blocks.
2. `widgets/<name>/element.js` for interactive widgets: extend `LxElement`, `customElements.define("lx-<name>", …)`.
3. `npm run dev` → check `/widgets/`; add a test if it is graded.
4. Bump `version` in `widget.mjs` when you change its behaviour or schema. Releases record widget versions in `versions.json`.

Breaking a widget's schema? Add a new optional field instead, or create `quiz2`. Old content must keep building.

## Escape hatch

A one-off experiment that no widget covers can live in `public/labs/<name>/index.html` and be
linked from a page. Keep it there until it proves itself, then promote it into a proper widget.
Labs are not validated or graded.

# Codex Navigator

A navigator course for **OpenAI Codex**. It links to OpenAI's official training and adds use
cases, best practices and study tips. Built as course-as-code: authors write Markdown + small
YAML blocks, the build turns them into a branded static site, and each page can be embedded in
Moodle as a graded activity.

| | |
|---|---|
| **Write content** | [docs/AUTHORING.md](docs/AUTHORING.md) |
| **Versions & Moodle** | [docs/VERSIONING.md](docs/VERSIONING.md) |
| **How it works** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |

## Quick start

```bash
npm install
npm run dev                 # live preview at http://localhost:4321
npm run new -- advanced "My new topic"
npm test                    # browser tests (first time: npx playwright install chromium)
npm run simulate-versions   # rehearse versions + pins locally
```

On the site: **Widget catalog** (`/widgets/`) shows every building block with copy-paste
examples. **Moodle setup** (`/moodle/`) lists the URL and points for every activity.

## Publishing

- Pull request → CI validates content and runs tests.
- Merge to `main` → `/preview/`.
- Tag `vX.Y.Z` → `/v/X.Y.Z/` + `/latest/`.
- `pins.yaml` on `main` → which Moodle cohort sees which version.

## Content notice

This course is an independent navigator. It links to official OpenAI materials and does not
reproduce them. Codex and OpenAI are trademarks of OpenAI.

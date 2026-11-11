# AGENTS.md

Course-as-code site. Content in `content/`, widgets in `widgets/`, Moodle/version logic in `shell/`, generator in `build/`.

## Commands
- `npm run build`: validate + build to `dist/` (fails with file:line on content errors)
- `npm run dev`: live preview on :4321; `/__moodle/?url=/<page>/` simulates the Moodle plugin
- `npm test`: Playwright tests (pages render, grades reach Moodle, version pins)

## Rules
- Content is English. Don't copy official OpenAI text: summarise and link with a `resource` block.
- Verify every official URL resolves before adding it.
- Never change a published page's URL (file name without number prefix, or `slug:`). Moodle links to it.
- Widgets must not reference Moodle. Emit `lx-register` / `lx-progress` and let `shell/bridge.js` handle it.
- The Moodle plugin protocol is fixed: `moodleIframeResize {height}`, `moodleSubmitGrade {score, maxScore}`.
- No runtime CDNs. Everything is bundled. Pin exact dependency versions.
- Changing a widget schema: keep old content valid (add optional fields) and bump `version` in `widget.mjs`.
- Run `npm run build && npm test` before declaring work done.

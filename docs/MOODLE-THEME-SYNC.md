# Syncing the colour theme with Moodle

Course pages have a light and a dark theme, matched to the NIX Learn Moodle theme.

## With Embedded Course Page (recommended)

The **Embedded Course Page** plugin (`mod_embedcourse`) has an activity setting **Sync light/dark mode** (on by default). When
the activity opens, and whenever the learner switches Light, Dark or System in Moodle, the plugin
sends the effective mode to the course page:

```js
{ type: "moodleTheme", theme: "light" | "dark" }
```

- The plugin reads `<html data-bs-theme>`, which NIX Learn and other Bootstrap 5.3 themes set. Themes without it send `light`.
- The message goes only to the course page's own origin.
- The page switches without reloading and remembers the value for the browser session, so the next activity opens in the right theme from the first frame.
- The page accepts the message only from its direct parent window. It also accepts `theme: "auto"` (follow the OS).

## With External Web Page with Grades

The pages follow the operating system's colour scheme (`prefers-color-scheme`). Moodle's
**System** mode, which is the default, does the same, so the two still match. Only an explicit
Light or Dark choice in Moodle is invisible to the page.

## Rehearse locally

`npm run dev`, open `/__moodle/`, and use the *Moodle theme* selector. The *theme sync* checkbox
switches the setting on and off.

## Manual override

`?theme=dark` (or `light`, `auto`) in the page URL wins over everything. It's useful for screenshots and support.

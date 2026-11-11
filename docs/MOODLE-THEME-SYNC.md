# Syncing the colour theme with Moodle

Course pages have a light and a dark theme, matched to the NIX Learn Moodle theme.

## Without any plugin change

The pages follow the operating system's colour scheme (`prefers-color-scheme`). Moodle's colour
mode **System**, which is the default, does the same, so the two always match.

If a learner explicitly picks **Light** or **Dark** in Moodle, the course page can't see that
choice: it lives in Moodle's cookie and localStorage on another domain. The page keeps following
the OS until Moodle tells it otherwise. For that you need the snippet below.

## Optional: tell the page about Moodle's colour mode (≈10 lines)

In `mod/extpagewithgrades/view.php`, inside the existing `<script>` block (right after
`var notif = ...`), add:

```js
var lxFrame = document.getElementById("extpage-iframe");
function lxSendTheme() {
    // NIX Learn writes the effective theme (light|dark) to <html data-bs-theme>
    var theme = document.documentElement.getAttribute("data-bs-theme") || "light";
    try {
        lxFrame.contentWindow.postMessage({ type: "moodleTheme", theme: theme }, new URL(lxFrame.src).origin);
    } catch (e) {}
}
lxFrame.addEventListener("load", lxSendTheme);
new MutationObserver(lxSendTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });
```

What it does:

- When the activity loads, it sends the current Moodle theme to the course page.
- When the learner switches Light, Dark or System in Moodle, it sends the new value right away, and the page switches without reloading.
- The message goes only to the course page's own origin.
- The page remembers the value for the browser session, so the next activity opens in the right theme from the first frame.

The page accepts `{ type: "moodleTheme", theme: "light" | "dark" | "auto" }` only from its direct
parent window. You can rehearse it locally: `npm run dev`, open `/__moodle/`, and use the
*Moodle theme* selector. The *theme sync* checkbox simulates the snippet being installed or not.

## Manual override

`?theme=dark` (or `light`, `auto`) in the page URL wins over everything. It's useful for screenshots and support.

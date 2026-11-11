/*
 * Bridge — the ONLY place that knows about Moodle.
 *
 * Talks to the existing Moodle plugin (mod_extpagewithgrades) with the two messages it
 * already understands, so the plugin does not need to change:
 *   { type: "moodleIframeResize", height }
 *   { type: "moodleSubmitGrade",  score, maxScore }
 *
 * Widgets emit lx-register / lx-progress; the bridge sums graded widgets on the page and
 * reports one result per page (one Moodle activity = one page).
 */
const LX = window.LX || {};
const inFrame = document.documentElement.classList.contains("lx-embedded");

function parentOrigin() {
  // Who embeds us? Moodle may send no referrer, so prefer location.ancestorOrigins
  // (Chrome, Edge, Safari), then the referrer. Unknown -> "*".
  try {
    const anc = location.ancestorOrigins;
    if (anc && anc.length && anc[0] && anc[0] !== "null") return anc[0];
    if (document.referrer) return new URL(document.referrer).origin;
  } catch { /* fall through */ }
  return "*";
}
const target = parentOrigin();
const allowed = LX.moodleOrigins || [];
const canPost = inFrame && (allowed.length === 0 || allowed.includes(target));

function post(message) {
  if (!canPost) return false;
  try {
    window.parent.postMessage(message, target);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- resize
let lastHeight = 0;
function sendHeight() {
  const h = Math.ceil(document.body.getBoundingClientRect().height) + 24;
  if (Math.abs(h - lastHeight) < 8) return;
  lastHeight = h;
  post({ type: "moodleIframeResize", height: h });
}
if (inFrame) {
  new ResizeObserver(() => requestAnimationFrame(sendHeight)).observe(document.body);
  addEventListener("load", sendHeight);
}

// ---------------------------------------------------------------- grading
const widgets = new Map(); // id -> { graded, max, score, complete }
const mode = (LX.page && LX.page.gradeMode) || LX.gradeMode || "on-complete";
let lastSent = null;

const bar = document.querySelector(".lx-scorebar");
const fill = bar && bar.querySelector(".lx-scorebar__fill");
const label = bar && bar.querySelector(".lx-scorebar__label");
const status = bar && bar.querySelector(".lx-scorebar__status");

function totals() {
  let score = 0, max = 0, done = 0, count = 0;
  for (const w of widgets.values()) {
    if (!w.graded) continue;
    count++;
    max += w.max;
    score += w.score || 0;
    if (w.complete) done++;
  }
  return { score: Math.round(score * 100) / 100, max, done, count };
}

function update() {
  const t = totals();
  if (!t.count) return;
  if (bar) {
    bar.hidden = false;
    fill.style.width = `${t.max ? (t.score / t.max) * 100 : 0}%`;
    label.textContent = `Score ${t.score} / ${t.max}`;
  }
  const ready = mode === "each-answer" ? t.done > 0 : t.done === t.count;
  if (!ready) {
    if (status) status.textContent = `${t.done} of ${t.count} activities done`;
    return;
  }
  const key = `${t.score}/${t.max}`;
  if (key === lastSent) return;
  lastSent = key;
  const sent = post({ type: "moodleSubmitGrade", score: t.score, maxScore: t.max });
  if (status) status.textContent = sent ? "Result sent to Moodle" : inFrame ? "Not sent: unknown host" : "Practice mode — not recorded";
  document.dispatchEvent(new CustomEvent("lx-graded", { detail: { ...t, sent } }));
}

document.addEventListener("lx-register", (e) => {
  const d = e.detail;
  widgets.set(d.id, { graded: d.graded, max: d.max, score: 0, complete: false });
});
document.addEventListener("lx-progress", (e) => {
  const d = e.detail;
  widgets.set(d.id, { ...(widgets.get(d.id) || {}), ...d });
  update();
});

// ---------------------------------------------------------------- links inside Moodle
// One Moodle activity = one page. A link to another course page must not replace this
// activity's iframe, so internal links open the page in a new tab instead.
// Links to other topics go to the matching Moodle activity (from moodle.yaml), replacing the
// whole Moodle page; without a mapping they go to the Moodle course page. Never to this site.
if (inFrame) {
  let moodleOrigin = target !== "*" ? target : null;
  const pageLinks = [...document.querySelectorAll("a[data-lx-page]")];
  for (const a of document.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank" || a.hasAttribute("data-lx-page")) continue;
    a.target = "_blank"; // other internal links (rare): keep this activity intact
    a.rel = "noopener";
  }
  if (pageLinks.length) {
    let courseUrl = moodleOrigin && LX.cid ? `${moodleOrigin}/course/view.php?id=${encodeURIComponent(LX.cid)}` : null;
    const point = (map) => {
      for (const a of pageLinks) {
        const cm = map && map[a.dataset.lxPage];
        const url = cm ? `${moodleOrigin}/mod/extpagewithgrades/view.php?id=${cm}` : courseUrl;
        if (url) {
          a.href = url;
          a.target = "_top";
          a.title = cm ? "Open this topic in Moodle" : "Open the Moodle course";
        } else {
          a.target = "_blank";
          a.rel = "noopener";
        }
      }
    };
    point(null);
    if (LX.cid) {
      fetch(`${LX.siteRoot}moodle.json`, { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : {}))
        .then((m) => {
          const sites = m.sites || {};
          // Origin unknown (e.g. Firefox without a referrer): use the only configured site that has this course.
          if (!moodleOrigin) {
            const candidates = Object.keys(sites).filter((o) => sites[o]?.courses?.[LX.cid]);
            if (candidates.length !== 1) return;
            moodleOrigin = candidates[0];
            courseUrl = `${moodleOrigin}/course/view.php?id=${encodeURIComponent(LX.cid)}`;
          }
          point(sites[moodleOrigin]?.courses?.[LX.cid] || null);
        })
        .catch(() => {});
    }
  }
}

// ---------------------------------------------------------------- slides
const deck = document.querySelector("[data-slides]");
if (deck) {
  const slides = [...deck.querySelectorAll(".lx-slide")];
  const steps = [...deck.querySelectorAll(".lx-step")];
  const prev = deck.querySelector("[data-slide-prev]");
  const next = deck.querySelector("[data-slide-next]");
  const count = deck.querySelector(".lx-slidenav__count");
  const last = slides.length - 1;
  const memoKey = `lx:slide:${LX.course}:${(LX.page && LX.page.id) || location.pathname}`;
  let current = 0;
  // Scroll target sits above the deck so it lands below sticky bars (ours, or Moodle's
  // fixed top bar when embedded; scroll-margin is ignored when scrolling the parent page).
  const anchor = document.createElement("span");
  anchor.setAttribute("aria-hidden", "true");
  anchor.style.cssText = `position:absolute;left:0;width:1px;height:1px;top:-${inFrame ? 96 : 76}px`;
  deck.prepend(anchor);

  const fromHash = () => { const m = location.hash.match(/^#lx-slide-(\d+)$/); return m ? Number(m[1]) - 1 : null; };
  const remembered = () => { try { return Number(sessionStorage.getItem(memoKey)); } catch { return null; } };

  function show(i, { scroll = false, focus = false } = {}) {
    current = Math.max(0, Math.min(last, i));
    slides.forEach((s, k) => { s.hidden = k !== current; s.classList.toggle("is-active", k === current); });
    steps.forEach((b, k) => {
      b.classList.toggle("is-active", k === current);
      if (k === current) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    steps[current]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    prev.disabled = current === 0;
    next.disabled = current === last;
    next.textContent = current === last ? "Done ✓" : "Next →";
    count.textContent = `${current + 1} / ${slides.length}`;
    document.documentElement.classList.toggle("lx-slide-later", current > 0);
    try { sessionStorage.setItem(memoKey, String(current)); } catch { /* ignore */ }
    if (!inFrame) history.replaceState(null, "", `#lx-slide-${current + 1}`);
    if (scroll) anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    if (focus) slides[current].querySelector("h2, [tabindex], button, a")?.focus({ preventScroll: true });
  }

  prev.addEventListener("click", () => show(current - 1, { scroll: true }));
  next.addEventListener("click", () => show(current + 1, { scroll: true }));
  steps.forEach((b, k) => b.addEventListener("click", () => show(k, { scroll: true })));
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const t = e.composedPath()[0];
    if (t && t.closest && t.closest("input, textarea, select, [contenteditable], li")) return; // keep arrows for form controls & ordering
    show(current + (e.key === "ArrowRight" ? 1 : -1), { scroll: true });
  });

  // A section is "done" when all graded activities in it are complete.
  function markDone() {
    slides.forEach((s, k) => {
      const ids = [...s.querySelectorAll("lx-quiz, lx-order, lx-scenario, lx-spot")].map((el) => el.id);
      const graded = ids.map((id) => widgets.get(id)).filter((w) => w && w.graded);
      steps[k]?.classList.toggle("is-done", graded.length > 0 && graded.every((w) => w.complete));
    });
  }
  document.addEventListener("lx-progress", () => queueMicrotask(markDone));

  const start = fromHash() ?? remembered() ?? 0;
  show(Number.isFinite(start) ? start : 0);
}

// ---------------------------------------------------------------- theme toggle (standalone site)
const ICONS = {
  auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
};
const NEXT = { auto: "light", light: "dark", dark: "auto" };
const toggle = document.querySelector("[data-lx-theme-toggle]");
function paintToggle() {
  if (!toggle || !window.LXTheme) return;
  const mode = window.LXTheme.mode;
  toggle.querySelector("svg").innerHTML = ICONS[mode];
  const label = `Colour theme: ${mode === "auto" ? "system" : mode}`;
  toggle.setAttribute("aria-label", label);
  toggle.title = label;
}
toggle?.addEventListener("click", () => {
  window.LXTheme.set(NEXT[window.LXTheme.mode] || "auto");
  paintToggle();
});
paintToggle();
document.addEventListener("lx-theme", paintToggle);

// ---------------------------------------------------------------- small page enhancements
for (const pre of document.querySelectorAll(".lx-prose pre")) {
  const btn = document.createElement("button");
  btn.className = "lx-copy";
  btn.type = "button";
  btn.textContent = "Copy";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? pre.innerText);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = "Select & copy";
    }
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
  pre.appendChild(btn);
}

// Expose a tiny debug surface for mentors / tests.
window.LXBridge = { widgets, totals, get lastSent() { return lastSent; } };

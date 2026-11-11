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
  // Send only to the page that embeds us when we can tell who it is.
  try {
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
if (inFrame) {
  for (const a of document.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank") continue;
    a.target = "_blank";
    a.rel = "noopener";
  }
}

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

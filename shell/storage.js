// Safe wrapper around localStorage: it can be blocked (privacy mode, partitioned iframes),
// so every call is guarded and the course keeps working without persistence.
let ls = null;
try {
  ls = window.localStorage;
  ls.setItem("lx:t", "1");
  ls.removeItem("lx:t");
} catch {
  ls = null;
}

const LX = () => window.LX || {};

/** Key scoped to course + version line + page + widget + learner, so versions never share state. */
export function stateKey(widgetId) {
  const { course = "course", version = "0.0.0", page = {}, uid = "" } = LX();
  const line = version.split(".").slice(0, 2).join(".");
  return `lx:${course}:${line}:${page.id || location.pathname}:${widgetId}:${uid || "anon"}`;
}

export function load(key) {
  if (!ls) return null;
  try {
    const raw = ls.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function save(key, value) {
  if (!ls) return;
  try {
    ls.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or blocked: ignore */
  }
}

export function remove(key) {
  if (ls) try { ls.removeItem(key); } catch { /* ignore */ }
}

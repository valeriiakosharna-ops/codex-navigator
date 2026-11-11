/*
 * Version pinning — inlined into <head> of every page, runs before first paint.
 *
 * Moodle activities point at the "latest" channel, e.g.
 *   https://<site>/latest/getting-started/what-is-codex/?uid=42&cid=7
 * (uid/cid are filled in by the Moodle plugin's URL variables: userid, courseid).
 *
 * On the latest channel we decide which version this learner should see and, if it
 * is not the one being served, redirect to /v/<version>/<same page>.
 * Resolution order (first match wins):
 *   1. ?v=1.0           explicit override in the URL (support / debugging)
 *   2. pins.users[uid]  per-learner exception from pins.yaml
 *   3. pins.courses[cid] cohort pin: one Moodle course = one cohort = one version
 *   4. personal pin     the version this learner started on (stored in this browser)
 *   5. pins.default     optional site-wide default
 *   6. stay on latest
 * A pin may be "1.2" (newest 1.2.x — recommended, so typo fixes still arrive) or "1.2.0".
 */
(function () {
  var LX = (window.LX = JSON.parse(document.getElementById("lx-config").textContent));
  var html = document.documentElement;
  var inFrame = false;
  try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }
  if (inFrame || /[?&]embed=1/.test(location.search)) html.classList.add("lx-embedded");

  function store(kind) {
    try { var s = window[kind]; s.setItem("lx:t", "1"); s.removeItem("lx:t"); return s; } catch (e) { return null; }
  }
  var local = store("localStorage"), session = store("sessionStorage");
  var params = new URLSearchParams(location.search);

  // Remember who the learner is for the rest of the browsing session (internal links drop the query).
  var uid = params.get("uid") || (session && session.getItem("lx:uid")) || "";
  var cid = params.get("cid") || (session && session.getItem("lx:cid")) || "";
  if (session) { if (uid) session.setItem("lx:uid", uid); if (cid) session.setItem("lx:cid", cid); }
  LX.uid = uid; LX.cid = cid;

  // ---- colour theme (before first paint) ----------------------------------------------
  // Modes: light | dark | auto. Resolution: ?theme= > Moodle (message, remembered for the
  // session) > the learner's choice on the standalone site > auto (system preference).
  // Moodle in "System" mode and these pages both follow the OS, so they always match.
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var validMode = function (m) { return m === "light" || m === "dark" || m === "auto"; };
  var themeMode = "auto";
  function applyTheme(mode) {
    themeMode = validMode(mode) ? mode : "auto";
    var dark = themeMode === "dark" || (themeMode === "auto" && mq && mq.matches);
    html.setAttribute("data-theme", dark ? "dark" : "light");
    html.setAttribute("data-theme-mode", themeMode);
    try { document.dispatchEvent(new CustomEvent("lx-theme", { detail: { mode: themeMode, theme: dark ? "dark" : "light" } })); } catch (e) {}
  }
  var paramTheme = params.get("theme");
  var startMode = validMode(paramTheme) ? paramTheme
    : inFrame ? (session && session.getItem("lx:moodle-theme")) || "auto"
    : (local && local.getItem("lx:theme")) || "auto";
  applyTheme(startMode);
  if (mq) {
    var onSystem = function () { if (themeMode === "auto") applyTheme("auto"); };
    mq.addEventListener ? mq.addEventListener("change", onSystem) : mq.addListener(onSystem);
  }
  // Moodle → page: { type: "moodleTheme", theme: "light" | "dark" | "auto" }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (e.source !== window.parent || d.type !== "moodleTheme" || !validMode(d.theme) || validMode(paramTheme)) return;
    if (session) session.setItem("lx:moodle-theme", d.theme);
    applyTheme(d.theme);
  });
  window.LXTheme = {
    get mode() { return themeMode; },
    set: function (mode) { if (local && !inFrame) local.setItem("lx:theme", mode); applyTheme(mode); },
  };

  var minor = LX.version.split(".").slice(0, 2).join(".");
  var pinKey = "lx:" + LX.course + ":pin:" + (cid || "-") + ":" + (uid || "-");
  LX.pinKey = pinKey;

  function rememberPersonalPin(v) {
    if (local && uid && !local.getItem(pinKey)) local.setItem(pinKey, v);
  }

  if (LX.channel === "version") { rememberPersonalPin(minor); return; }
  if (LX.channel !== "latest" || params.get("nopin")) return;

  function cmp(a, b) {
    var x = a.split(".").map(Number), y = b.split(".").map(Number);
    for (var i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); }
    return 0;
  }
  // "1.2" -> newest published 1.2.x ; "1.2.3" -> exact
  function resolve(pin, published) {
    if (!pin) return null;
    pin = String(pin).replace(/^v/, "");
    var match = published.filter(function (v) { return v === pin || v.indexOf(pin + ".") === 0; });
    match.sort(cmp);
    return match.length ? match[match.length - 1] : null;
  }

  html.classList.add("lx-pinning");
  var reveal = function () { html.classList.remove("lx-pinning"); };
  var safety = setTimeout(reveal, 2500);
  var get = function (p) {
    return fetch(LX.siteRoot + p, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
  };

  Promise.all([get("pins.json"), get("versions.json")]).then(function (res) {
    var pins = res[0] || {}, published = ((res[1] || {}).versions || []).map(function (v) { return v.version; });
    var candidates = [
      params.get("v"),
      pins.users && uid && pins.users[uid],
      pins.courses && cid && pins.courses[cid],
      local && local.getItem(pinKey),
      pins.default
    ];
    var target = null;
    for (var i = 0; i < candidates.length && !target; i++) target = resolve(candidates[i], published);

    if (target && target !== LX.version) {
      var rel = location.pathname.indexOf(LX.base) === 0 ? location.pathname.slice(LX.base.length) : "";
      location.replace(LX.siteRoot + "v/" + target + "/" + rel + location.search + location.hash);
      return;
    }
    rememberPersonalPin(minor);
    clearTimeout(safety);
    reveal();
  });
})();

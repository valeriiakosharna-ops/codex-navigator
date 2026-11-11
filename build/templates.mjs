import { esc, jsonForScript } from "./util.mjs";

/**
 * Full HTML document.
 * site: { course, version, channel, base, siteRoot, nav, pinScript, devReload }
 * page: { title, description, id, body, wide, sidebar(bool), gradeMode, current }
 */
export function layout(site, page) {
  const { course, version, channel, base, siteRoot } = site;
  const cfg = {
    course: course.id,
    version,
    channel,
    base,
    siteRoot,
    gradeMode: course.gradeMode,
    moodleOrigins: course.moodleOrigins || [],
    page: { id: page.id, gradeMode: page.gradeMode },
  };
  const cacheBust = channel === "version" ? "" : `?v=${encodeURIComponent(site.buildId)}`;
  const versionLabel = channel === "preview" ? `preview · ${version}` : channel === "dev" ? "dev" : `v${version}`;
  const versionsHref = channel === "dev" ? `${base}moodle/` : `${siteRoot}versions/`;

  return `<!doctype html>
<html lang="${esc(course.language || "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)} · ${esc(course.title)}</title>
${page.description ? `<meta name="description" content="${esc(page.description)}">` : ""}
${channel === "preview" ? '<meta name="robots" content="noindex">' : ""}
<link rel="icon" href="${base}img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}assets/lx.css${cacheBust}">
<script id="lx-config" type="application/json">${jsonForScript(cfg)}</script>
<script>${site.pinScript}</script>
<script type="module" src="${base}assets/lx.js${cacheBust}"></script>
</head>
<body>
<header class="lx-header">
  <div class="lx-header__inner">
    <a href="${base}" aria-label="${esc(course.title)} home"><img class="lx-header__logo" src="${base}img/nix-logo.svg" alt="NIX"></a>
    <span class="lx-header__sep" aria-hidden="true"></span>
    <a class="lx-header__title" href="${base}">${esc(course.title)}</a>
    <span class="lx-header__spacer"></span>
    <nav class="lx-header__nav" aria-label="Site">
      <a href="${base}"${page.current === "home" ? ' aria-current="page"' : ""}>Course</a>
      <a href="${base}widgets/"${page.current === "widgets" ? ' aria-current="page"' : ""}>Widget catalog</a>
      <a href="${base}moodle/"${page.current === "moodle" ? ' aria-current="page"' : ""}>Moodle setup</a>
    </nav>
    <button class="lx-theme-toggle" type="button" data-lx-theme-toggle aria-label="Colour theme: system" title="Colour theme: system">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg>
    </button>
    <a class="lx-badge-version${channel === "preview" || channel === "dev" ? " lx-badge-version--preview" : ""}" href="${versionsHref}" title="Course version">${esc(versionLabel)}</a>
  </div>
</header>
<div class="lx-layout${page.sidebar ? "" : " lx-layout--wide"}">
  ${page.sidebar ? sidebar(site, page) : ""}
  <main class="lx-main${page.bare ? " lx-main--bare" : ""}" id="main">
    ${page.body}
  </main>
</div>
<footer class="lx-footer">
  ${course.footer ? `<p>${course.footer}</p>` : ""}
  <p>${esc(course.title)} ${esc(versionLabel)} · built ${esc(site.builtAt.slice(0, 10))}${channel === "dev" ? "" : ` · <a href="${siteRoot}versions/">all versions</a>`}</p>
</footer>
${site.devReload ? `<script>new EventSource("/__lx_reload").onmessage = () => location.reload();</script>` : ""}
</body>
</html>`;
}

function sidebar(site, page) {
  return `<nav class="lx-sidebar" aria-label="Course contents">
  ${site.nav
    .map(
      (m, mi) => `<h2><span class="n">${mi + 1}</span>${esc(m.title)}</h2>
  <ol>${m.pages
    .map((p) => `<li><a href="${p.url}"${p.id === page.id ? ' aria-current="page"' : ""}>${esc(p.title)}</a></li>`)
    .join("")}</ol>`,
    )
    .join("\n")}
</nav>`;
}

export function topicBody(site, mod, p, prev, next) {
  const chips = [
    p.duration ? `<span class="lx-chip">⏱ ${esc(p.duration)}</span>` : "",
    mod.official ? `<span class="lx-chip lx-chip--official">Navigates: ${esc(mod.official.title)}</span>` : "",
    p.maxScore ? `<span class="lx-chip lx-chip--graded">Graded · ${p.maxScore} pt</span>` : "",
  ].join("");
  return `<article class="lx-prose">
  <div class="lx-pagehead">
    <div class="lx-crumbs">Module ${mod.index} · <a href="${site.base}#${mod.slug}">${esc(mod.title)}</a></div>
    <h1>${esc(p.title)}</h1>
    ${p.summary ? `<p class="lx-lead">${esc(p.summary)}</p>` : ""}
    <div class="lx-meta">${chips}</div>
  </div>
  ${p.html}
  ${p.maxScore ? scorebar() : ""}
  <nav class="lx-pager" aria-label="Pages">
    ${prev ? `<a href="${prev.url}"><small>← Previous</small><strong>${esc(prev.title)}</strong></a>` : ""}
    ${next ? `<a class="lx-pager__next" href="${next.url}"><small>Next →</small><strong>${esc(next.title)}</strong></a>` : ""}
  </nav>
</article>`;
}

export const scorebar = () => `<div class="lx-scorebar" hidden role="status">
  <span class="lx-scorebar__label">Score</span>
  <div class="lx-scorebar__track" aria-hidden="true"><div class="lx-scorebar__fill"></div></div>
  <span class="lx-scorebar__status"></span>
</div>`;

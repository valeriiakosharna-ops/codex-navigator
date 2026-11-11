/*
 * Writes the files that live at the root of the published site (outside any version folder):
 *   versions.json   list of published versions + which one is "latest"
 *   pins.json       cohort / learner pins, compiled from pins.yaml
 *   index.html      redirects to latest/
 *   versions/       human-readable list of versions
 *   404.html        if a page is missing in an old version, fall back to the same page on latest
 *   .nojekyll
 *
 * Usage: node scripts/root-files.mjs <siteDir> [pins.yaml]
 * The version list is read from the folders that actually exist in <siteDir>/v/.
 */
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { z } from "zod";

const semver = /^\d+\.\d+\.\d+$/;
const cmp = (a, b) => {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
const pinValue = z.union([z.string(), z.number()]).transform(String).refine((v) => /^v?\d+(\.\d+){0,2}$/.test(v), "pin must look like 1, 1.2 or 1.2.3");
export const pinsSchema = z.object({
  default: pinValue.optional(),
  courses: z.record(z.string(), pinValue).default({}),
  users: z.record(z.string(), pinValue).default({}),
}).strict();

export function writeRootFiles(siteDir, pinsFile = "pins.yaml", { siteRoot } = {}) {
  const vDir = path.join(siteDir, "v");
  const versions = fs.existsSync(vDir) ? fs.readdirSync(vDir).filter((v) => semver.test(v)).sort(cmp).reverse() : [];
  const latest = versions[0] || null;
  const entries = versions.map((v) => {
    let builtAt = null, widgets = null;
    try {
      const m = JSON.parse(fs.readFileSync(path.join(vDir, v, "manifest.json"), "utf8"));
      builtAt = m.builtAt;
      widgets = m.widgets;
    } catch { /* old build without manifest */ }
    return { version: v, builtAt, widgets };
  });
  fs.writeFileSync(path.join(siteDir, "versions.json"), JSON.stringify({ latest, versions: entries }, null, 2));

  const raw = fs.existsSync(pinsFile) ? yaml.load(fs.readFileSync(pinsFile, "utf8")) || {} : {};
  const pins = pinsSchema.parse(raw);
  fs.writeFileSync(path.join(siteDir, "pins.json"), JSON.stringify(pins, null, 2));

  // siteRoot = URL path of the site, e.g. /codex-navigator/
  const root = siteRoot || "./";
  fs.writeFileSync(path.join(siteDir, ".nojekyll"), "");
  fs.writeFileSync(
    path.join(siteDir, "index.html"),
    `<!doctype html><meta charset="utf-8"><title>Redirecting…</title><meta http-equiv="refresh" content="0; url=latest/"><link rel="canonical" href="latest/"><a href="latest/">Open the course</a>`,
  );
  const rows = entries
    .map((e) => `<tr><td><a href="${root}v/${e.version}/">v${e.version}</a>${e.version === latest ? " <b>latest</b>" : ""}</td><td>${e.builtAt ? e.builtAt.slice(0, 10) : ""}</td><td>${e.widgets ? Object.entries(e.widgets).map(([k, v]) => `${k}@${v}`).join(", ") : ""}</td></tr>`)
    .join("");
  fs.mkdirSync(path.join(siteDir, "versions"), { recursive: true });
  fs.writeFileSync(
    path.join(siteDir, "versions", "index.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Versions</title>
<style>body{font:16px/1.6 system-ui,sans-serif;color:#302a40;background:#f0f2f5;margin:0;padding:32px 16px}main{max-width:900px;margin:auto;background:#fff;border-radius:16px;padding:28px 32px}
h1{margin-top:0}table{width:100%;border-collapse:collapse;font-size:15px}td,th{padding:8px 10px;border-bottom:1px solid #e1e4e8;text-align:left}a{color:#0079b0}b{color:#e60036;font-size:12px;text-transform:uppercase}
.p{background:#f7f9fb;border-radius:10px;padding:10px 14px;font-size:14px}</style>
<main><h1>Course versions</h1>
<p>Moodle activities point to <a href="${root}latest/">latest/</a>. Each learner is then routed to the version of their cohort (or the one they started on).</p>
<table><thead><tr><th>Version</th><th>Published</th><th>Widgets</th></tr></thead><tbody>${rows || '<tr><td colspan="3">No releases yet.</td></tr>'}</tbody></table>
<h2>Pins in force</h2><pre class="p">${JSON.stringify(pins, null, 2).replace(/</g, "&lt;")}</pre>
<p><a href="${root}preview/">Preview of the main branch</a> (unreleased).</p></main></html>`,
  );
  fs.writeFileSync(
    path.join(siteDir, "404.html"),
    `<!doctype html><meta charset="utf-8"><title>Page not found</title>
<script>
// A page that is missing from an old version (e.g. added later) falls back to the same page on latest.
(function () {
  var root = ${JSON.stringify(root)};
  var m = location.pathname.match(/\\/v\\/\\d+\\.\\d+\\.\\d+\\/(.*)$/);
  if (m && !/[?&]nopin=1/.test(location.search)) {
    var q = location.search ? location.search + "&nopin=1" : "?nopin=1";
    location.replace(root + "latest/" + m[1] + q + location.hash);
  }
})();
</script>
<body style="font:16px system-ui;padding:40px;color:#302a40"><h1>Page not found</h1><p><a href="${root}latest/">Go to the course</a></p></body>`,
  );
  return { versions, latest, pins };
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const [siteDir, pinsFile = "pins.yaml", siteRoot] = process.argv.slice(2);
  if (!siteDir) {
    console.error("usage: node scripts/root-files.mjs <siteDir> [pins.yaml] [siteRoot]");
    process.exit(1);
  }
  const r = writeRootFiles(siteDir, pinsFile, { siteRoot });
  console.log(`✓ root files: ${r.versions.length} version(s), latest ${r.latest}`);
}

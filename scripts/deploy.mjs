/*
 * Builds one release channel into a checkout of the gh-pages branch and refreshes root files.
 * Used by .github/workflows/deploy.yml and by scripts/simulate-versions.mjs.
 *
 *   node scripts/deploy.mjs --site site --ref refs/tags/v1.2.0 --site-url https://org.github.io/repo/ [--pins pins.yaml]
 *   node scripts/deploy.mjs --site site --ref refs/heads/main  --site-url ...
 *
 * Tag vX.Y.Z  -> site/v/X.Y.Z/  (+ site/latest/ when it is the highest version)
 * main branch -> site/preview/
 */
import fs from "node:fs";
import path from "node:path";
import { build, printErrors } from "../build/build.mjs";
import { writeRootFiles } from "./root-files.mjs";
import { compareLabs, bumpType, report } from "./check-labs.mjs";

const cmp = (a, b) => {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

export async function deploy({ site, ref, siteUrl, pins = "pins.yaml", moodle, log = console.log }) {
  siteUrl = siteUrl.replace(/\/?$/, "/");
  const siteRoot = new URL(siteUrl).pathname;
  fs.mkdirSync(site, { recursive: true });
  const tag = ref.match(/^refs\/tags\/v(\d+\.\d+\.\d+)$/);

  if (tag) {
    const version = tag[1];
    const vDir = path.join(site, "v");
    const existing = fs.existsSync(vDir) ? fs.readdirSync(vDir).filter((v) => /^\d+\.\d+\.\d+$/.test(v)) : [];
    if (existing.includes(version)) log(`! v${version} already published: rebuilding it in place`);
    const r = await build({ siteUrl, channel: "version", version, out: path.join(site, "v", version) });
    log(`✓ v${version}: ${r.pages} pages`);
    // warn about practice changes that reach learners already in progress
    const prev = existing.filter((v) => v !== version && cmp(v, version) < 0).sort(cmp).pop();
    if (prev) {
      try {
        const oldM = JSON.parse(fs.readFileSync(path.join(vDir, prev, "manifest.json"), "utf8"));
        report(compareLabs(oldM, r.manifest, bumpType(prev, version)));
      } catch {
        log(`· no manifest for v${prev}; practice comparison skipped`);
      }
    }
    const highest = [...existing, version].sort(cmp).pop();
    if (highest === version) {
      await build({ siteUrl, channel: "latest", version, out: path.join(site, "latest") });
      log(`✓ latest → v${version}`);
    } else {
      log(`· latest stays at v${highest} (v${version} is a back-port)`);
    }
  } else if (/^refs\/heads\//.test(ref)) {
    const r = await build({ siteUrl, channel: "preview", version: process.env.LX_PREVIEW_VERSION || "0.0.0-preview", out: path.join(site, "preview") });
    log(`✓ preview: ${r.pages} pages`);
  } else {
    throw new Error(`Unsupported ref ${ref}`);
  }
  const root = writeRootFiles(site, pins, { siteRoot, moodleFile: moodle });
  log(`✓ root files: versions [${root.versions.join(", ")}], latest ${root.latest}`);
  return root;
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
  deploy({ site: arg("--site") || "site", ref: arg("--ref") || process.env.GITHUB_REF, siteUrl: arg("--site-url") || process.env.LX_SITE_URL, pins: arg("--pins") || "pins.yaml", moodle: arg("--moodle") || "moodle.yaml" })
    .catch((e) => { if (e.lxErrors) printErrors(e.lxErrors); else console.error(e); process.exit(1); });
}

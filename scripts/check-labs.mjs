/*
 * Compares the practices (scenario / spot) of two builds and warns about changes that affect
 * learners who are already in progress.
 *
 *   node scripts/check-labs.mjs <old manifest: path or URL> <new manifest path> [--bump patch|minor|major]
 *
 * Never fails the build: it prints warnings (GitHub annotations in CI) and a summary.
 */
import fs from "node:fs";
import path from "node:path";

export function compareLabs(oldM, newM, bump) {
  const out = [];
  if (!oldM?.labs) return [{ level: "notice", msg: `Previous build (${oldM?.version ?? "?"}) has no practice versions recorded; nothing to compare.` }];
  const before = new Map(oldM.labs.map((l) => [l.id, l]));
  const after = new Map((newM.labs || []).map((l) => [l.id, l]));
  const patch = bump === "patch";
  for (const [id, n] of after) {
    const o = before.get(id);
    if (!o) continue;
    if (o.fp === n.fp && o.version === n.version) continue;
    if (o.fp !== n.fp && o.version === n.version) {
      out.push({ level: "warning", msg: `Practice "${id}" (${n.page}) changed structure but its \`version\` is still ${n.version}. Bump \`version\` to ${n.version + 1}. (Learners' unfinished attempts are reset either way; best scores are kept.)` });
    }
    if (patch) {
      out.push({ level: "warning", msg: `Practice "${id}" changed in a PATCH release (${oldM.version} → ${newM.version}). Learners already in progress on ${oldM.version.split(".").slice(0, 2).join(".")} will get it and their unfinished attempt restarts. Structural changes belong in a minor release.` });
    } else if (o.fp !== n.fp || o.version !== n.version) {
      out.push({ level: "notice", msg: `Practice "${id}": v${o.version} → v${n.version}${o.fp !== n.fp ? " (structure changed)" : ""}.` });
    }
  }
  if (patch) {
    for (const id of before.keys()) if (!after.has(id)) out.push({ level: "warning", msg: `Practice "${id}" was removed in a PATCH release. Pinned cohorts lose it; prefer a minor release.` });
    for (const id of after.keys()) if (!before.has(id)) out.push({ level: "warning", msg: `Practice "${id}" was added in a PATCH release. It changes the page's points in Moodle; prefer a minor release.` });
  }
  return out;
}

export function bumpType(oldV, newV) {
  const [a, b] = [oldV, newV].map((v) => String(v).split(".").map(Number));
  if (a[0] !== b[0]) return "major";
  if (a[1] !== b[1]) return "minor";
  return "patch";
}

export function report(findings) {
  const gh = !!process.env.GITHUB_ACTIONS;
  for (const f of findings) console.log(gh ? `::${f.level === "warning" ? "warning" : "notice"} title=Practice versions::${f.msg}` : `${f.level === "warning" ? "⚠" : "·"} ${f.msg}`);
  if (process.env.GITHUB_STEP_SUMMARY && findings.length) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Practice versions\n${findings.map((f) => `- ${f.level === "warning" ? "⚠️" : "ℹ️"} ${f.msg}`).join("\n")}\n`);
  }
  if (!findings.length) console.log("✓ practices: no changes affecting learners in progress");
}

async function readManifest(src) {
  if (/^https?:/.test(src)) {
    try {
      const r = await fetch(src);
      return r.ok ? await r.json() : null;
    } catch { return null; }
  }
  return fs.existsSync(src) ? JSON.parse(fs.readFileSync(src, "utf8")) : null;
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const [oldSrc, newSrc] = process.argv.slice(2);
  const i = process.argv.indexOf("--bump");
  const oldM = await readManifest(oldSrc), newM = await readManifest(newSrc);
  if (!oldM || !newM) {
    console.log(`· practices: could not read ${!oldM ? oldSrc : newSrc}; skipping comparison`);
  } else {
    report(compareLabs(oldM, newM, i > 0 ? process.argv[i + 1] : undefined));
  }
}

/*
 * A fix release (X.Y.Z with Z > 0) reaches every learner on line X.Y by itself, so it must not
 * change anything that affects points or progress. This compares a fix release with the previous
 * release of the same line and lists what it changes that only a new line (X.Y+1.0) may change:
 *
 *   - topics added, removed or moved to another address;
 *   - a topic's maximum points (maxScore);
 *   - the interactive blocks on a topic (widgets);
 *   - a practice's structure or version (labs).
 *
 * Text, typos, links, pictures and answer explanations are fine in a fix.
 *
 *   node scripts/check-release.mjs <previous manifest> <new manifest>
 *
 * deploy.mjs runs it for every fix tag and stops the publication when it finds something.
 */
import fs from "node:fs";
import path from "node:path";

const sorted = (list) => [...(list || [])].sort().join(", ");

export function compareRelease(oldM, newM) {
  const problems = [];
  const before = new Map((oldM.pages || []).map((p) => [p.id, p]));
  const after = new Map((newM.pages || []).map((p) => [p.id, p]));
  for (const [id, n] of after) {
    const o = before.get(id);
    if (!o) {
      problems.push(`Topic "${n.title}" (${id}) is new.`);
      continue;
    }
    if (o.path !== n.path) problems.push(`Topic "${n.title}" moved: ${o.path} → ${n.path} (its Moodle activity would lose the page).`);
    if ((o.maxScore || 0) !== (n.maxScore || 0)) problems.push(`Topic "${n.title}": maximum points ${o.maxScore || 0} → ${n.maxScore || 0}.`);
    if (sorted(o.widgets) !== sorted(n.widgets)) problems.push(`Topic "${n.title}": interactive blocks [${sorted(o.widgets)}] → [${sorted(n.widgets)}].`);
  }
  for (const [id, o] of before) if (!after.has(id)) problems.push(`Topic "${o.title}" (${id}) was removed.`);
  const labsBefore = new Map((oldM.labs || []).map((l) => [l.id, l]));
  const labsAfter = new Map((newM.labs || []).map((l) => [l.id, l]));
  for (const [id, n] of labsAfter) {
    const o = labsBefore.get(id);
    if (!o) problems.push(`Practice "${n.title || id}" is new.`);
    else if (o.fp !== n.fp || o.version !== n.version) problems.push(`Practice "${n.title || id}" changed its structure${o.version !== n.version ? ` (version ${o.version} → ${n.version})` : ""}.`);
  }
  for (const [id, o] of labsBefore) if (!labsAfter.has(id)) problems.push(`Practice "${o.title || id}" was removed.`);
  return problems;
}

export function fixReleaseError(prev, version, problems) {
  const [major, minor] = version.split(".").map(Number);
  return [
    `v${version} is a fix release of line ${major}.${minor}: it would reach every learner on ${major}.${minor} by itself (they are on v${prev} now).`,
    "It changes what only a new version line may change:",
    ...problems.map((p) => `  - ${p}`),
    `Release it as v${major}.${minor + 1}.0 instead, and assign that line in Moodle (More → Content versions).`,
  ].join("\n");
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const [oldSrc, newSrc] = process.argv.slice(2);
  const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
  const oldM = read(oldSrc), newM = read(newSrc);
  const problems = compareRelease(oldM, newM);
  if (problems.length) {
    console.error(fixReleaseError(oldM.version, newM.version, problems));
    process.exit(1);
  }
  console.log(`✓ v${newM.version}: nothing that affects points or progress changed since v${oldM.version}`);
}

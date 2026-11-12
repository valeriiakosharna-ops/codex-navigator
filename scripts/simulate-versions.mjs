/*
 * Local rehearsal of the production setup: two published versions + latest + pins,
 * served exactly under the same paths as GitHub Pages (/codex-navigator/...).
 *
 *   npm run simulate-versions      then open the URLs it prints
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { deploy } from "./deploy.mjs";
import { ROOT } from "../build/build.mjs";

const port = Number(process.env.PORT || 4400);
const repo = "codex-navigator";
const sim = path.join(os.tmpdir(), "lx-version-sim");
const site = path.join(sim, repo);
fs.rmSync(sim, { recursive: true, force: true });
const pins = path.join(sim, "pins.yaml");
fs.mkdirSync(sim, { recursive: true });
fs.writeFileSync(pins, `# demo pins\ncourses:\n  "7": "1.0"     # Moodle course 7 = spring cohort, stays on 1.0.x\nusers:\n  "99": "1.0.0"  # one learner pinned to an exact version\nsites:\n  https://moodle-b.example:\n    courses:\n      "7": "1.1"   # course 7 on ANOTHER Moodle is a different cohort\n`);

const siteUrl = `http://localhost:${port}/${repo}/`;
const quiet = () => {};
for (const v of ["1.0.0", "1.0.1", "1.1.0"]) await deploy({ site, ref: `refs/tags/v${v}`, siteUrl, pins, log: quiet });
await deploy({ site, ref: "refs/heads/main", siteUrl, pins, log: quiet });

const page = "getting-started/what-is-codex/";
console.log(`
Simulated site in ${sim}
Versions: 1.0.0, 1.0.1, 1.1.0 (latest) · pins: course 7 → 1.0, user 99 → 1.0.0

Try (watch the version badge in the header):
  cohort pin   http://localhost:${port}/__moodle/?url=/${repo}/latest/${page}&uid=42&cid=7    → v1.0.1
  user pin     http://localhost:${port}/__moodle/?url=/${repo}/latest/${page}&uid=99&cid=7    → v1.0.0
  no pin       http://localhost:${port}/__moodle/?url=/${repo}/latest/${page}&uid=5&cid=8     → v1.1.0 (and remembered)
  versions     http://localhost:${port}/${repo}/versions/
`);
const child = spawn(process.execPath, [path.join(ROOT, "build", "dev.mjs"), "--serve", sim, "--port", String(port)], { stdio: "inherit" });
process.on("SIGINT", () => { child.kill(); process.exit(0); });

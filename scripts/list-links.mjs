/*
 * Lists every external link in the course content: resource cards (with the declared format and
 * duration), inline Markdown links and module "official course" links.
 *   node scripts/list-links.mjs [--json]
 * Used for content audits; the weekly link check workflow covers availability.
 */
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { ROOT } from "../build/build.mjs";

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(md|yaml)$/.test(f)) files.push(p);
  }
})(path.join(ROOT, "content"));

const out = [];
for (const f of files) {
  const rel = path.relative(path.join(ROOT, "content"), f).split(path.sep).join("/");
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/```resource\r?\n([\s\S]*?)```/g)) {
    const r = yaml.load(m[1]);
    out.push({ file: rel, kind: "resource", title: r.title, url: r.url, format: r.format || "docs", duration: r.duration || "" });
  }
  for (const m of s.matchAll(/\]\((https?:[^)\s]+)\)/g)) out.push({ file: rel, kind: "inline", url: m[1] });
  if (f.endsWith(".yaml")) {
    const y = yaml.load(s) || {};
    if (y.official?.url) out.push({ file: rel, kind: "module", title: y.official.title, url: y.official.url });
  }
}

if (process.argv.includes("--json")) console.log(JSON.stringify(out, null, 2));
else for (const o of out) console.log([o.kind, o.file, o.format || "", o.duration || "", o.title || "", o.url].join(" | "));

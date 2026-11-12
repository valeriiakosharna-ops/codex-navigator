#!/usr/bin/env node
/*
 * Course builder: content/*.md + widgets/* -> static site in dist/.
 *
 * Environment (all optional; CI sets them, authors never need to):
 *   LX_SITE_URL  public root of the whole site, e.g. https://org.github.io/codex-navigator/
 *   LX_CHANNEL   dev | preview | latest | version
 *   LX_VERSION   1.2.0  (defaults to "0.0.0-dev")
 *   LX_OUT       output directory (default dist)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as yaml from "js-yaml";
import { z } from "zod";
import * as esbuild from "esbuild";
import { renderMarkdown, parseFrontmatter } from "./markdown.mjs";
import { layout, topicBody } from "./templates.mjs";
import { esc, stripOrder, jsonForScript } from "./util.mjs";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
import { AUDIENCES, audienceText } from "./audience.mjs";
const P = (...p) => path.join(ROOT, ...p);

// ------------------------------------------------------------------ schemas for course files
const courseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  language: z.string().default("en"),
  gradeMode: z.enum(["on-complete", "each-answer"]).default("on-complete"),
  layout: z.enum(["slides", "scroll"]).default("slides"),
  moodleOrigins: z.array(z.string()).default([]),
  footer: z.string().optional(),
  intro: z.string().optional(),
});
const moduleSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  official: z.object({ title: z.string(), url: z.url() }).optional(),
  courses: z.array(z.object({ title: z.string(), url: z.url(), badge: z.boolean().default(true) })).optional(),
}).strict();
const pageSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
  duration: z.string().optional(),
  audience: z.array(z.enum(AUDIENCES)).min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  gradeMode: z.enum(["on-complete", "each-answer"]).optional(),
  layout: z.enum(["slides", "scroll"]).optional(),
  draft: z.boolean().default(false),
}).strict();

export async function loadRegistry() {
  const registry = {};
  for (const dir of fs.readdirSync(P("widgets")).sort()) {
    const file = P("widgets", dir, "widget.mjs");
    if (!fs.existsSync(file)) continue;
    const def = (await import(pathToFileURL(file).href + `?t=${Date.now()}`)).default;
    def.dir = dir;
    def.hasElement = fs.existsSync(P("widgets", dir, "element.js"));
    if (def.kind === "interactive" && !def.hasElement) throw new Error(`widgets/${dir}: interactive widget needs element.js`);
    registry[def.name] = def;
  }
  return registry;
}

function copyDir(src, dest, filter = () => true) {
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d, filter);
    else if (filter(s)) {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
}

export async function build(opts = {}) {
  const t0 = Date.now();
  const siteUrl = (opts.siteUrl || process.env.LX_SITE_URL || "http://localhost:4321/").replace(/\/?$/, "/");
  const channel = opts.channel || process.env.LX_CHANNEL || "dev";
  const version = opts.version || process.env.LX_VERSION || "0.0.0-dev";
  const out = path.resolve(ROOT, opts.out || process.env.LX_OUT || "dist");
  const siteRoot = new URL(siteUrl).pathname;
  const channelPath = { dev: "", preview: "preview/", latest: "latest/", version: `v/${version}/` }[channel];
  if (channelPath === undefined) throw new Error(`Unknown LX_CHANNEL "${channel}"`);
  const base = siteRoot + channelPath;
  const latestUrl = siteUrl + (channel === "dev" ? "" : "latest/");

  const errors = [];
  const report = (file) => (code, message, line) =>
    errors.push({ code, file: path.relative(ROOT, file).replace(/\\/g, "/"), line, message });

  // ---------------------------------------------------------------- course + modules + pages
  const courseFile = P("course.yaml");
  const courseParsed = courseSchema.safeParse(yaml.load(fs.readFileSync(courseFile, "utf8")));
  if (!courseParsed.success) throw new Error(`course.yaml: ${courseParsed.error.message}`);
  const course = courseParsed.data;
  const registry = await loadRegistry();

  const modules = [];
  const moduleDirs = fs.readdirSync(P("content"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  for (const dirName of moduleDirs) {
    const modFile = P("content", dirName, "module.yaml");
    let meta = { title: stripOrder(dirName) };
    if (fs.existsSync(modFile)) {
      const r = moduleSchema.safeParse(yaml.load(fs.readFileSync(modFile, "utf8")) || {});
      if (r.success) meta = r.data;
      else report(modFile)("LX-B106", r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "), 1);
    } else {
      report(modFile)("LX-B106", "module.yaml is missing (needs at least `title:`)", 1);
    }
    const slug = meta.slug || stripOrder(dirName);
    const mod = { ...meta, slug, dir: dirName, index: modules.length + 1, pages: [] };
    const files = fs.readdirSync(P("content", dirName)).filter((f) => f.endsWith(".md")).sort();
    for (const f of files) {
      const file = P("content", dirName, f);
      const source = fs.readFileSync(file, "utf8");
      let fm;
      try {
        fm = parseFrontmatter(source);
      } catch (e) {
        report(file)("LX-B106", `Front matter is not valid YAML: ${e.reason || e.message}`, 1);
        continue;
      }
      const r = pageSchema.safeParse(fm.data);
      if (!r.success) {
        report(file)("LX-B106", `Front matter: ${r.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ")}`, 1);
        continue;
      }
      if (r.data.draft && channel !== "dev") continue;
      const pslug = r.data.slug || stripOrder(f.replace(/\.md$/, ""));
      mod.pages.push({ ...r.data, file, fm, slug: pslug, id: `${slug}/${pslug}`, url: `${base}${slug}/${pslug}/`, path: `${slug}/${pslug}/` });
    }
    modules.push(mod);
  }

  const allPages = modules.flatMap((m) => m.pages.map((p) => ({ ...p, mod: m })));
  const byFile = new Map(allPages.map((p) => [path.resolve(p.file), p]));
  const seen = new Map();
  for (const p of allPages) {
    if (seen.has(p.id)) report(p.file)("LX-B107", `URL "${p.id}" is already used by ${path.relative(ROOT, seen.get(p.id))}. Set a different slug.`, 1);
    seen.set(p.id, p.file);
  }

  // ---------------------------------------------------------------- render pages
  const assetUrl = (abs) => `${base}assets/content/${path.relative(P("content"), abs).replace(/\\/g, "/")}`;
  for (const p of allPages) {
    const ctx = {
      file: p.file,
      lineOffset: p.fm.lineOffset,
      registry,
      report: report(p.file),
      resolvePage: (abs) => byFile.get(path.resolve(abs))?.url || null,
      pageIdFor: (abs) => byFile.get(path.resolve(abs))?.id || null,
      assetUrl,
      counters: {},
    };
    const { html, widgets } = renderMarkdown(p.fm.body, ctx);
    p.html = html;
    p.widgets = widgets;
    p.maxScore = widgets.reduce((s, w) => s + w.max, 0);
    // copy back onto module page objects (used by nav & templates)
    Object.assign(p.mod.pages.find((x) => x.id === p.id), { html, widgets, maxScore: p.maxScore });
  }

  if (errors.length) {
    const err = new Error(`${errors.length} problem(s) found`);
    err.lxErrors = errors;
    throw err;
  }

  // ---------------------------------------------------------------- write output
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const pinScript = (await esbuild.transform(fs.readFileSync(P("shell", "pin.js"), "utf8"), { minify: true, target: "es2018" })).code.trim();
  const builtAt = new Date().toISOString();
  const nav = modules.map((m) => ({ title: m.title, slug: m.slug, pages: m.pages.map((p) => ({ id: p.id, title: p.title, url: p.url })) }));
  const site = { course, version, channel, base, siteRoot, nav, pinScript, builtAt, buildId: `${version}-${Date.now().toString(36)}`, devReload: !!opts.devReload };

  const write = (rel, content) => {
    const f = path.join(out, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, content);
  };

  allPages.forEach((p, i) => {
    const prev = allPages[i - 1], next = allPages[i + 1];
    const body = topicBody(site, p.mod, p, prev, next);
    write(path.join(p.path, "index.html"), layout(site, { title: p.title, description: p.summary, id: p.id, body, sidebar: true, gradeMode: p.gradeMode }));
  });

  write("index.html", layout(site, { bare: true, title: "Overview", description: course.description, id: "home", current: "home", body: homeBody(site, modules, course, registry) }));
  write("widgets/index.html", layout(site, { title: "Widget catalog", id: "widgets", current: "widgets", body: catalogBody(site, registry) }));
  write("moodle/index.html", layout(site, { title: "Moodle setup", id: "moodle", current: "moodle", body: moodleBody(site, allPages, latestUrl) }));

  // assets
  const css = ["tokens.css", "site.css"].map((f) => fs.readFileSync(P("theme", f), "utf8")).join("\n");
  write("assets/lx.css", (await esbuild.transform(css, { loader: "css", minify: true })).code);
  const entry = ["./shell/bridge.js", ...Object.values(registry).filter((d) => d.hasElement).map((d) => `./widgets/${d.dir}/element.js`)]
    .map((f) => `import ${JSON.stringify(f)};`)
    .join("\n");
  await esbuild.build({
    stdin: { contents: entry, resolveDir: ROOT, sourcefile: "lx-entry.js" },
    bundle: true,
    format: "esm",
    minify: true,
    target: "es2021",
    outfile: path.join(out, "assets", "lx.js"),
    legalComments: "none",
    logLevel: "silent",
  });
  copyDir(P("public"), out);
  copyDir(P("content"), path.join(out, "assets", "content"), (f) => !/\.(md|yaml|yml)$/i.test(f));

  // discovery record for this build
  const manifest = {
    course: course.id,
    title: course.title,
    version,
    channel,
    builtAt,
    widgets: Object.fromEntries(Object.values(registry).map((d) => [d.name, d.version])),
    pages: allPages.map((p) => ({ id: p.id, title: p.title, path: p.path, maxScore: p.maxScore, widgets: p.widgets.map((w) => w.name) })),
    // versioned practices: used for history on /versions/ and the patch-vs-minor check
    labs: allPages.flatMap((p) => p.widgets.filter((w) => w.fp).map((w) => ({ id: w.id, page: p.id, widget: w.name, title: w.title, version: w.version, fp: w.fp }))),
  };
  write("manifest.json", JSON.stringify(manifest, null, 2));
  if (channel === "dev") {
    write("versions.json", JSON.stringify({ latest: version, versions: [{ version }] }));
    write("pins.json", "{}");
    write("moodle.json", JSON.stringify({ sites: {} }));
  }

  return { out, pages: allPages.length, ms: Date.now() - t0, manifest, base };
}

// ------------------------------------------------------------------ special pages
function homeBody(site, modules, course) {
  return `<section class="lx-hero">
  <div class="lx-eyebrow">Learning navigator</div>
  <h1>${esc(course.title)}</h1>
  ${course.tagline ? `<p>${esc(course.tagline)}</p>` : ""}
</section>
${course.intro ? `<div class="lx-prose lx-intro">${renderIntro(course.intro)}</div>` : ""}
<div class="lx-modules">
${modules
  .map(
    (m) => `<section class="lx-module" id="${m.slug}">
  <div class="lx-module__num" aria-hidden="true">${m.index}</div>
  <h2>${esc(m.title)}</h2>
  ${m.summary ? `<p>${esc(m.summary)}</p>` : ""}
  ${m.official ? `<p><span class="lx-chip lx-chip--official">Official course</span> <a href="${esc(m.official.url)}" target="_blank" rel="noopener">${esc(m.official.title)}</a></p>` : ""}
  ${m.courses?.length ? `<p class="lx-module__courses"><span class="lx-chip lx-chip--official">Official course${m.courses.length > 1 ? "s" : ""}</span> ${m.courses.map((c) => `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a>${c.badge ? " 🏅" : ""}`).join(" · ")}</p>` : ""}
  <ol>${m.pages.map((p) => `<li><a href="${p.url}"><span>${esc(p.title)}</span><span class="muted">${p.audience ? `${esc(audienceText(p.audience))} · ` : ""}${p.duration ? esc(p.duration) : ""}</span></a></li>`).join("")}</ol>
</section>`,
  )
  .join("\n")}
</div>`;
}

function renderIntro(md) {
  // course.intro is short Markdown; reuse the page renderer without widgets
  return renderMarkdown(md, { file: P("course.yaml"), lineOffset: 0, registry: {}, report: () => {}, resolvePage: () => null, assetUrl: (x) => x, counters: {} }).html;
}

function catalogBody(site, registry) {
  const ctxFor = (name) => ({ file: P("widgets", name, "widget.mjs"), lineOffset: 0, registry, report: (c, m) => { throw new Error(`catalog example for ${name}: ${m}`); }, resolvePage: () => null, assetUrl: (x) => x, counters: {} });
  const items = Object.values(registry).map((d) => {
    const demo = renderMarkdown("```" + d.name + "\n" + d.example + "```\n", ctxFor(d.dir)).html.replace(/id="([a-z]+-\d+)"/, `id="catalog-${d.name}"`);
    const props = z.toJSONSchema(d.schema, { io: "input", unrepresentable: "any" }).properties || {};
    const required = new Set(z.toJSONSchema(d.schema, { io: "input", unrepresentable: "any" }).required || []);
    const rows = Object.entries(props)
      .map(([k, v]) => `<tr><td><code>${esc(k)}</code>${required.has(k) ? " <strong>*</strong>" : ""}</td><td>${esc(v.description || "")}${v.default !== undefined ? ` <span class="muted">Default: <code>${esc(JSON.stringify(v.default))}</code></span>` : ""}</td></tr>`)
      .join("");
    return `<section class="lx-catalog-item" id="${d.name}">
  <h2>${esc(d.title)} <code>${esc(d.name)}</code></h2>
  <div class="lx-meta">
    <span class="lx-chip">v${esc(d.version)}</span>
    <span class="lx-chip">${d.kind === "interactive" ? "interactive web component" : "static block"}</span>
    ${d.graded ? '<span class="lx-chip lx-chip--graded">counts towards the grade</span>' : ""}
  </div>
  <p>${renderMarkdown(d.description, ctxFor(d.dir)).html.replace(/^<p>|<\/p>\n?$/g, "")}</p>
  <h3>Live example</h3>
  <div class="lx-catalog-demo">${demo}</div>
  <h3>Copy this into your page</h3>
  <pre><code>\`\`\`${esc(d.name)}\n${esc(d.example)}\`\`\`</code></pre>
  <h3>Fields</h3>
  <table><thead><tr><th>Field</th><th>Meaning</th></tr></thead><tbody>${rows}</tbody></table>
</section>`;
  });
  return `<article class="lx-prose">
  <h1>Widget catalog</h1>
  <p class="lx-lead">Every building block you can use in a page. Copy a snippet, change the text, done. Fields marked <strong>*</strong> are required — the build tells you exactly what is wrong if something is missing.</p>
  <h2 id="callouts">Callouts</h2>
  <p>Use GitHub-style alerts. An optional title can follow the marker.</p>
  <pre><code>&gt; [!TIP] While watching the video
&gt; Pause at the approvals part and try it yourself.</code></pre>
  ${renderMarkdown("> [!NOTE]\n> Extra context.\n\n> [!TIP] While watching the video\n> Pause at the approvals part and try it yourself.\n\n> [!IMPORTANT] Best practice\n> Review every diff before you commit.\n\n> [!WARNING] Common pitfall\n> Granting full access before you understand the workflow.\n\n> [!CAUTION]\n> Never paste secrets into a prompt.\n", ctxFor("quiz")).html}
  ${items.join("\n")}
</article>`;
}

function moodleBody(site, pages, latestUrl) {
  const rows = pages
    .map(
      (p, i) => `<tr><td>${p.mod.index}.${p.mod.pages.indexOf(p.mod.pages.find((x) => x.id === p.id)) + 1}</td><td>${esc(p.title)}</td>
<td>${esc(audienceText(p.audience)) || "—"}</td><td><code>${esc(latestUrl + p.path)}</code></td><td>${p.maxScore || "—"}</td></tr>`,
    )
    .join("");
  return `<article class="lx-prose">
  <h1>Moodle setup</h1>
  <p class="lx-lead">One Moodle activity (<em>External page with grades</em>) per page. Paste the URL from the table — always the <code>latest/</code> address; the page itself switches each learner to the right version.</p>
  <h2>Activity settings</h2>
  <ol>
    <li><strong>External page URL</strong>: the URL from the table below.</li>
    <li><strong>URL variables</strong>: <code>uid</code> = <em>User ID</em>, <code>cid</code> = <em>Course ID</em>. On <strong>badge checkpoint</strong> pages also add <code>name</code> = <em>Full name</em>: the page compares it with the name on the badge and doesn't store it. Don't pass e-mails.</li>
    <li><strong>Description</strong>: start with "For whom: …" from the table, so learners see in the course page which topics are theirs.</li>
    <li><strong>Maximum grade</strong>: any value (e.g. 100). The page sends <em>score / max</em>, Moodle scales it.</li>
    <li><strong>Grading method</strong>: <em>Highest</em> is recommended (retries never lower the grade).</li>
  </ol>
  <h2>Pages</h2>
  <table><thead><tr><th>#</th><th>Activity name</th><th>For whom</th><th>URL to paste</th><th>Points on page</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="muted">Page ids for <code>moodle.yaml</code>: ${pages.map((p) => `<code>${esc(p.id)}</code>`).join(", ")}</p>
  <h2>Links between topics</h2>
  <p>Inside Moodle, a link from one topic to another opens the matching <em>Moodle activity</em>, not this website. After creating the activities, add their ids to <code>moodle.yaml</code> in the repository (page id → activity id from <code>view.php?id=…</code>). Without an entry, such links open the Moodle course page.</p>
  <h2>Which version does a learner see?</h2>
  <p>Cohorts are pinned in <code>pins.yaml</code> by Moodle course id (see the repository docs, <em>docs/VERSIONING.md</em>). Without a cohort pin, each learner stays on the version they opened first.</p>
  <script type="application/json" id="lx-pages">${jsonForScript(pages.map((p) => ({ id: p.id, title: p.title, summary: p.summary || "", audience: audienceText(p.audience), url: latestUrl + p.path, max: p.maxScore, badge: p.widgets.some((w) => w.name === "badge") })))}</script>
</article>`;
}

// ------------------------------------------------------------------ CLI
export function printErrors(errors) {
  const lines = errors.map((e) => `\n✗ ${e.code}  ${e.file}${e.line ? `:${e.line}` : ""}\n  ${e.message.replace(/\n/g, "\n  ")}`);
  console.error(lines.join("\n") + `\n\n${errors.length} problem(s). See docs/AUTHORING.md#error-codes\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build()
    .then((r) => console.log(`✓ Built ${r.pages} pages into ${path.relative(ROOT, r.out)} (base ${r.base}) in ${r.ms} ms`))
    .catch((e) => {
      if (e.lxErrors) printErrors(e.lxErrors);
      else console.error(e);
      process.exit(1);
    });
}

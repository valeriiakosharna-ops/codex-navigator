#!/usr/bin/env node
/*
 * Local preview with live reload.
 *   npm run dev                      -> build, serve http://localhost:4321, rebuild on every save
 *   node build/dev.mjs --serve DIR   -> just serve a folder (used by tests and the version simulator)
 * When the content has a mistake, the browser shows the error list instead of the page.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { build, ROOT, printErrors } from "./build.mjs";
import { esc } from "./util.mjs";

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const port = Number(flag("--port") || process.env.PORT || 4321);
const serveOnly = flag("--serve");
const root = path.resolve(serveOnly || path.join(ROOT, "dist"));

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon", ".mp4": "video/mp4", ".pdf": "application/pdf" };
const clients = new Set();
let lastErrors = null;

function errorPage(errors) {
  return `<!doctype html><meta charset="utf-8"><title>Build problems</title>
<style>body{font:16px/1.6 system-ui;background:#302a40;color:#fff;padding:32px}h1{color:#ef958c}
.e{background:#fff;color:#302a40;border-left:6px solid #e60036;border-radius:8px;padding:14px 18px;margin:14px 0}
code{background:#f0f2f5;padding:2px 6px;border-radius:4px}pre{white-space:pre-wrap;margin:6px 0 0;font:14px/1.5 ui-monospace,Consolas,monospace}</style>
<h1>⚠ ${errors.length} problem(s) — fix and save, the page reloads by itself</h1>
${errors.map((e) => `<div class="e"><strong>${esc(e.code)}</strong> · <code>${esc(e.file)}${e.line ? ":" + e.line : ""}</code><pre>${esc(e.message)}</pre></div>`).join("")}
<script>new EventSource("/__lx_reload").onmessage = () => location.reload();</script>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/__lx_reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("retry: 1000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (url.pathname === "/__moodle/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(ROOT, "build", "moodle-sim.html")));
  }
  if (lastErrors && !serveOnly) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(errorPage(lastErrors));
  }
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith("/")) { res.writeHead(301, { Location: url.pathname + "/" + url.search }); return res.end(); }
    file = path.join(file, "index.html");
  }
  if (!fs.existsSync(file)) {
    // GitHub Pages project sites serve <repo>/404.html; mimic that for simulations.
    const first = url.pathname.split("/").filter(Boolean)[0] || "";
    const notFound = [path.join(root, "404.html"), path.join(root, first, "404.html")].find((f) => fs.existsSync(f)) || "";
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(notFound ? fs.readFileSync(notFound) : "Not found");
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
});

async function rebuild() {
  try {
    const r = await build({ devReload: true, siteUrl: `http://localhost:${port}/`, channel: "dev" });
    lastErrors = null;
    console.log(`✓ ${new Date().toLocaleTimeString()}  ${r.pages} pages in ${r.ms} ms`);
  } catch (e) {
    lastErrors = e.lxErrors || [{ code: "LX-B100", file: "(build)", message: e.stack || String(e) }];
    printErrors(lastErrors);
  }
  for (const c of clients) c.write("data: reload\n\n");
}

if (!serveOnly) {
  await rebuild();
  let timer;
  for (const dir of ["content", "widgets", "shell", "theme", "public"]) {
    fs.watch(path.join(ROOT, dir), { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 150); });
  }
  fs.watch(path.join(ROOT, "course.yaml"), () => { clearTimeout(timer); timer = setTimeout(rebuild, 150); });
}

server.listen(port, () => console.log(`${serveOnly ? "Serving " + root : "Preview"} → http://localhost:${port}/`));

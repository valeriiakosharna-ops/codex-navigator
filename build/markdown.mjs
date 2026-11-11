import path from "node:path";
import fs from "node:fs";
import * as yaml from "js-yaml";
import { Marked } from "marked";
import { esc, slugify, richify, jsonForScript, icons } from "./util.mjs";

const CALLOUTS = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
};

/** Line numbers of fenced blocks whose language is a registered widget, in document order. */
function widgetFenceLines(source, names) {
  const lines = source.split(/\r?\n/);
  const out = [];
  let inFence = null;
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(`{3,}|~{3,})\s*([\w-]*)/);
    if (!m) return;
    if (!inFence) {
      inFence = m[1];
      if (names.has(m[2])) out.push(i + 1);
    } else if (line.trim().startsWith(inFence)) {
      inFence = null;
    }
  });
  return out;
}

function formatIssues(error) {
  return error.issues
    .map((i) => `  • ${i.path.length ? i.path.join(".") : "(block)"}: ${i.message}`)
    .join("\n");
}

/**
 * Render one Markdown page.
 * ctx: { file, source, lineOffset, registry, report(code,msg,line), resolvePage(absMdPath) -> url|null,
 *        assetUrl(absPath) -> url, counters }
 */
export function renderMarkdown(body, ctx) {
  const names = new Set(Object.keys(ctx.registry));
  const fenceLines = widgetFenceLines(body, names);
  let fenceIndex = 0;
  const usedIds = new Set();
  const widgets = []; // { name, id, graded, max }
  const dir = path.dirname(ctx.file);

  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      code({ text, lang }) {
        const def = lang && ctx.registry[lang];
        if (!def) {
          return `<pre><code${lang ? ` class="language-${esc(lang)}"` : ""}>${esc(text)}</code></pre>\n`;
        }
        const line = (fenceLines[fenceIndex++] || 0) + ctx.lineOffset;
        let data;
        try {
          data = yaml.load(text) ?? {};
        } catch (e) {
          const at = e.mark ? line + 1 + e.mark.line : line;
          ctx.report("LX-B101", `YAML syntax error in \`${lang}\` block: ${e.reason || e.message}`, at);
          return "";
        }
        const parsed = def.schema.safeParse(data);
        if (!parsed.success) {
          ctx.report("LX-B102", `\`${lang}\` block has invalid fields:\n${formatIssues(parsed.error)}`, line);
          return "";
        }
        const config = richify(parsed.data);
        if (def.kind === "static") return def.render(config, ctx) + "\n";

        let id = parsed.data.id || `${lang}-${(ctx.counters[lang] = (ctx.counters[lang] || 0) + 1)}`;
        if (usedIds.has(id)) {
          ctx.report("LX-B109", `Duplicate widget id "${id}" on this page.`, line);
          id = `${id}-${usedIds.size}`;
        }
        usedIds.add(id);
        const graded = def.graded && parsed.data.graded !== false;
        const max = graded ? (lang === "quiz" ? parsed.data.questions.length : 1) : 0;
        widgets.push({ name: lang, id, graded, max });
        return `<lx-${lang} id="${esc(id)}"><script type="application/json">${jsonForScript(config)}</script></lx-${lang}>\n`;
      },

      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const id = slugify(inner);
        const anchor = depth === 2 || depth === 3 ? `<a class="lx-anchor" href="#${id}" aria-hidden="true">#</a>` : "";
        return `<h${depth} id="${id}">${inner}${anchor}</h${depth}>\n`;
      },

      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        const m = body.match(/^<p>\[!([A-Z-]+)\][ \t]*([^\n<]*)(\n|<\/p>\n?)/);
        if (!m) return `<blockquote>${body}</blockquote>\n`;
        const type = m[1];
        if (!CALLOUTS[type]) {
          ctx.report("LX-B103", `Unknown callout [!${type}]. Use one of: ${Object.keys(CALLOUTS).join(", ")}.`, ctx.lineOffset);
          return `<blockquote>${body}</blockquote>\n`;
        }
        const title = m[2].trim() || CALLOUTS[type];
        const rest = (m[3] === "\n" ? "<p>" : "") + body.slice(m[0].length);
        const key = type.toLowerCase();
        return `<div class="lx-callout lx-callout--${key}" role="note"><div class="lx-callout__title">${icons[key]}${title}</div>${rest}</div>\n`;
      },

      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const t = title ? ` title="${esc(title)}"` : "";
        if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:")) {
          return `<a href="${esc(href)}"${t} target="_blank" rel="noopener">${text}</a>`;
        }
        if (/\.md(#.*)?$/.test(href)) {
          const [p, hash] = href.split("#");
          const url = ctx.resolvePage(path.resolve(dir, decodeURI(p)));
          if (!url) {
            ctx.report("LX-B104", `Link to "${href}" does not match any page.`, ctx.lineOffset);
            return text;
          }
          return `<a href="${url}${hash ? "#" + hash : ""}"${t}>${text}</a>`;
        }
        return `<a href="${esc(href)}"${t}>${text}</a>`;
      },

      image({ href, title, text }) {
        let src = href;
        if (!/^(https?:)?\/\//.test(href) && !href.startsWith("data:")) {
          const abs = path.resolve(dir, decodeURI(href));
          if (!fs.existsSync(abs)) {
            ctx.report("LX-B105", `Image "${href}" not found.`, ctx.lineOffset);
          }
          src = ctx.assetUrl(abs);
        }
        return `<img src="${esc(src)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ""} loading="lazy">`;
      },
    },
  });

  const htmlOut = md.parse(body);
  return { html: htmlOut, widgets };
}

export function parseFrontmatter(source) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: source, lineOffset: 0 };
  return {
    data: yaml.load(m[1]) || {},
    body: source.slice(m[0].length),
    lineOffset: m[0].split(/\r?\n/).length - 1,
  };
}

import { html, css } from "lit";
import { LxElement, baseStyles } from "../../shell/base-element.js";

/**
 * Badge checkpoint. OpenAI Academy badges are issued by Accredible, whose public credential
 * record is readable without a key (CORS: *). Nothing about the learner is sent anywhere:
 * the only request is GET <api>/<credential id>.
 */
export const API = "https://api.accredible.com/v1/credential-net/credentials/";

/** Credential id from a badge link (credential.net, a custom Accredible domain, or a bare id). */
export function credentialId(input) {
  const s = String(input || "").trim();
  if (!s) return null;
  const uuid = s.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuid) return uuid[0].toLowerCase();
  if (/^\d{4,}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const seg = u.pathname.split("/").filter(Boolean).reverse().find((x) => /^\d{4,}$/.test(x));
    return seg || null;
  } catch {
    return null;
  }
}

// Ukrainian (KMU 2010) + Russian letters to Latin, so "Олена Коваль" matches "Olena Koval".
const TR = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch",
  ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", ё: "e", ы: "y", э: "e", ъ: "", "'": "", "’": "", "ʼ": "",
};
export function nameTokens(name) {
  const latin = String(name || "")
    .toLowerCase()
    .replace(/[а-яёіїєґ'’ʼ]/g, (c) => TR[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  // fold common romanisation variants (h/g, kh/h, y/i, j/i) so both spellings compare equal
  return latin
    .split(/[^a-z]+/)
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/kh/g, "h").replace(/g/g, "h").replace(/[yj]/g, "i").replace(/ii/g, "i"));
}
function close(a, b) {
  if (a === b) return true;
  if (Math.min(a.length, b.length) < 4) return false;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length] <= Math.floor(Math.max(a.length, b.length) / 4);
}
/** True when every name part of the shorter name has a close match in the longer one (order-free). */
export function sameName(a, b) {
  const x = nameTokens(a), y = nameTokens(b);
  if (!x.length || !y.length) return false;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  return short.length >= Math.min(2, long.length) && short.every((t) => long.some((u) => close(t, u)));
}

/** Pure check of an Accredible record against the widget config. Exported for tests. */
export function evaluate(data, cfg, learnerName) {
  const issuer = data?.issuer?.name || "";
  const names = [data?.name, data?.group?.course_name, data?.group?.name].filter(Boolean);
  const accept = (cfg.accept?.length ? cfg.accept : [cfg.course]).map((s) => s.toLowerCase());
  const checks = [
    { key: "issuer", ok: issuer.toLowerCase().includes((cfg.issuer || "OpenAI").toLowerCase()), text: `Issued by ${issuer || "an unknown issuer"}` },
    { key: "course", ok: names.some((n) => accept.some((a) => n.toLowerCase().includes(a))), text: `Badge: ${names[0] || "unknown"}` },
    { key: "valid", ok: !data?.revoked_at && !data?.expired && data?.approve !== false, text: data?.revoked_at ? "Revoked" : data?.expired ? "Expired" : "Valid, not revoked or expired" },
  ];
  const recipient = data?.recipient?.name || "";
  if (cfg.checkName !== false && learnerName) {
    checks.push({ key: "name", ok: sameName(recipient, learnerName), text: `Issued to ${recipient || "an unknown person"}` });
  }
  return { ok: checks.every((c) => c.ok), checks, recipient, title: names[0] || "", issued: data?.issued_on || "", image: data?.badge_image?.preview?.url || data?.badge_image?.original?.url || "" };
}

class LxBadge extends LxElement {
  static graded = true;

  static styles = [
    baseStyles,
    css`
      .row { display: flex; gap: 10px; flex-wrap: wrap; }
      input#link {
        flex: 1 1 320px; min-width: 0; font: 500 15px var(--lx-font-body); padding: 10px 14px; border-radius: 12px;
        border: 1px solid var(--lx-border-strong); background: var(--lx-surface); color: var(--lx-text);
      }
      input:focus-visible { outline: 3px solid var(--lx-focus); outline-offset: 1px; }
      ol.steps { margin: 0 0 14px; padding-left: 22px; }
      ol.steps li { margin: 4px 0; }
      ul.checks { list-style: none; padding: 0; margin: 10px 0 0; }
      ul.checks li { display: flex; gap: 8px; align-items: baseline; padding: 3px 0; }
      .yes { color: var(--lx-success-ink); font-weight: 800; }
      .no { color: var(--lx-error-ink); font-weight: 800; }
      .earned { display: flex; gap: 16px; align-items: center; }
      .earned img { width: 84px; height: 84px; object-fit: contain; border-radius: 12px; background: var(--lx-surface-2); }
      .feedback.ok ul.checks .yes { color: inherit; }
    `,
  ];

  initialState() { return { link: "", status: "idle", result: null, checkedAt: "" }; }
  maxScore() { return 1; }
  result() { return { score: this.state?.status === "ok" ? 1 : 0, complete: this.state?.status === "ok" }; }

  get learnerName() { return (window.LX && window.LX.uname) || ""; }

  async check(e) {
    e?.preventDefault();
    const link = this.renderRoot.querySelector("input")?.value.trim() || "";
    const id = credentialId(link);
    if (!id) {
      this.setState({ link, status: "badlink", result: null });
      return;
    }
    this.setState({ link, status: "checking", result: null });
    try {
      const res = await fetch(API + encodeURIComponent(id), { headers: { Accept: "application/json" } });
      if (res.status === 404) return this.setState({ status: "notfound" });
      if (res.status === 401 || res.status === 403) return this.setState({ status: "private" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data } = await res.json();
      if (data?.private) return this.setState({ status: "private" });
      const r = evaluate(data, this.config, this.learnerName);
      const status = r.ok ? "ok" : r.checks.find((c) => c.key === "name" && !c.ok) && r.checks.filter((c) => !c.ok).length === 1 ? "name" : "mismatch";
      this.setState({ status, result: { ...r, id }, checkedAt: new Date().toISOString() });
    } catch (err) {
      console.warn("[badge] lookup failed", err);
      this.setState({ status: "network" });
    }
  }

  renderChecks(r) {
    return html`<ul class="checks">${r.checks.map((c) => html`<li><span class=${c.ok ? "yes" : "no"} aria-hidden="true">${c.ok ? "✓" : "✗"}</span><span>${c.text}</span></li>`)}</ul>`;
  }

  renderStatus() {
    const s = this.state, r = s.result, c = this.config;
    switch (s.status) {
      case "checking": return html`<p class="muted" role="status">Checking the badge with Accredible…</p>`;
      case "ok": return html`<div class="feedback ok" role="status">
          <div class="earned">
            ${r.image ? html`<img src=${r.image} alt="" loading="lazy">` : ""}
            <div><strong>Badge confirmed. This checkpoint is complete.</strong>
              <p>${r.title}${r.issued ? html`, issued ${r.issued}` : ""}.</p></div>
          </div>
          ${this.renderChecks(r)}
          ${!this.learnerName && c.checkName !== false ? html`<p class="muted">The name wasn't checked because Moodle didn't pass it. Your instructor may verify it.</p>` : ""}
        </div>`;
      case "name": return html`<div class="feedback bad" role="alert">
          <strong>The badge is valid, but it was issued to someone else, or under a different spelling of your name.</strong>
          ${this.renderChecks(r)}
          <p>Your name in Moodle: <b>${this.learnerName}</b>. If the badge is yours, send the link to your instructor and they will confirm it manually.</p>
        </div>`;
      case "mismatch": return html`<div class="feedback bad" role="alert">
          <strong>This badge doesn't complete this checkpoint.</strong>
          ${this.renderChecks(r)}
          <p>You need the <b>${c.course}</b> badge from OpenAI Academy.</p>
        </div>`;
      case "badlink": return html`<div class="feedback bad" role="alert">That doesn't look like a badge link. Open the email from Accredible, click <b>View badge</b> and copy the address of the page that opens.</div>`;
      case "notfound": return html`<div class="feedback bad" role="alert">Accredible has no badge with this link. Check that you copied the whole address.</div>`;
      case "private": return html`<div class="feedback bad" role="alert">This badge is private. On the badge page, sign in to Accredible, make the badge public, then check again.</div>`;
      case "network": return html`<div class="feedback bad" role="alert">Couldn't reach Accredible (api.accredible.com). Check your connection or VPN and try again. If your network blocks it, send the link to your instructor.</div>`;
      default: return "";
    }
  }

  renderWidget() {
    const c = this.config, s = this.state;
    const done = s.status === "ok";
    return html`<section class="card" aria-label="Badge checkpoint">
      <div class="eyebrow">🏅 Badge checkpoint ${this.graded ? html`<span class="graded">· graded</span>` : ""}</div>
      <h3>${c.course}</h3>
      ${done ? "" : html`<ol class="steps">
        <li>Complete <a href=${c.url} target="_blank" rel="noopener">${c.course}</a> in OpenAI Academy: the course <b>and</b> its assessment (pass mark 80%).</li>
        <li>Accredible emails you a link to your badge, at the address you use for OpenAI Academy.</li>
        <li>Open the badge, copy the page address and paste it below.</li>
      </ol>`}
      <form class="row" @submit=${this.check}>
        <label class="sr-only" for="link">Badge link</label>
        <input id="link" type="text" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://www.credential.net/…" .value=${s.link || ""} ?disabled=${s.status === "checking"}>
        <button class="btn-primary" type="submit" ?disabled=${s.status === "checking"}>${done ? "Check again" : "Check badge"}</button>
      </form>
      ${this.renderStatus()}
    </section>`;
  }
}

customElements.define("lx-badge", LxBadge);

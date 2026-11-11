import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LxElement, baseStyles } from "../../shell/base-element.js";

const LEVEL_DEFAULTS = {
  1: { attempts: 0, severity: false, showCount: true },
  2: { attempts: 2, severity: true, showCount: false },
  3: { attempts: 1, severity: true, showCount: false },
};
const SEVERITIES = ["critical", "major", "minor"];
const FALSE_ALARM = 0.34; // each wrong flag costs a third of a found problem
const WRONG_SEVERITY = 0.6; // found, but severity misjudged
const r2 = (x) => Math.round(x * 100) / 100;

class LxSpot extends LxElement {
  static graded = true;

  static styles = [
    baseStyles,
    css`
      .head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
      .file { font: 600 12px var(--lx-font-mono); color: #cfd5df; background: #1f232a; padding: 6px 12px; border-radius: 8px 8px 0 0; }
      .code { background: var(--lx-code-bg); border-radius: 0 0 8px 8px; padding: 6px 0; overflow-x: auto; }
      .code.nofile { border-radius: 8px; }
      .ln {
        display: grid; grid-template-columns: 44px 1fr auto; align-items: center; width: 100%; text-align: left;
        font: 13.5px/1.6 var(--lx-font-mono); color: var(--lx-code-text); background: none; border: 0; border-radius: 0;
        padding: 1px 10px 1px 0; cursor: pointer; white-space: pre;
      }
      .ln:hover { background: rgba(255,255,255,.06); }
      .ln:focus-visible { outline: 2px solid var(--lx-sky); outline-offset: -2px; }
      .num { color: #6c7686; text-align: right; padding-right: 12px; user-select: none; }
      .ln.add .txt { color: #a6e3a1; }
      .ln.del .txt { color: #f5a3b3; }
      .ln.add { background: rgba(80, 200, 120, .07); }
      .ln.del { background: rgba(230, 0, 54, .08); }
      .ln.flagged { background: rgba(0, 166, 235, .22); box-shadow: inset 3px 0 0 var(--lx-sky); }
      .ln.found { background: rgba(31, 138, 91, .35); box-shadow: inset 3px 0 0 #3ccf8e; }
      .ln.false { background: rgba(230, 0, 54, .3); box-shadow: inset 3px 0 0 #ff5c7a; }
      .ln.missed { background: rgba(255, 176, 32, .25); box-shadow: inset 3px 0 0 #ffb020; }
      .ln[disabled] { cursor: default; opacity: 1; }
      .tag { font: 800 10px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; padding: 1px 7px; border-radius: 999px; margin-left: 8px; }
      .tag.flag { background: var(--lx-sky); color: var(--lx-ink); }
      .tag.ok { background: #3ccf8e; color: #08331f; }
      .tag.bad { background: #ff5c7a; color: #3d0010; }
      .tag.miss { background: #ffb020; color: #3d2600; }
      .sev { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin: 10px 0 0; font-size: 14px; }
      .sev-row { display: flex; gap: 8px; align-items: center; padding: 6px 0; border-top: 1px solid var(--lx-border); flex-wrap: wrap; }
      .sev-row:first-child { border-top: 0; }
      .sev-row code { white-space: nowrap; }
      select { font: 600 14px var(--lx-font-body); padding: 5px 8px; border-radius: 6px; border: 1px solid var(--lx-border); }
      .report { list-style: none; padding: 0; margin: 10px 0 0; }
      .report li { border-top: 1px solid var(--lx-border); padding: 10px 0; font-size: 15px; }
      .report .muted { display: block; }
      .score { display: flex; align-items: baseline; gap: 10px; margin: 14px 0 4px; }
      .score b { font: 700 34px var(--lx-font-heading); color: var(--lx-ink); }
    `,
  ];

  get level() { return this.config.level || 1; }
  get opts() {
    const d = LEVEL_DEFAULTS[this.level];
    return {
      attempts: this.config.attempts ?? d.attempts,
      severity: this.config.severity ?? d.severity,
      showCount: this.config.showCount ?? d.showCount,
    };
  }
  get lines() { return (this.config.code || "").replace(/\n$/, "").split("\n"); }
  maxScore() { return this.config.points ?? this.level; }
  initialState() { return { attemptsUsed: 0, best: 0, exhausted: false, marks: {}, submitted: null }; }
  result() {
    return { score: r2(this.state.best * this.maxScore()), complete: this.state.attemptsUsed > 0, exhausted: this.state.exhausted };
  }

  issueAt(line) {
    return this.config.issues.findIndex((it) => line >= it.line && line <= (it.to ?? it.line));
  }

  toggle(n) {
    if (this.state.submitted) return;
    const marks = { ...this.state.marks };
    if (marks[n]) delete marks[n];
    else marks[n] = this.opts.severity ? "" : "flag";
    this.setState({ marks });
  }

  setSeverity(n, sev) {
    this.setState({ marks: { ...this.state.marks, [n]: sev } });
  }

  grade() {
    const issues = this.config.issues;
    const marks = this.state.marks;
    const foundBy = new Map(); // issue index -> first marked line
    const falseLines = [];
    for (const key of Object.keys(marks)) {
      const line = Number(key), idx = this.issueAt(line);
      if (idx < 0) falseLines.push(line);
      else if (!foundBy.has(idx)) foundBy.set(idx, line);
    }
    let points = 0;
    const perIssue = issues.map((it, i) => {
      if (!foundBy.has(i)) return { found: false };
      const sev = marks[foundBy.get(i)];
      const sevOk = !this.opts.severity || sev === it.severity;
      points += sevOk ? 1 : WRONG_SEVERITY;
      return { found: true, sev, sevOk, line: foundBy.get(i) };
    });
    const fraction = r2(Math.max(0, Math.min(1, (points - falseLines.length * FALSE_ALARM) / issues.length)));
    return { fraction, perIssue, falseLines };
  }

  submit() {
    const g = this.grade();
    const attemptsUsed = this.state.attemptsUsed + 1;
    const lim = this.opts.attempts;
    this.setState({ submitted: g, attemptsUsed, best: Math.max(this.state.best, g.fraction), exhausted: lim > 0 && attemptsUsed >= lim });
  }

  retry() { this.setState({ marks: {}, submitted: null }); }

  lineClass(n, text) {
    const v = this.config.view;
    const cls = ["ln"];
    if (v === "diff" && text.startsWith("+")) cls.push("add");
    if (v === "diff" && text.startsWith("-")) cls.push("del");
    const sub = this.state.submitted;
    if (!sub) {
      if (this.state.marks[n] !== undefined) cls.push("flagged");
      return cls.join(" ");
    }
    const idx = this.issueAt(n);
    if (sub.falseLines.includes(n)) cls.push("false");
    else if (idx >= 0 && sub.perIssue[idx].found && sub.perIssue[idx].line === n) cls.push("found");
    else if (idx >= 0 && !sub.perIssue[idx].found && n === this.config.issues[idx].line) cls.push("missed");
    return cls.join(" ");
  }

  lineTag(n) {
    const sub = this.state.submitted;
    if (!sub) return this.state.marks[n] !== undefined ? html`<span class="tag flag">flagged</span>` : nothing;
    const idx = this.issueAt(n);
    if (sub.falseLines.includes(n)) return html`<span class="tag bad">false alarm</span>`;
    if (idx >= 0 && sub.perIssue[idx].found && sub.perIssue[idx].line === n)
      return html`<span class="tag ok">${sub.perIssue[idx].sevOk ? "found" : "found · wrong severity"}</span>`;
    if (idx >= 0 && !sub.perIssue[idx].found && n === this.config.issues[idx].line) return html`<span class="tag miss">missed</span>`;
    return nothing;
  }

  renderReport(sub) {
    const decoys = this.config.decoys || [];
    const { attempts } = this.opts;
    const canRetry = attempts === 0 || this.state.attemptsUsed < attempts;
    const found = sub.perIssue.filter((p) => p.found).length;
    return html`<div class="score" role="status"><b>${Math.round(sub.fraction * 100)}%</b>
        <span class="muted">${found} of ${this.config.issues.length} found · ${sub.falseLines.length} false alarm${sub.falseLines.length === 1 ? "" : "s"} · best ${Math.round(this.state.best * 100)}%</span></div>
      <ul class="report">
        ${this.config.issues.map((it, i) => {
          const p = sub.perIssue[i];
          return html`<li>
            <span class="rating ${p.found ? (p.sevOk ? "optimal" : "acceptable") : "critical"}">${p.found ? (p.sevOk ? "found" : "found") : "missed"}</span>
            <strong>Line ${it.line}${it.to ? `–${it.to}` : ""}: ${unsafeHTML(it.label)}</strong>
            <span class="rating ${it.severity === "critical" ? "critical" : it.severity === "major" ? "risky" : "acceptable"}">${it.severity}</span>
            ${p.found && !p.sevOk ? html`<span class="muted">You rated it “${p.sev || "—"}”.</span>` : nothing}
            <span class="muted">${unsafeHTML(it.explain)}</span>
          </li>`;
        })}
        ${sub.falseLines.map((l) => {
          const d = decoys.find((x) => x.line === l);
          return html`<li><span class="rating risky">false alarm</span> <strong>Line ${l}</strong>
            <span class="muted">${d ? unsafeHTML(d.explain) : "Nothing wrong here."}</span></li>`;
        })}
      </ul>
      <div class="actions">
        ${canRetry
          ? html`<button class="btn-primary" @click=${this.retry}>Try again${attempts ? ` (${attempts - this.state.attemptsUsed} left)` : ""}</button>`
          : html`<span class="muted">No attempts left — your best result counts.</span>`}
      </div>`;
  }

  renderWidget() {
    const { severity, showCount, attempts } = this.opts;
    const sub = this.state.submitted;
    const flagged = Object.keys(this.state.marks).map(Number).sort((a, b) => a - b);
    const missingSev = severity && flagged.some((n) => !this.state.marks[n]);
    return html`<section class="card" aria-label=${new DOMParser().parseFromString(this.config.title || "Spot the problems", "text/html").body.textContent}>
      <div class="head">
        <span class="lvl lvl-${this.level}">Level ${this.level}</span>
        <span class="eyebrow" style="margin:0">Spot the problems ${this.graded ? html`<span class="graded">· ${this.maxScore()} pt</span>` : nothing}</span>
      </div>
      <h3>${unsafeHTML(this.config.title || "")}</h3>
      <p>${unsafeHTML(this.config.prompt || "")}</p>
      <p class="muted">
        Click every line that is a problem${severity ? ", then rate how serious it is" : ""}.
        ${showCount ? unsafeHTML(this.config.issues.length === 1 ? "There is <b>1</b> problem." : `There are <b>${this.config.issues.length}</b> problems.`) : "The number of problems is not revealed."}
        False alarms cost points. ${attempts === 0 ? "Unlimited attempts." : `${attempts} attempt${attempts > 1 ? "s" : ""}.`}
      </p>
      ${this.config.filename ? html`<div class="file">${this.config.filename}</div>` : nothing}
      <div class="code ${this.config.filename ? "" : "nofile"}" role="list">
        ${this.lines.map((text, i) => {
          const n = i + 1;
          return html`<button class=${this.lineClass(n, text)} role="listitem" ?disabled=${!!sub}
            aria-pressed=${this.state.marks[n] !== undefined} aria-label="Line ${n}: ${text}" @click=${() => this.toggle(n)}>
            <span class="num">${n}</span><span class="txt">${text || " "}</span>${this.lineTag(n)}
          </button>`;
        })}
      </div>
      ${!sub && severity && flagged.length
        ? html`<div class="sev">${flagged.map(
            (n) => html`<div class="sev-row" style="width:100%">
              <code>line ${n}</code>
              <select aria-label="Severity for line ${n}" .value=${this.state.marks[n]} @change=${(e) => this.setSeverity(n, e.target.value)}>
                <option value="">severity…</option>
                ${SEVERITIES.map((s) => html`<option value=${s} ?selected=${this.state.marks[n] === s}>${s}</option>`)}
              </select>
            </div>`,
          )}</div>`
        : nothing}
      ${sub
        ? this.renderReport(sub)
        : html`<div class="actions">
            <button class="btn-primary" ?disabled=${!flagged.length || missingSev} @click=${this.submit}>Submit review</button>
            ${missingSev ? html`<span class="muted">Rate the severity of every flagged line.</span>` : nothing}
          </div>`}
    </section>`;
  }
}

customElements.define("lx-spot", LxSpot);

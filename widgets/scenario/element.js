import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LxElement, baseStyles } from "../../shell/base-element.js";

const POINTS = { optimal: 1, acceptable: 0.5, risky: 0, critical: 0 };
const DOWNGRADE = { optimal: "acceptable", acceptable: "risky", risky: "risky", critical: "critical" };
// attempts: 0 = unlimited graded attempts (default). Authors may set a limit; after it,
// learners can still "practise again" without changing their grade.
const LEVEL_DEFAULTS = {
  1: { attempts: 0, feedback: "step", autoplay: false },
  2: { attempts: 0, feedback: "end", autoplay: false },
  3: { attempts: 0, feedback: "end", autoplay: true },
};
const TRIES_TO_UNLOCK_NEXT = 2; // the next level also opens after this many tries, so nobody gets stuck
const STREAM_RATING = { onTime: "optimal", late: "acceptable", early: "risky" };
const STREAM_TEXT = {
  onTime: "You stopped the agent right when it went wrong.",
  late: "You stopped it, but only after it had already continued for a while.",
  early: "You stopped the agent before anything was wrong. It lost its context for no reason.",
  missed: "You let the agent run to the end without stopping it.",
};
const CRITICAL_CAP = 0.3;
const r2 = (x) => Math.round(x * 100) / 100;
// HTML → plain text (also decodes entities like &#39;)
const strip = (h = "") => new DOMParser().parseFromString(String(h), "text/html").body.textContent || "";

class LxScenario extends LxElement {
  static graded = true;

  static styles = [
    baseStyles,
    css`
      .head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
      .rules { margin: 10px 0 0; padding-left: 20px; font-size: 15px; }
      .rules li { margin: 3px 0; }
      .situation { background: var(--lx-surface-2); border-radius: var(--lx-radius); padding: 14px 16px; margin: 12px 0; }
      .situation p:last-child { margin-bottom: 0; }
      .extra { border-left: 3px solid var(--lx-warn); padding-left: 12px; margin-top: 10px; color: var(--lx-warning-ink); }
      .stepno { font: 600 12px var(--lx-font-mono); color: var(--lx-text-muted); }
      .choices { display: grid; gap: 8px; margin-top: 12px; }
      .choice {
        text-align: left; font: 600 15px/1.45 var(--lx-font-body); background: var(--lx-surface); color: var(--lx-heading);
        border: 1px solid var(--lx-border); border-radius: var(--lx-radius); padding: 12px 14px;
      }
      .choice:hover:not(:disabled) { border-color: var(--lx-accent); background: var(--lx-hover); }
      .evidence { border: 1px dashed var(--lx-border-strong); border-radius: var(--lx-radius); padding: 12px 14px; margin: 12px 0; }
      .evidence-head { display: flex; align-items: center; gap: 10px; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; }
      .evidence-head strong { font-size: 14px; color: var(--lx-accent-ink); }
      .budget { display: flex; gap: 4px; align-items: center; font-size: 13px; color: var(--lx-text-muted); }
      .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--lx-accent); }
      .dot.used { background: var(--lx-border-strong); }
      .actions-ev { display: flex; flex-wrap: wrap; gap: 6px; }
      .ev-btn { font: 600 13px var(--lx-font-mono); padding: 6px 10px; border-radius: 6px; background: var(--lx-surface); color: var(--lx-heading); border: 1px solid var(--lx-border); }
      .ev-btn:hover:not(:disabled) { border-color: var(--lx-accent); }
      pre { background: var(--lx-code-bg); color: var(--lx-code-text); border-radius: 8px; padding: 10px 12px; font: 13px/1.55 var(--lx-font-mono); white-space: pre-wrap; margin: 8px 0 0; }
      .ev-label { font: 600 12px var(--lx-font-mono); color: var(--lx-text-muted); margin-top: 10px; }
      .stream { background: var(--lx-code-bg); border-radius: var(--lx-radius); padding: 12px 14px; margin: 12px 0; font: 13.5px/1.6 var(--lx-font-mono); color: var(--lx-code-text); min-height: 120px; }
      .stream .ln { padding: 2px 0; animation: fadein .3s; }
      .stream .ln::before { content: "› "; color: var(--lx-sky); }
      .stream .ln.redmark { color: #ffb4c2; }
      .stream code { background: rgba(255,255,255,.1); color: var(--lx-sky); }
      @keyframes fadein { from { opacity: 0; transform: translateY(3px); } }
      .stop { background: var(--lx-danger); color: #fff; }
      .stop:hover { background: var(--lx-danger-ink); }
      .pending { border-radius: var(--lx-radius); padding: 14px 16px; margin-top: 12px; border: 1px solid var(--lx-border); }
      .pending.optimal { background: var(--lx-success-soft); border-color: transparent; }
      .pending.acceptable { background: var(--lx-accent-soft); border-color: transparent; }
      .pending.risky { background: var(--lx-warning-soft); border-color: transparent; }
      .pending.critical { background: var(--lx-error-soft); border-color: transparent; }
      .pending.neutral { background: var(--lx-surface-2); }
      .pending p:last-child { margin-bottom: 0; }
      .score { display: flex; align-items: baseline; gap: 10px; margin: 6px 0 14px; }
      .score b { font: 700 40px var(--lx-font-heading); color: var(--lx-heading); }
      .dims { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 16px; }
      .dim { background: var(--lx-surface-2); border-radius: var(--lx-radius); padding: 10px 12px; font-size: 13px; }
      .dim strong { display: block; font-size: 18px; color: var(--lx-heading); }
      .cap { background: var(--lx-error-soft); color: var(--lx-error-ink); border-radius: var(--lx-radius); padding: 10px 14px; margin-bottom: 14px; font-size: 14px; }
      .path { list-style: none; padding: 0; margin: 0; counter-reset: p; }
      .path > li { counter-increment: p; border-top: 1px solid var(--lx-border); padding: 12px 0 12px 34px; position: relative; }
      .path > li::before { content: counter(p); position: absolute; left: 0; top: 13px; width: 24px; height: 24px; border-radius: 50%; background: var(--lx-accent-soft); color: var(--lx-accent-ink); font: 600 12px var(--lx-font-mono); display: grid; place-items: center; }
      .path .title { font-weight: 700; }
      .path .row { margin-top: 4px; font-size: 15px; }
      .path .expert { margin-top: 6px; font-size: 14px; color: var(--lx-success-ink); }
      .path .why { font-size: 14px; color: var(--lx-text-muted); margin-top: 2px; }
      .evlist { list-style: none; padding: 0; margin: 6px 0 0; font-size: 14px; }
      h4 { margin: 18px 0 6px; font: 800 13px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; color: var(--lx-accent-ink); }
    `,
  ];

  get level() { return this.config.level || 1; }
  get opts() {
    const d = LEVEL_DEFAULTS[this.level];
    return { attempts: this.config.attempts ?? d.attempts, feedback: this.config.feedback ?? d.feedback };
  }
  get steps() { return this.config.steps || {}; }
  maxScore() { return this.config.points ?? this.level; }
  initialState() { return { attemptsUsed: 0, best: 0, exhausted: false, run: null, last: null }; }

  result() {
    const s = this.state;
    return { score: r2(s.best * this.maxScore()), complete: s.attemptsUsed > 0 || !!s.carried, exhausted: s.exhausted };
  }

  // ---- variants -----------------------------------------------------------------
  computeVars(attempt) {
    const out = {};
    const uid = (window.LX && window.LX.uid) || "anon";
    for (const [k, list] of Object.entries(this.config.vars || {})) {
      out[k] = list[LxElement.seededOrder(list.length, `${this.id}:${uid}:${attempt}:${k}`)[0]];
    }
    return out;
  }
  t(str) {
    if (typeof str !== "string") return str;
    return str.replace(/\{\{(\w+)\}\}/g, (m, k) => (this._vars && this._vars[k]) ?? m);
  }
  rich(str) { return unsafeHTML(this.t(str || "")); }

  choiceOrder(stepId, attempt) {
    const n = this.steps[stepId].choices.length;
    const uid = (window.LX && window.LX.uid) || "anon";
    return LxElement.seededOrder(n, `${this.id}:${uid}:${attempt}:${stepId}`);
  }

  // ---- run lifecycle ---------------------------------------------------------------
  get limitReached() {
    const lim = this.opts.attempts;
    return lim > 0 && this.state.attemptsUsed >= lim;
  }

  start() {
    this.setState({
      run: { practice: this.limitReached, attempt: this.state.attemptsUsed + (this.state.practiceRuns || 0), step: this.config.start, path: [], evidence: [], flags: [], visited: [this.config.start], pending: null, shown: 1, stopped: null },
    });
  }

  patchRun(p) { this.setState({ run: { ...this.state.run, ...p } }); }

  budgetUsed(run = this.state.run) {
    const all = this.allEvidence();
    return run.evidence.reduce((s, id) => s + (all[id]?.cost ?? 1), 0);
  }
  allEvidence() {
    const map = {};
    for (const s of Object.values(this.steps)) for (const e of s.evidence || []) map[e.id] = { cost: 1, ...e };
    return map;
  }

  gather(e) {
    const run = this.state.run;
    if (run.evidence.includes(e.id) || run.pending) return;
    if (this.config.budget - this.budgetUsed() < (e.cost ?? 1)) return;
    this.patchRun({ evidence: [...run.evidence, e.id] });
  }

  choose(ci) {
    const run = this.state.run;
    const c = this.steps[run.step].choices[ci];
    let rating = c.rating, downgraded = false;
    if ((c.needs || []).some((id) => !run.evidence.includes(id))) {
      rating = DOWNGRADE[rating];
      downgraded = rating !== c.rating;
    }
    const entry = { step: run.step, choice: ci, rating, downgraded };
    const flags = [...new Set([...run.flags, ...(c.sets || [])])];
    const pending = { rating, downgraded, explain: c.explain, consequence: c.consequence, go: c.end ? null : c.next };
    const showPanel = this.opts.feedback === "step" || c.consequence;
    this.patchRun({ path: [...run.path, entry], flags, pending });
    if (!showPanel) this.advance();
  }

  // stream mechanics: shown = number of visible lines; stopped = index of the last visible line when stopped
  nextLine() {
    const run = this.state.run, lines = this.steps[run.step].stream.lines;
    if (run.pending) return;
    if (run.shown >= lines.length) this.evaluateStream(null);
    else this.patchRun({ shown: run.shown + 1 });
  }
  stopAgent() {
    const run = this.state.run;
    if (run.pending) return;
    this.evaluateStream(run.shown - 1);
  }
  evaluateStream(stoppedAt) {
    const run = this.state.run, st = this.steps[run.step].stream;
    const red = st.lines.findIndex((l) => l.red);
    let key;
    if (stoppedAt === null) key = "missed";
    else if (stoppedAt < red) key = "early";
    else if (stoppedAt <= red + 1) key = "onTime";
    else if (stoppedAt <= red + 3) key = "late";
    else key = "missed";
    const rating = key === "missed" ? st.missRating || "critical" : STREAM_RATING[key];
    const text = (st.outcomes && st.outcomes[key]) || STREAM_TEXT[key];
    this.patchRun({
      stopped: stoppedAt,
      path: [...run.path, { step: run.step, stream: key, at: stoppedAt, rating }],
      pending: { rating, consequence: text, go: st.end ? null : st.next, stream: true },
    });
  }

  advance() {
    const run = this.state.run;
    const go = run.pending?.go;
    if (!go) return this.finish();
    const target = typeof go === "string" ? go : run.flags.includes(go.if) ? go.then : go.else;
    this.patchRun({ step: target, pending: null, shown: 1, stopped: null, visited: [...run.visited, target] });
  }

  finish() {
    const run = this.state.run;
    const all = this.allEvidence();
    const pts = run.path.map((p) => POINTS[p.rating]);
    const decisions = pts.length ? pts.reduce((a, b) => a + b, 0) / pts.length : 0;
    const available = run.visited.flatMap((id) => (this.steps[id].evidence || []).map((e) => e.id));
    const keys = available.filter((id) => all[id].key);
    const process = keys.length ? keys.filter((id) => run.evidence.includes(id)).length / keys.length : 1;
    const wasted = run.evidence.filter((id) => !all[id].key).reduce((s, id) => s + (all[id].cost ?? 1), 0);
    const efficiency = this.config.budget ? Math.max(0, 1 - wasted / this.config.budget) : 1;
    const investigative = available.length > 0;
    let final = investigative ? 0.6 * decisions + 0.25 * process + 0.15 * efficiency : decisions;
    const critical = run.path.some((p) => p.rating === "critical");
    if (critical) final = Math.min(final, CRITICAL_CAP);
    final = r2(final);
    const last = { ...run, final, dims: { decisions: r2(decisions), process: r2(process), efficiency: r2(efficiency), investigative, critical } };
    if (run.practice) {
      // practice run after the author's attempt limit: shown, but never changes the grade
      this.setState({ run: null, last, practiceRuns: (this.state.practiceRuns || 0) + 1 });
    } else {
      const attemptsUsed = this.state.attemptsUsed + 1;
      const lim = this.opts.attempts;
      this.setState({
        attemptsUsed,
        best: Math.max(this.state.best, final),
        exhausted: (lim > 0 && attemptsUsed >= lim) || attemptsUsed >= TRIES_TO_UNLOCK_NEXT,
        run: null,
        last,
      });
    }
    this.updateComplete.then(() => this.renderRoot.querySelector(".score")?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }

  // autoplay for stream steps
  updated() {
    clearTimeout(this._timer);
    const run = this.state?.run;
    if (!run || run.pending) return;
    const s = this.steps[run.step];
    if (!s?.stream) return;
    const auto = s.stream.autoplay ?? LEVEL_DEFAULTS[this.level].autoplay;
    if (auto) this._timer = setTimeout(() => this.nextLine(), s.stream.speed || 1800);
  }
  disconnectedCallback() { super.disconnectedCallback(); clearTimeout(this._timer); }

  // ---- views ------------------------------------------------------------------------
  renderHead() {
    return html`<div class="head">
      <span class="lvl lvl-${this.level}">Level ${this.level}</span>
      <span class="eyebrow" style="margin:0">Decision scenario ${this.graded ? html`<span class="graded">· ${this.maxScore()} pt</span>` : nothing}</span>
    </div>
    <h3>${unsafeHTML(this.config.title || "")}</h3>`;
  }

  renderIntro() {
    const { attempts, feedback } = this.opts;
    const used = this.state.attemptsUsed;
    return html`${this.config.intro ? html`<p>${this.rich(this.config.intro)}</p>` : nothing}
      <ul class="rules">
        <li>${feedback === "step" ? "You get feedback after every decision." : "Feedback only at the end — like in real life."}</li>
        <li>${attempts === 0 ? "Retake it as often as you like; your best result counts, and each try gets a new variant." : `${attempts} graded attempt${attempts > 1 ? "s" : ""}${used ? ` (${used} used)` : ""}; after that you can still practise without changing your grade.`}</li>
        ${this.config.budget ? html`<li>You can investigate before deciding — but only <strong>${this.config.budget}</strong> actions in total. Choose what is worth checking.</li>` : nothing}
        <li>Critical mistakes cap the result at ${CRITICAL_CAP * 100}%.</li>
      </ul>
      <div class="actions"><button class="btn-primary" @click=${this.start}>Start scenario</button></div>`;
  }

  renderEvidence(step, run) {
    if (!step.evidence?.length) return nothing;
    const left = this.config.budget - this.budgetUsed(run);
    const all = this.allEvidence();
    const gathered = run.evidence.filter((id) => step.evidence.some((e) => e.id === id) || all[id]);
    return html`<div class="evidence">
      <div class="evidence-head">
        <strong>Investigate first?</strong>
        <span class="budget" aria-label="${left} actions left">
          ${Array.from({ length: this.config.budget }, (_, i) => html`<span class="dot ${i < this.config.budget - left ? "used" : ""}"></span>`)}
          <span>${left} left</span>
        </span>
      </div>
      <div class="actions-ev">
        ${step.evidence.map(
          (e) => html`<button class="ev-btn" ?disabled=${run.evidence.includes(e.id) || left < (e.cost ?? 1) || !!run.pending}
            @click=${() => this.gather(e)}>${run.evidence.includes(e.id) ? "✓ " : "▸ "}${this.rich(e.label)}${(e.cost ?? 1) > 1 ? ` (${e.cost})` : ""}</button>`,
        )}
      </div>
      ${gathered
        .filter((id) => step.evidence.some((e) => e.id === id))
        .map((id) => {
          const e = step.evidence.find((x) => x.id === id);
          return html`<div class="ev-label">$ ${strip(this.t(e.label))}</div><pre>${this.t(e.output)}</pre>`;
        })}
    </div>`;
  }

  renderPending(p) {
    const showRating = this.opts.feedback === "step";
    const cls = showRating ? p.rating : "neutral";
    return html`<div class="pending ${cls}" role="status">
        ${showRating ? html`<p><span class="rating ${p.rating}">${p.rating}</span>${p.downgraded ? html` <span class="muted">— right idea, but you acted without checking the evidence first</span>` : nothing}</p>` : nothing}
        ${p.consequence ? html`<p>${this.rich(p.consequence)}</p>` : nothing}
        ${showRating && p.explain ? html`<p class="muted">${this.rich(p.explain)}</p>` : nothing}
      </div>
      <div class="actions"><button class="btn-primary" @click=${this.advance}>${p.go ? "Continue →" : "See results"}</button></div>`;
  }

  renderStep() {
    const run = this.state.run;
    const step = this.steps[run.step];
    const extras = Object.entries(step.extra || {}).filter(([flag]) => run.flags.includes(flag));
    return html`<div class="stepno">Step ${run.path.length + 1}${step.title ? ` · ${strip(this.t(step.title))}` : ""}</div>
      <div class="situation">
        <p>${this.rich(step.situation)}</p>
        ${extras.map(([, text]) => html`<div class="extra">${this.rich(text)}</div>`)}
      </div>
      ${step.ending
        ? html`<div class="actions"><button class="btn-primary" @click=${this.finish}>See results</button></div>`
        : step.stream
          ? this.renderStream(step, run)
          : html`${this.renderEvidence(step, run)}
              ${run.pending
                ? this.renderPending(run.pending)
                : html`<div class="choices" role="group" aria-label="Your decision">
                    ${this.choiceOrder(run.step, run.attempt).map(
                      (ci) => html`<button class="choice" @click=${() => this.choose(ci)}>${this.rich(step.choices[ci].text)}</button>`,
                    )}
                  </div>`}`}`;
  }

  renderStream(step, run) {
    const st = step.stream;
    const lines = st.lines.slice(0, run.stopped !== null ? run.stopped + 1 : run.shown);
    const auto = st.autoplay ?? LEVEL_DEFAULTS[this.level].autoplay;
    return html`<p class="muted">Watch the agent work. Stop it the moment something goes wrong — not earlier, not later.</p>
      <div class="stream" aria-live="polite">
        ${lines.map((l, i) => html`<div class="ln ${run.pending && l.red && i <= (run.stopped ?? 99) ? "redmark" : ""}">${this.rich(l.text)}</div>`)}
      </div>
      ${run.pending
        ? this.renderPending(run.pending)
        : html`<div class="actions">
            <button class="stop" @click=${this.stopAgent}>✋ Stop the agent</button>
            ${auto ? html`<span class="muted">The agent keeps going…</span>` : html`<button class="btn-ghost" @click=${this.nextLine}>${run.shown >= st.lines.length ? "Let it finish" : "Next step ▸"}</button>`}
          </div>`}`;
  }

  renderDebrief() {
    const last = this.state.last;
    const d = last.dims;
    const all = this.allEvidence();
    const { attempts } = this.opts;
    const pct = (x) => `${Math.round(x * 100)}%`;
    const available = last.visited.flatMap((id) => (this.steps[id].evidence || []).map((e) => e.id));
    return html`${last.practice ? html`<div class="notice">Practice run: this result doesn't change your grade.</div>` : nothing}
      <div class="score" role="status"><b>${pct(last.final)}</b>
        <span class="muted">${last.practice ? "practice run" : "this attempt"} · best ${pct(this.state.best)}${this.graded ? ` · ${r2(this.state.best * this.maxScore())} / ${this.maxScore()} pt` : ""}</span></div>
      ${d.critical ? html`<div class="cap">A critical decision capped this attempt at ${CRITICAL_CAP * 100}%.</div>` : nothing}
      <div class="dims">
        <div class="dim"><strong>${pct(d.decisions)}</strong>Decision quality</div>
        ${d.investigative
          ? html`<div class="dim"><strong>${pct(d.process)}</strong>Key evidence checked</div>
              <div class="dim"><strong>${pct(d.efficiency)}</strong>Efficiency (no wasted actions)</div>`
          : nothing}
      </div>
      <h4>Your path vs. the expert</h4>
      <ol class="path">
        ${last.path.map((p) => {
          const step = this.steps[p.step];
          if (p.stream) {
            const red = step.stream.lines.findIndex((l) => l.red);
            return html`<li>
              <div class="title">${step.title ? this.rich(step.title) : "Watching the agent"}</div>
              <div class="row"><span class="rating ${p.rating}">${p.rating}</span>
                ${p.at === null || p.stream === "missed" ? " You did not stop the agent in time." : ` You stopped at line ${p.at + 1}.`}</div>
              <div class="expert">Expert: stop at line ${red + 1} — “${strip(this.t(step.stream.lines[red].text))}”</div>
            </li>`;
          }
          const c = step.choices[p.choice];
          const best = step.choices.find((x) => x.rating === "optimal");
          return html`<li>
            <div class="title">${step.title ? this.rich(step.title) : strip(this.t(step.situation)).slice(0, 90) + "…"}</div>
            <div class="row"><span class="rating ${p.rating}">${p.rating}</span> ${this.rich(c.text)}
              ${p.downgraded ? html`<span class="muted"> (downgraded: you didn't check ${c.needs.map((n) => strip(this.t(all[n].label))).join(", ")} first)</span>` : nothing}</div>
            ${c.explain ? html`<div class="why">${this.rich(c.explain)}</div>` : nothing}
            ${best && best !== c ? html`<div class="expert">Expert: ${this.rich(best.text)}${best.explain ? html` — ${this.rich(best.explain)}` : nothing}</div>` : nothing}
          </li>`;
        })}
      </ol>
      ${available.length
        ? html`<h4>Investigation</h4>
          <ul class="evlist">
            ${available.map((id) => {
              const e = all[id], got = last.evidence.includes(id);
              const mark = e.key ? (got ? "✓ key evidence checked" : "✗ key evidence missed") : got ? "· checked (not essential)" : "· skipped (fine)";
              return html`<li><code>${strip(this.t(e.label))}</code> — ${mark}</li>`;
            })}
          </ul>`
        : nothing}
      <div class="actions">
        ${this.limitReached
          ? html`<button class="btn-ghost" @click=${this.start}>Practise again (doesn't change your grade)</button>`
          : html`<button class="btn-primary" @click=${this.start}>Try again${attempts ? ` (${attempts - this.state.attemptsUsed} graded left)` : ""}</button>`}
      </div>`;
  }

  renderWidget() {
    const s = this.state;
    const attempt = s.run ? s.run.attempt : s.last ? s.last.attempt : s.attemptsUsed;
    this._vars = this.computeVars(attempt);
    return html`<section class="card" aria-label=${strip(this.config.title || "Scenario")}>
      ${this.renderHead()}
      ${this.renderNotice()}
      ${s.run ? this.renderStep() : s.last ? this.renderDebrief() : this.renderIntro()}
    </section>`;
  }
}

customElements.define("lx-scenario", LxScenario);

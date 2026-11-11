import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LxElement, baseStyles } from "../../shell/base-element.js";

class LxQuiz extends LxElement {
  static graded = true;

  static styles = [
    baseStyles,
    css`
      .q { padding: 16px 0; border-top: 1px solid var(--lx-border); }
      .q:first-of-type { border-top: 0; padding-top: 4px; }
      .q-text { font-weight: 700; margin-bottom: 4px; }
      .q-num { color: var(--lx-red); font-family: var(--lx-font-mono); margin-right: 6px; }
      .hint { font-size: 13px; color: var(--lx-text-muted); margin-bottom: 8px; }
      fieldset { border: 0; padding: 0; margin: 0; }
      label.opt {
        display: flex; gap: 10px; align-items: flex-start; padding: 9px 12px; margin: 6px 0;
        border: 1px solid var(--lx-border); border-radius: var(--lx-radius); cursor: pointer; transition: border-color .15s, background .15s;
      }
      label.opt:hover { border-color: var(--lx-accent); }
      label.opt.selected { border-color: var(--lx-accent); background: var(--lx-accent-soft); }
      label.opt.correct { border-color: var(--lx-success); background: var(--lx-success-soft); }
      label.opt.wrong { border-color: var(--lx-error); background: var(--lx-error-soft); }
      label.opt.locked { cursor: default; }
      input { margin-top: 5px; accent-color: var(--lx-accent-ink); }
      .mark { margin-left: auto; font-weight: 800; }
      .correct .mark { color: var(--lx-success); }
      .wrong .mark { color: var(--lx-error); }
      .summary { display: flex; align-items: center; gap: 14px; margin-top: 8px; padding-top: 14px; border-top: 1px solid var(--lx-border); }
      .summary .progress { flex: 1; }
      /* paged mode (inside slides): one question at a time */
      .dots { display: flex; gap: 6px; flex-wrap: wrap; margin: 2px 0 6px; }
      .dot { width: 32px; height: 32px; padding: 0; border-radius: 10px; font: 800 13px var(--lx-font-body); background: var(--lx-surface-3); color: var(--lx-text-muted); border: 1px solid transparent; }
      .dot.current { border-color: var(--lx-accent); color: var(--lx-heading); background: var(--lx-surface); }
      .dot.right { background: var(--lx-success-soft); color: var(--lx-success-ink); }
      .dot.wrong { background: var(--lx-error-soft); color: var(--lx-error-ink); }
      .paged .q { border-top: 0; padding-top: 10px; }
      .result { text-align: center; padding: 10px 0 4px; }
      .result b { display: block; font: 800 44px var(--lx-font-heading); color: var(--lx-heading); letter-spacing: -.02em; }
      .review { list-style: none; padding: 0; margin: 14px 0 0; text-align: left; }
      .review li { display: flex; gap: 10px; align-items: baseline; padding: 8px 0; border-top: 1px solid var(--lx-border); }
      .review button { background: none; border: 0; padding: 0; font: 600 15px var(--lx-font-body); color: var(--lx-link); text-align: left; cursor: pointer; }
    `,
  ];

  get questions() { return this.config.questions || []; }

  initialState() { return { picks: {}, checked: {}, cur: 0, view: "question" }; }

  /** Inside a slides page the quiz shows one question at a time (authors can force with `paged`). */
  get paged() { return this.config.paged ?? !!this.closest("[data-slides]"); }
  maxScore() { return this.questions.length; }

  isRight(qi) {
    const q = this.questions[qi];
    const want = [].concat(q.answer).sort().join(",");
    const got = [...(this.state.picks[qi] || [])].sort().join(",");
    return want === got;
  }

  result() {
    const checked = Object.keys(this.state.checked).filter((k) => this.state.checked[k]);
    const score = checked.filter((qi) => this.isRight(qi)).length;
    return { score, complete: checked.length === this.questions.length };
  }

  optionOrder(qi) {
    const n = this.questions[qi].options.length;
    return this.config.shuffle ? LxElement.seededOrder(n, `${this.id}-${qi}`) : [...Array(n).keys()];
  }

  pick(qi, oi, multi) {
    if (this.state.checked[qi]) return;
    const cur = new Set(this.state.picks[qi] || []);
    if (multi) cur.has(oi) ? cur.delete(oi) : cur.add(oi);
    else { cur.clear(); cur.add(oi); }
    this.setState({ picks: { ...this.state.picks, [qi]: [...cur] } });
  }

  check(qi) { this.setState({ checked: { ...this.state.checked, [qi]: true } }); }

  renderQuestion(q, qi) {
    const multi = Array.isArray(q.answer);
    const answers = [].concat(q.answer);
    const picks = this.state.picks[qi] || [];
    const checked = !!this.state.checked[qi];
    const right = checked && this.isRight(qi);
    const name = `${this.id}-q${qi}`;
    return html`<div class="q">
      <div class="q-text" id="${name}-label"><span class="q-num">${qi + 1}.</span>${unsafeHTML(q.q)}</div>
      ${multi ? html`<div class="hint">Select all that apply.</div>` : nothing}
      <fieldset aria-labelledby="${name}-label">
        ${this.optionOrder(qi).map((oi) => {
          const selected = picks.includes(oi);
          const isAnswer = answers.includes(oi);
          const cls = [
            "opt",
            selected ? "selected" : "",
            checked && isAnswer ? "correct" : "",
            checked && selected && !isAnswer ? "wrong" : "",
            checked ? "locked" : "",
          ].join(" ");
          return html`<label class=${cls}>
            <input type=${multi ? "checkbox" : "radio"} name=${name} .checked=${selected} ?disabled=${checked}
              @change=${() => this.pick(qi, oi, multi)} />
            <span>${unsafeHTML(q.options[oi])}</span>
            ${checked && isAnswer ? html`<span class="mark" aria-label="correct answer">✓</span>` : nothing}
            ${checked && selected && !isAnswer ? html`<span class="mark" aria-label="incorrect">✗</span>` : nothing}
          </label>`;
        })}
      </fieldset>
      ${checked
        ? html`<div class="feedback ${right ? "ok" : "bad"}" role="status">
              <strong>${right ? "Correct." : "Not quite."}</strong> ${q.explain ? unsafeHTML(q.explain) : nothing}
            </div>
            ${this.paged ? this.renderPagedNext(qi) : nothing}`
        : html`<div class="actions">
            <button class="btn-primary" ?disabled=${!picks.length} @click=${() => this.check(qi)}>Check answer</button>
          </div>`}
    </div>`;
  }

  renderPagedNext(qi) {
    const total = this.questions.length;
    const nextOpen = [...Array(total).keys()].find((k) => k > qi && !this.state.checked[k]) ?? [...Array(total).keys()].find((k) => !this.state.checked[k]);
    return html`<div class="actions">
      ${nextOpen !== undefined
        ? html`<button class="btn-primary" @click=${() => this.setState({ cur: nextOpen })}>Next question →</button>`
        : html`<button class="btn-primary" @click=${() => this.setState({ view: "result" })}>See your result</button>`}
    </div>`;
  }

  renderPaged() {
    const { score, complete } = this.result();
    const total = this.questions.length;
    const cur = Math.min(this.state.cur || 0, total - 1);
    if (complete && this.state.view === "result") {
      return html`<div class="result" role="status">
          <b>${score} / ${total}</b><span class="muted">correct answers</span>
        </div>
        <ul class="review">
          ${this.questions.map((q, qi) => html`<li>
            <span class="rating ${this.isRight(qi) ? "optimal" : "critical"}">${this.isRight(qi) ? "✓" : "✗"}</span>
            <button @click=${() => this.setState({ cur: qi, view: "question" })}>${unsafeHTML(q.q)}</button>
          </li>`)}
        </ul>
        <div class="actions" style="justify-content:center">
          <button class="btn-ghost" @click=${() => this.resetState()}>Try again</button>
        </div>`;
    }
    return html`<div class="dots" role="tablist" aria-label="Questions">
        ${this.questions.map((_, qi) => {
          const st = this.state.checked[qi] ? (this.isRight(qi) ? "right" : "wrong") : "";
          return html`<button class="dot ${st} ${qi === cur ? "current" : ""}" role="tab" aria-selected=${qi === cur}
            aria-label="Question ${qi + 1}${st ? (st === "right" ? ", correct" : ", incorrect") : ""}" @click=${() => this.setState({ cur: qi, view: "question" })}>${qi + 1}</button>`;
        })}
      </div>
      <div class="paged">${this.renderQuestion(this.questions[cur], cur)}</div>
      ${complete ? html`<div class="actions"><button class="btn-ghost" @click=${() => this.setState({ view: "result" })}>Back to result</button></div>` : nothing}`;
  }

  renderWidget() {
    if (this.paged) {
      return html`<section class="card" aria-label=${this.config.title || "Quiz"}>
        <div class="eyebrow">Check yourself ${this.graded ? html`<span class="graded">· graded</span>` : nothing}</div>
        ${this.config.title ? html`<h3>${unsafeHTML(this.config.title)}</h3>` : nothing}
        ${this.renderPaged()}
      </section>`;
    }
    const { score, complete } = this.result();
    const total = this.questions.length;
    const done = Object.values(this.state.checked).filter(Boolean).length;
    return html`<section class="card" aria-label=${this.config.title || "Quiz"}>
      <div class="eyebrow">Check yourself ${this.graded ? html`<span class="graded">· graded</span>` : nothing}</div>
      ${this.config.title ? html`<h3>${unsafeHTML(this.config.title)}</h3>` : nothing}
      ${this.questions.map((q, qi) => this.renderQuestion(q, qi))}
      <div class="summary">
        <div class="progress" aria-hidden="true"><span style="width:${(done / total) * 100}%"></span></div>
        <span class="muted" role="status">${complete ? `${score} of ${total} correct` : `${done} of ${total} answered`}</span>
        ${complete ? html`<button class="btn-ghost" @click=${() => this.resetState()}>Try again</button>` : nothing}
      </div>
    </section>`;
  }
}

customElements.define("lx-quiz", LxQuiz);

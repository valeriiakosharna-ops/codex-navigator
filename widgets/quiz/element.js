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
    `,
  ];

  get questions() { return this.config.questions || []; }

  initialState() { return { picks: {}, checked: {} }; }
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
          </div>`
        : html`<div class="actions">
            <button class="btn-primary" ?disabled=${!picks.length} @click=${() => this.check(qi)}>Check answer</button>
          </div>`}
    </div>`;
  }

  renderWidget() {
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

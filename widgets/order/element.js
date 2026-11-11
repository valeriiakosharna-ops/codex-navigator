import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LxElement, baseStyles } from "../../shell/base-element.js";

/** Put steps in the right order. Keyboard: move buttons; mouse/touch: drag. */
class LxOrder extends LxElement {
  static graded = true;

  static styles = [
    baseStyles,
    css`
      ol { list-style: none; margin: 0; padding: 0; counter-reset: step; }
      li {
        counter-increment: step; display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin: 8px 0;
        background: var(--lx-surface-2); border: 1px solid var(--lx-border); border-radius: var(--lx-radius);
        cursor: grab; touch-action: none; user-select: none; transition: border-color .15s, background .15s, transform .15s;
      }
      li::before { content: counter(step); font: 600 13px var(--lx-font-mono); color: var(--lx-accent-ink); background: var(--lx-accent-soft); border-radius: 8px; width: 24px; height: 24px; display: grid; place-items: center; flex: none; }
      li.dragging { opacity: .6; transform: scale(.99); border-style: dashed; }
      li.over { border-color: var(--lx-accent); }
      li.correct { border-color: var(--lx-success); background: var(--lx-success-soft); }
      li.correct::before { background: var(--lx-success); }
      li.wrong { border-color: var(--lx-error); background: var(--lx-error-soft); }
      li.wrong::before { background: var(--lx-error); }
      li.locked { cursor: default; }
      .text { flex: 1; }
      .move { display: flex; gap: 4px; }
      .move button { padding: 3px 10px; font-size: 14px; background: var(--lx-surface); border-color: var(--lx-border); color: var(--lx-heading); border-radius: 8px; }
      .move button:hover:not(:disabled) { border-color: var(--lx-accent); }
      .grip { color: var(--lx-text-muted); font-size: 18px; line-height: 1; }
    `,
  ];

  get items() { return this.config.items || []; }
  maxScore() { return 1; }

  initialState() {
    const n = this.items.length;
    let order = LxElement.seededOrder(n, this.id || "order");
    if (order.every((v, i) => v === i) && n > 1) order = [...order.slice(1), order[0]];
    return { order, checked: false, best: 0, attempts: 0 };
  }

  fraction() {
    const ok = this.state.order.filter((v, i) => v === i).length;
    return Math.round((ok / this.items.length) * 100) / 100;
  }

  result() {
    return { score: this.state.best, complete: this.state.attempts > 0 };
  }

  move(from, to) {
    if (this.state.checked || to < 0 || to >= this.items.length || from === to) return;
    const order = [...this.state.order];
    const [x] = order.splice(from, 1);
    order.splice(to, 0, x);
    this.setState({ order });
    this.updateComplete.then(() => {
      const btn = this.renderRoot.querySelectorAll("li")[to]?.querySelector(`button[data-dir="${to > from ? "down" : "up"}"]`);
      (btn && !btn.disabled ? btn : this.renderRoot.querySelectorAll("li")[to])?.focus();
    });
  }

  check() {
    const f = this.fraction();
    this.setState({ checked: true, attempts: this.state.attempts + 1, best: Math.max(this.state.best, f) });
  }

  // --- pointer drag (works for mouse and touch) ---
  onPointerDown(e, index) {
    if (this.state.checked || e.target.closest("button")) return;
    const list = this.renderRoot.querySelector("ol");
    const items = [...list.children];
    this._drag = { from: index, over: index };
    items[index].classList.add("dragging");
    items[index].setPointerCapture(e.pointerId);
  }
  onPointerMove(e) {
    if (!this._drag) return;
    const items = [...this.renderRoot.querySelectorAll("li")];
    const over = items.findIndex((li) => {
      const r = li.getBoundingClientRect();
      return e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (over >= 0 && over !== this._drag.over) {
      items.forEach((li) => li.classList.remove("over"));
      items[over].classList.add("over");
      this._drag.over = over;
    }
  }
  onPointerUp() {
    if (!this._drag) return;
    const { from, over } = this._drag;
    this._drag = null;
    this.renderRoot.querySelectorAll("li").forEach((li) => li.classList.remove("over", "dragging"));
    this.move(from, over);
  }

  renderWidget() {
    const { order, checked } = this.state;
    const n = this.items.length;
    const perfect = checked && order.every((v, i) => v === i);
    return html`<section class="card" aria-label=${this.config.title || "Put in order"}>
      <div class="eyebrow">Put in order ${this.graded ? html`<span class="graded">· graded</span>` : nothing}</div>
      ${this.config.title ? html`<h3>${unsafeHTML(this.config.title)}</h3>` : nothing}
      ${this.config.prompt ? html`<p>${unsafeHTML(this.config.prompt)}</p>` : nothing}
      <p class="muted">Drag the cards, or use the arrow buttons.</p>
      <ol @pointermove=${this.onPointerMove} @pointerup=${this.onPointerUp} @pointercancel=${this.onPointerUp}>
        ${order.map((itemIndex, pos) => {
          const cls = checked ? (itemIndex === pos ? "correct locked" : "wrong locked") : "";
          return html`<li class=${cls} tabindex="-1" @pointerdown=${(e) => this.onPointerDown(e, pos)}>
            <span class="grip" aria-hidden="true">⋮⋮</span>
            <span class="text">${unsafeHTML(this.items[itemIndex])}</span>
            ${checked
              ? html`<span class="sr-only">${itemIndex === pos ? "correct position" : "wrong position"}</span>`
              : html`<span class="move">
                  <button data-dir="up" aria-label="Move up" ?disabled=${pos === 0} @click=${() => this.move(pos, pos - 1)}>↑</button>
                  <button data-dir="down" aria-label="Move down" ?disabled=${pos === n - 1} @click=${() => this.move(pos, pos + 1)}>↓</button>
                </span>`}
          </li>`;
        })}
      </ol>
      ${checked
        ? html`<div class="feedback ${perfect ? "ok" : "bad"}" role="status">
              ${perfect
                ? html`<strong>Exactly right.</strong> ${this.config.explain ? unsafeHTML(this.config.explain) : nothing}`
                : html`<strong>${Math.round(this.fraction() * n)} of ${n} in the right place.</strong> Rearrange the red ones and check again.`}
            </div>
            <div class="actions">
              ${perfect
                ? html`<button class="btn-ghost" @click=${() => this.resetState()}>Start over</button>`
                : html`<button class="btn-primary" @click=${() => this.setState({ checked: false })}>Try again</button>`}
            </div>`
        : html`<div class="actions"><button class="btn-primary" @click=${this.check}>Check order</button></div>`}
    </section>`;
  }
}

customElements.define("lx-order", LxOrder);

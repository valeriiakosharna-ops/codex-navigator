import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LxElement, baseStyles } from "../../shell/base-element.js";

/** Personal checklist; progress is remembered in the browser. Not graded. */
class LxChecklist extends LxElement {
  static styles = [
    baseStyles,
    css`
      ul { list-style: none; padding: 0; margin: 0 0 12px; }
      li { border-bottom: 1px solid var(--lx-border); }
      li:last-child { border-bottom: 0; }
      label { display: flex; gap: 12px; padding: 10px 2px; cursor: pointer; align-items: flex-start; }
      input { width: 18px; height: 18px; margin-top: 4px; accent-color: var(--lx-success); flex: none; }
      .done .t { color: var(--lx-text-muted); text-decoration: line-through; text-decoration-color: #b9c0ca; }
      .hint { display: block; font-size: 14px; color: var(--lx-text-muted); text-decoration: none; }
      .top { display: flex; gap: 12px; align-items: center; margin-bottom: 6px; }
      .top .progress { flex: 1; }
    `,
  ];

  get items() {
    return (this.config.items || []).map((it) => (typeof it === "string" ? { text: it } : it));
  }
  initialState() { return { done: [] }; }
  result() {
    const n = this.state.done.filter(Boolean).length;
    return { score: 0, complete: n === this.items.length };
  }
  toggle(i) {
    const done = [...this.state.done];
    done[i] = !done[i];
    this.setState({ done });
  }

  renderWidget() {
    const n = this.state.done.filter(Boolean).length;
    const total = this.items.length;
    return html`<section class="card" aria-label=${this.config.title || "Checklist"}>
      <div class="eyebrow">Checklist</div>
      ${this.config.title ? html`<h3>${unsafeHTML(this.config.title)}</h3>` : nothing}
      <div class="top">
        <div class="progress" aria-hidden="true"><span style="width:${(n / total) * 100}%"></span></div>
        <span class="muted" role="status">${n} / ${total}</span>
      </div>
      <ul>
        ${this.items.map(
          (it, i) => html`<li class=${this.state.done[i] ? "done" : ""}>
            <label>
              <input type="checkbox" .checked=${!!this.state.done[i]} @change=${() => this.toggle(i)} />
              <span><span class="t">${unsafeHTML(it.text)}</span>${it.hint ? html`<span class="hint">${unsafeHTML(it.hint)}</span>` : nothing}</span>
            </label>
          </li>`,
        )}
      </ul>
      ${n === total && this.config.done ? html`<div class="feedback ok" role="status">${unsafeHTML(this.config.done)}</div>` : nothing}
    </section>`;
  }
}

customElements.define("lx-checklist", LxChecklist);

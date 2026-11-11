import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LxElement, baseStyles } from "../../shell/base-element.js";

/** Flip cards for terms, commands, rules of thumb. Not graded. */
class LxFlashcards extends LxElement {
  static styles = [
    baseStyles,
    css`
      .stage { perspective: 1200px; margin: 6px 0 12px; }
      .flip {
        position: relative; width: 100%; min-height: 190px; border: 0; padding: 0; background: none; border-radius: var(--lx-radius-lg);
        transform-style: preserve-3d; transition: transform .45s; cursor: pointer; font: inherit; color: inherit; text-align: center;
      }
      .flip.back { transform: rotateY(180deg); }
      .face {
        position: absolute; inset: 0; display: grid; place-items: center; padding: 22px 28px; border-radius: var(--lx-radius-lg);
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
      }
      .front { background: var(--lx-ink); color: #fff; font-family: var(--lx-font-heading); font-size: 24px; font-weight: 600; }
      .front code { background: rgba(255,255,255,.12); color: var(--lx-sky); font-size: .9em; }
      .backface { background: #f2f8fc; border: 1px solid #cfe9f7; transform: rotateY(180deg); font-size: 16px; text-align: left; }
      .tag { position: absolute; top: 10px; left: 14px; font: 800 11px var(--lx-font-body); letter-spacing: .1em; text-transform: uppercase; opacity: .7; }
      .nav { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .count { margin-right: auto; }
      .known { color: var(--lx-success); font-weight: 700; }
      @media (prefers-reduced-motion: reduce) { .flip { transition: none; } }
    `,
  ];

  get cards() { return this.config.cards || []; }
  initialState() { return { index: 0, flipped: false, known: [] }; }
  result() {
    const n = this.state.known.filter(Boolean).length;
    return { score: 0, complete: n === this.cards.length };
  }
  go(delta) {
    const n = this.cards.length;
    this.setState({ index: (this.state.index + delta + n) % n, flipped: false });
  }
  markKnown() {
    const known = [...this.state.known];
    known[this.state.index] = true;
    this.setState({ known });
    this.go(1);
  }

  renderWidget() {
    const { index, flipped } = this.state;
    const card = this.cards[index] || { front: "", back: "" };
    const knownCount = this.state.known.filter(Boolean).length;
    return html`<section class="card" aria-label=${this.config.title || "Flashcards"}>
      <div class="eyebrow">Flashcards</div>
      ${this.config.title ? html`<h3>${unsafeHTML(this.config.title)}</h3>` : nothing}
      <div class="stage">
        <button class="flip ${flipped ? "back" : ""}" aria-label="Flip card" aria-pressed=${flipped}
          @click=${() => this.setState({ flipped: !flipped })}>
          <div class="face front" aria-hidden=${flipped}><span class="tag">Card ${index + 1}</span><div>${unsafeHTML(card.front)}</div></div>
          <div class="face backface" aria-hidden=${!flipped}><span class="tag">Answer</span><div>${unsafeHTML(card.back)}</div></div>
        </button>
      </div>
      <div class="nav">
        <span class="muted count">${index + 1} / ${this.cards.length} · <span class="known">${knownCount} known</span></span>
        <button class="btn-ghost" @click=${() => this.go(-1)} aria-label="Previous card">←</button>
        <button class="btn-ghost" @click=${() => this.markKnown()}>I knew it</button>
        <button class="btn-primary" @click=${() => this.go(1)}>Next →</button>
      </div>
    </section>`;
  }
}

customElements.define("lx-flashcards", LxFlashcards);

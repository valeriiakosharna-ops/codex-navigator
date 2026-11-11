import { LitElement, css, html } from "lit";
import { stateKey, load, save, remove } from "./storage.js";

/**
 * Base class for every interactive widget.
 *
 * Contract (keep it small — this is the only API widgets share):
 *  - config comes from a <script type="application/json"> child rendered at build time;
 *  - state is persisted per learner/version via this.state + this.persist();
 *  - widgets never talk to Moodle. They emit two DOM events that the bridge listens to:
 *      lx-register  { id, graded, max }            once, when connected
 *      lx-progress  { id, score, max, complete }   whenever the result changes
 */
export class LxElement extends LitElement {
  /** Override in graded widgets. Authors can still opt out with `graded: false`. */
  static graded = false;

  static properties = { state: { state: true } };

  constructor() {
    super();
    this.config = {};
    this.state = null;
    this._failed = null;
  }

  connectedCallback() {
    try {
      const script = this.querySelector('script[type="application/json"]');
      this.config = script ? JSON.parse(script.textContent) : {};
      this._key = stateKey(this.id || this.localName);
      this.state = { ...this.initialState(), ...(load(this._key) || {}) };
    } catch (err) {
      this._fail("LX-R201", err);
    }
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("lx-register", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, graded: this.graded, max: this.graded ? this.maxScore() : 0 },
      }),
    );
    // Restored state counts as progress (e.g. learner reloads the page).
    queueMicrotask(() => this.report());
  }

  get graded() {
    return this.constructor.graded && this.config.graded !== false;
  }

  // ---- to be overridden ---------------------------------------------------
  initialState() { return {}; }
  maxScore() { return 1; }
  /** @returns {{score:number, complete:boolean}} */
  result() { return { score: 0, complete: false }; }
  renderWidget() { return html``; }

  // ---- helpers ------------------------------------------------------------
  setState(patch) {
    this.state = { ...this.state, ...patch };
    save(this._key, this.state);
    this.report();
  }

  resetState() {
    remove(this._key);
    this.state = this.initialState();
    this.report();
  }

  report() {
    if (this._failed) return;
    const { score, complete } = this.result();
    this.dispatchEvent(
      new CustomEvent("lx-progress", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, graded: this.graded, score, max: this.graded ? this.maxScore() : 0, complete },
      }),
    );
  }

  _fail(code, err) {
    this._failed = code;
    console.error(`[${code}] ${this.localName}#${this.id}:`, err);
  }

  render() {
    if (!this._failed) {
      try {
        return this.renderWidget();
      } catch (err) {
        this._fail("LX-R202", err);
      }
    }
    return html`<div class="card error" role="alert">
      This activity could not be loaded (${this._failed}). Please reload the page; if it persists, tell your mentor.
    </div>`;
  }

  /** Deterministic pseudo-random order, so a shuffled widget looks the same after reload. */
  static seededOrder(n, seedText) {
    let seed = 0;
    for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const order = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }
}

/** Shared look for all widgets (tokens come from theme/tokens.css through custom properties). */
export const baseStyles = css`
  :host { display: block; font-family: var(--lx-font-body); color: var(--lx-text); line-height: 1.6; }
  * { box-sizing: border-box; }
  .card { background: var(--lx-surface); border: 1px solid var(--lx-border); border-radius: var(--lx-radius-lg); padding: 20px 22px; }
  .card.error { background: var(--lx-error-bg); border-color: #f7c3cf; color: var(--lx-error); }
  .eyebrow { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--lx-blue); margin-bottom: 4px; }
  .eyebrow .graded { color: var(--lx-wine); }
  h3 { font-family: var(--lx-font-heading); font-weight: 600; font-size: 20px; color: var(--lx-ink); margin: 0 0 14px; line-height: 1.3; }
  p { margin: 0 0 10px; }
  code { font-family: var(--lx-font-mono); font-size: .88em; background: #eef1f5; color: var(--lx-wine); padding: 1px 5px; border-radius: 4px; }
  a { color: var(--lx-link); }
  button {
    font: 700 15px var(--lx-font-body); border-radius: 999px; padding: 9px 18px; cursor: pointer;
    border: 1px solid transparent; transition: background .15s, border-color .15s, color .15s;
  }
  button:focus-visible { outline: 3px solid var(--lx-focus); outline-offset: 2px; }
  button:disabled { opacity: .45; cursor: not-allowed; }
  .btn-primary { background: var(--lx-ink); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--lx-steel); }
  .btn-ghost { background: transparent; color: var(--lx-steel); border-color: var(--lx-border); }
  .btn-ghost:hover:not(:disabled) { border-color: var(--lx-blue); color: var(--lx-ink); }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 14px; }
  .feedback { border-radius: var(--lx-radius); padding: 10px 14px; margin-top: 12px; font-size: 15px; }
  .feedback.ok { background: var(--lx-success-bg); color: #145c3c; }
  .feedback.bad { background: var(--lx-error-bg); color: #8a0020; }
  .feedback p:last-child { margin: 0; }
  .muted { color: var(--lx-text-muted); font-size: 14px; }
  .progress { height: 8px; background: #edf0f4; border-radius: 999px; overflow: hidden; }
  .progress > span { display: block; height: 100%; background: linear-gradient(90deg, var(--lx-blue), var(--lx-sky)); transition: width .3s; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;

import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { stateKey, load, save, remove } from "./storage.js";

/**
 * Base class for every interactive widget.
 *
 * Contract (keep it small — this is the only API widgets share):
 *  - config comes from a <script type="application/json"> child rendered at build time;
 *  - state is persisted per learner/version via this.state + this.persist();
 *  - widgets never talk to Moodle. They emit two DOM events that the bridge listens to:
 *      lx-register  { id, graded, max }            once, when connected
 *      lx-progress  { id, score, max, complete, exhausted }   whenever the result changes
 *  - optional `unlock: { after: <widget id>, min: 0.7 }` keeps a widget locked until the
 *    widget it depends on reaches `min` (fraction of its points) or runs out of attempts.
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
    this._setupUnlock();
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
    const { score, complete, exhausted = false } = this.result();
    const max = this.maxScore();
    this.dispatchEvent(
      new CustomEvent("lx-progress", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, graded: this.graded, score: this.graded ? score : 0, max: this.graded ? max : 0, fraction: max ? score / max : 0, complete, exhausted },
      }),
    );
  }

  // ---- level unlocking ------------------------------------------------------
  get locked() { return !!this.config.unlock && !this._unlocked; }

  _setupUnlock() {
    const u = this.config.unlock;
    if (!u) return;
    const min = u.min ?? 0.7;
    const prev = load(stateKey(u.after)) || {};
    this._unlocked = (prev.best ?? 0) >= min || !!prev.exhausted;
    this._onPeer = (e) => {
      const d = e.detail;
      if (d.id !== u.after || this._unlocked) return;
      if (d.fraction >= min || d.exhausted) {
        this._unlocked = true;
        this.requestUpdate();
      }
    };
    document.addEventListener("lx-progress", this._onPeer);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._onPeer) document.removeEventListener("lx-progress", this._onPeer);
  }

  renderLocked() {
    const u = this.config.unlock;
    const target = document.getElementById(u.after);
    const name = target?.config?.title || "the previous level";
    return html`<section class="card locked" aria-label="Locked">
      <div class="lock" aria-hidden="true">🔒</div>
      <div>
        ${this.config.level ? html`<span class="lvl lvl-${this.config.level}">Level ${this.config.level}</span>` : ""}
        <h3>${unsafeHTML(this.config.title || "Locked")}</h3>
        <p class="muted">Unlocks when you score at least ${Math.round((u.min ?? 0.7) * 100)}% in “${unsafeHTML(name)}” (or use all its attempts).</p>
      </div>
    </section>`;
  }

  _fail(code, err) {
    this._failed = code;
    console.error(`[${code}] ${this.localName}#${this.id}:`, err);
  }

  render() {
    if (!this._failed) {
      try {
        return this.locked ? this.renderLocked() : this.renderWidget();
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
  .locked { display: flex; gap: 16px; align-items: center; background: var(--lx-surface-2); border-style: dashed; }
  .locked h3 { margin: 6px 0 4px; }
  .lock { font-size: 28px; opacity: .7; }
  .lvl { display: inline-block; font: 800 11px var(--lx-font-body); letter-spacing: .08em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; color: #fff; }
  .lvl-1 { background: var(--lx-steel); }
  .lvl-2 { background: #b26a00; }
  .lvl-3 { background: var(--lx-wine); }
  .rating { display: inline-block; font: 800 11px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; }
  .rating.optimal { background: var(--lx-success-bg); color: #145c3c; }
  .rating.acceptable { background: #e6f6fd; color: var(--lx-steel); }
  .rating.risky { background: #fff4e0; color: #8a5200; }
  .rating.critical { background: var(--lx-error-bg); color: #8a0020; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;

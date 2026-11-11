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
      this.state = this.migrate(load(this._key));
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

  // ---- versioned practices --------------------------------------------------
  /**
   * Practices (scenario, spot) carry `version` and a build-time structure fingerprint `_fp`.
   * If either differs from what the saved progress was made with, the unfinished attempt is
   * dropped (choice indices / step ids may no longer match) but the best score is kept,
   * so the page grade never goes down.
   */
  migrate(saved) {
    const fresh = this.initialState();
    const fp = this.config._fp, cv = this.config.version;
    if (!fp) return { ...fresh, ...(saved || {}) };
    if (!saved) return { ...fresh, fp, cv };
    const legacy = saved.fp === undefined && saved.cv === undefined; // saved before practices were versioned
    if (saved.fp === fp && saved.cv === cv) return { ...fresh, ...saved };
    if (legacy) {
      // adopt and stamp it, so a later structural change is detected for this save too
      const adopted = { ...fresh, ...saved, fp, cv };
      save(this._key, adopted);
      return adopted;
    }
    const migrated = {
      ...fresh,
      best: saved.best || 0,
      carried: (saved.attemptsUsed || 0) > 0 || !!saved.carried,
      fp,
      cv,
      notice: saved.cv !== cv ? "version" : "changed",
    };
    save(this._key, migrated);
    return migrated;
  }

  renderNotice() {
    if (!this.state?.notice) return "";
    return html`<div class="notice" role="status">
      <strong>This practice was updated${this.config.version > 1 ? ` (version ${this.config.version})` : ""}.</strong>
      Your unfinished attempt was reset; your best result (${Math.round((this.state.best || 0) * 100)}%) is kept.
    </div>`;
  }

  // ---- helpers ------------------------------------------------------------
  setState(patch) {
    const { notice, ...rest } = this.state || {};
    this.state = { ...rest, ...patch }; // any action dismisses the "updated" notice
    save(this._key, this.state);
    this.report();
  }

  resetState() {
    remove(this._key);
    this.state = { ...this.initialState(), ...(this.config._fp ? { fp: this.config._fp, cv: this.config.version } : {}) };
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
        <p class="muted">Unlocks when you score at least ${Math.round((u.min ?? 0.7) * 100)}% in “${unsafeHTML(name)}” (or after two tries).</p>
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
  .card {
    background: var(--lx-surface); border: 1px solid var(--lx-border); border-radius: var(--lx-radius-lg);
    padding: 22px 24px; box-shadow: var(--lx-shadow-sm);
  }
  .card.error { background: var(--lx-error-soft); border-color: transparent; color: var(--lx-error-ink); }
  .eyebrow { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: var(--lx-accent-ink); margin-bottom: 6px; }
  .eyebrow .graded { color: var(--lx-danger-ink); }
  h3 { font-family: var(--lx-font-heading); font-weight: 800; font-size: 19px; letter-spacing: -.01em; color: var(--lx-heading); margin: 0 0 14px; line-height: 1.3; }
  p { margin: 0 0 10px; }
  strong, b { color: var(--lx-heading); }
  code { font-family: var(--lx-font-mono); font-size: .86em; background: var(--lx-inline-code-bg); color: var(--lx-inline-code-text); padding: 1px 6px; border-radius: 6px; }
  a { color: var(--lx-link); }
  button {
    font: 800 14.5px var(--lx-font-body); border-radius: 12px; padding: 10px 18px; cursor: pointer;
    border: 1px solid transparent; transition: background .15s, border-color .15s, color .15s, transform .15s;
  }
  button:focus-visible { outline: 3px solid var(--lx-focus); outline-offset: 2px; }
  button:disabled { opacity: .45; cursor: not-allowed; }
  .btn-primary { background: var(--lx-primary); color: var(--lx-on-primary); }
  .btn-primary:hover:not(:disabled) { background: var(--lx-primary-hover); transform: translateY(-1px); }
  .btn-ghost { background: var(--lx-surface); color: var(--lx-heading); border-color: var(--lx-border); }
  .btn-ghost:hover:not(:disabled) { border-color: var(--lx-border-strong); background: var(--lx-surface-3); }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 16px; }
  .feedback { border-radius: var(--lx-radius); padding: 12px 16px; margin-top: 12px; font-size: 15px; }
  .feedback.ok { background: var(--lx-success-soft); color: var(--lx-success-ink); }
  .feedback.bad { background: var(--lx-error-soft); color: var(--lx-error-ink); }
  .feedback strong { color: inherit; }
  .feedback p:last-child { margin: 0; }
  .muted { color: var(--lx-text-muted); font-size: 14px; }
  .progress { height: 8px; background: var(--lx-surface-3); border-radius: 999px; overflow: hidden; }
  .progress > span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--lx-accent), var(--lx-sky)); transition: width .3s; }
  .notice { background: var(--lx-warning-soft); color: var(--lx-warning-ink); border-radius: var(--lx-radius); padding: 10px 14px; margin: 10px 0; font-size: 14px; }
  .notice strong { color: inherit; }
  .locked { display: flex; gap: 16px; align-items: center; background: var(--lx-surface-2); border-style: dashed; box-shadow: none; }
  .locked h3 { margin: 8px 0 4px; }
  .lock { width: 48px; height: 48px; flex: none; display: grid; place-items: center; border-radius: 14px; background: var(--lx-surface-3); font-size: 22px; }
  .lvl { display: inline-block; font: 800 11px var(--lx-font-body); letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
  .lvl-1 { background: var(--lx-accent-soft); color: var(--lx-accent-ink); }
  .lvl-2 { background: var(--lx-warning-soft); color: var(--lx-warning-ink); }
  .lvl-3 { background: var(--lx-danger-soft); color: var(--lx-danger-ink); }
  .rating { display: inline-block; font: 800 11px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; }
  .rating.optimal { background: var(--lx-success-soft); color: var(--lx-success-ink); }
  .rating.acceptable { background: var(--lx-accent-soft); color: var(--lx-accent-ink); }
  .rating.risky { background: var(--lx-warning-soft); color: var(--lx-warning-ink); }
  .rating.critical { background: var(--lx-error-soft); color: var(--lx-error-ink); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;

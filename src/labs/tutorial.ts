/**
 * 3-minute quick experience on the home page: a guided walkthrough with
 * Next/Back buttons. Step 5 includes a working approve interaction.
 * Every scene is an illustrative simulation.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import type { Lang } from '../lib/types';
import { badgeHtml } from './helpers';

export function mountTutorial(root: HTMLElement): void {
  let lang: Lang = getLang();
  let step = 0;
  let approved = false;
  const TOTAL = 6;

  function go(next: number): void {
    step = Math.min(TOTAL - 1, Math.max(0, next));
    render();
    announce(`${t(lang, 'tutorial.stepLabel')} ${step + 1}/${TOTAL} — ${t(lang, `tutorial.s${step + 1}.title`)}`);
  }

  function approve(): void {
    approved = true;
    render();
    announce(t(lang, 'tutorial.s5.after'));
  }

  function render(): void {
    const n = step + 1;
    const body = html`
      <div class="tutorial-step" role="region" aria-label="${escapeHtml(t(lang, `tutorial.s${n}.title`))}">
        <h2 style="margin-top:0;">
          <span class="kicker">${escapeHtml(t(lang, 'tutorial.stepLabel'))} ${n}/${TOTAL}</span><br>
          ${escapeHtml(t(lang, `tutorial.s${n}.title`))}
        </h2>
        <p>${escapeHtml(t(lang, `tutorial.s${n}.text`))}</p>
        ${stepDemo(n)}
      </div>
      <div class="tutorial-nav">
        <button type="button" class="btn" data-action="back" ${step === 0 ? 'disabled' : ''}>← ${escapeHtml(t(lang, 'tutorial.back'))}</button>
        ${
          step < TOTAL - 1
            ? `<button type="button" class="btn btn-primary" data-action="next">${escapeHtml(t(lang, 'tutorial.next'))} →</button>`
            : `<a class="btn btn-primary" href="${import.meta.env.BASE_URL}layer-lab/">${escapeHtml(t(lang, 'tutorial.s6.cta'))}</a>`
        }
      </div>
    `;
    root.innerHTML = body;
    bind();
  }

  function stepDemo(n: number): string {
    switch (n) {
      case 1:
        return html`<div class="tutorial-demo">${badgeHtml(lang, 'CONCEPT')} ${badgeHtml(lang, 'EXPECTED')}</div>`;
      case 2:
        return html`
          <div class="tutorial-demo">
            <div class="mini-card"><strong>Explorer</strong> — ${escapeHtml(t(lang, 'tutorial.s2.p1'))}</div>
            <div class="mini-card"><strong>Conservator</strong> — ${escapeHtml(t(lang, 'tutorial.s2.p2'))}</div>
            <div class="mini-card" style="border-color: var(--red);"><strong>Synthesizer</strong> — ${escapeHtml(t(lang, 'tutorial.s2.p3'))}</div>
            <p style="margin:0; font-size:.88rem; color: var(--ink-faint);">${escapeHtml(t(lang, 'tutorial.s2.note'))}</p>
          </div>
        `;
      case 3:
        return html`
          <div class="tutorial-demo">
            <div class="mini-card"><strong>B</strong> — ${escapeHtml(t(lang, 'tutorial.s3.b'))}</div>
            <div class="mini-card" style="border-color: var(--red);"><strong>E</strong> — ${escapeHtml(t(lang, 'tutorial.s3.e'))}</div>
          </div>
        `;
      case 4:
        return html`
          <div class="tutorial-demo">
            <div class="mini-card" style="border-color: var(--amber); background: var(--amber-soft);">
              <span class="badge badge-state state-QUARANTINED">${escapeHtml(t(lang, 'common.state.QUARANTINED'))}</span>
              ${escapeHtml(t(lang, 'tutorial.s4.quarantined'))}
            </div>
          </div>
        `;
      case 5:
        return html`
          <div class="tutorial-demo">
            <div class="mini-card">${escapeHtml(t(lang, 'tutorial.s5.before'))}</div>
            ${
              approved
                ? `<div class="mini-card" style="border-color: var(--green); background: var(--green-soft);">
                    <span class="badge badge-state state-APPROVED">${escapeHtml(t(lang, 'common.state.APPROVED'))}</span>
                    ${escapeHtml(t(lang, 'tutorial.s5.after'))}
                  </div>`
                : `<button type="button" class="btn btn-primary btn-small" data-action="approve">${escapeHtml(t(lang, 'tutorial.s5.approve'))}</button>`
            }
          </div>
        `;
      case 6:
        return html`
          <div class="tutorial-demo">
            ${badgeHtml(lang, 'SIMULATION')}
            <p style="margin:0;">${escapeHtml(t(lang, 'common.measuredEmpty'))}</p>
          </div>
        `;
      default:
        return '';
    }
  }

  function bind(): void {
    root.querySelectorAll<HTMLButtonElement>('[data-action="next"]').forEach((b) => b.addEventListener('click', () => go(step + 1)));
    root.querySelectorAll<HTMLButtonElement>('[data-action="back"]').forEach((b) => b.addEventListener('click', () => go(step - 1)));
    root.querySelectorAll<HTMLButtonElement>('[data-action="approve"]').forEach((b) => b.addEventListener('click', approve));
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

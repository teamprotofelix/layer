/**
 * Future experience — hypothetical scenes for the case where the
 * hypotheses are verified. The intellectual-property examination scene is a
 * separate tab, labelled APPLICATION CONCEPT near its title. No real case
 * names, application numbers, legal conclusions, or accuracy figures appear.
 * Persona choices from earlier labs are reflected.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import { loadSelection, onSelectionChange, type LabSelection } from '../lib/store';
import type { Lang } from '../lib/types';
import { PERSONAS } from '../data/personas';
import { badgeHtml, noticeHtml } from './helpers';

export function mountFutureScene(root: HTMLElement): void {
  let lang: Lang = getLang();
  let scene: 'research' | 'ip' = 'research';
  let selection: LabSelection = loadSelection();

  onSelectionChange((next) => {
    selection = next;
    render();
  });

  function setScene(next: 'research' | 'ip'): void {
    scene = next;
    render();
    announce(t(lang, next === 'ip' ? 'fut.scene2' : 'fut.scene1'));
  }

  function activePersonas(): string[] {
    const ids = selection.personaIds.length > 0 ? selection.personaIds : ['explorer', 'critic', 'auditor'];
    return ids.map((id) => PERSONAS.find((p) => p.id === id)?.id ?? 'explorer');
  }

  function researchScene(): string {
    const personas = activePersonas();
    const steps = [
      { key: 'fut.scene1.flow.explore', who: 'explorer', active: personas.includes('explorer') },
      { key: 'fut.scene1.flow.counter', who: 'critic', active: personas.includes('critic') },
      { key: 'fut.scene1.flow.evidence', who: 'auditor', active: personas.includes('auditor') },
      { key: 'fut.scene1.flow.decide', who: 'human', active: true },
    ];
    return html`
      <div class="card">
        <div class="card-title-row">
          <h2 style="margin:0;">${escapeHtml(t(lang, 'fut.scene1.title'))}</h2>
          ${badgeHtml(lang, 'EXPECTED')}
        </div>
        <p>${escapeHtml(t(lang, 'fut.scene1.text'))}</p>
        <ol class="timeline">
          ${steps
            .map(
              (s) => html`
                <li>
                  <strong>${s.who === 'human' ? '👤' : '◇'} ${escapeHtml(s.who)}</strong> — ${escapeHtml(t(lang, s.key))}
                  ${!s.active && s.who !== 'human' ? `<span class="badge" style="margin-left:.4rem;">${escapeHtml(t(lang, 'common.optional'))}</span>` : ''}
                </li>
              `,
            )
            .join('')}
        </ol>
        <p><small>${escapeHtml(t(lang, 'fut.nextNote'))} (${personas.join(', ')})</small></p>
      </div>
    `;
  }

  function ipScene(): string {
    return html`
      <div class="card" style="border-color: var(--amber);">
        <div class="card-title-row">
          <h2 style="margin:0;">${escapeHtml(t(lang, 'fut.scene2.title'))}</h2>
          <span class="badge badge-SIMULATION">${escapeHtml(t(lang, 'fut.appConcept'))}</span>
        </div>
        <p>${escapeHtml(t(lang, 'fut.scene2.text'))}</p>
        ${noticeHtml('notice-warn', null, ['fut.scene2.disclaimer1', 'fut.scene2.disclaimer2'], lang)}
        <h3>${escapeHtml(t(lang, 'fut.scene2.case'))}</h3>
        <ol class="timeline">
          <li><strong>Explorer</strong> — ${escapeHtml(t(lang, 'fut.scene2.explore'))}</li>
          <li><strong>Critic</strong> — ${escapeHtml(t(lang, 'fut.scene2.counter'))}</li>
          <li><strong>Auditor</strong> — ${escapeHtml(t(lang, 'fut.scene2.evidence'))}</li>
          <li><strong>👤 ${escapeHtml(t(lang, 'common.approve'))}</strong> — ${escapeHtml(t(lang, 'fut.scene2.decide'))}</li>
        </ol>
      </div>
    `;
  }

  function render(): void {
    root.innerHTML = html`
      <h1>${escapeHtml(t(lang, 'fut.title'))}</h1>
      <p class="lead">${escapeHtml(t(lang, 'fut.lead'))}</p>
      <div class="card-title-row">${badgeHtml(lang, 'NARRATIVE')} ${badgeHtml(lang, 'EXPECTED')}</div>

      <div class="tabs" role="tablist" aria-label="${escapeHtml(t(lang, 'fut.title'))}">
        <button type="button" role="tab" aria-selected="${scene === 'research'}" data-action="scene" data-scene="research">${escapeHtml(t(lang, 'fut.scene1'))}</button>
        <button type="button" role="tab" aria-selected="${scene === 'ip'}" data-action="scene" data-scene="ip">${escapeHtml(t(lang, 'fut.scene2'))}</button>
      </div>
      <div role="tabpanel">${scene === 'research' ? researchScene() : ipScene()}</div>
    `;
    bind();
  }

  function bind(): void {
    root.querySelectorAll<HTMLButtonElement>('[data-action="scene"]').forEach((b) =>
      b.addEventListener('click', () => setScene(b.dataset.scene as 'research' | 'ip')),
    );
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

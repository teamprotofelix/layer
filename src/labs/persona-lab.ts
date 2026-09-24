/**
 * Persona Lab — state & permission boundaries.
 * "persona count" and "effective behavior diversity" are independent
 * controls: cloning the same tendency grows the card count without
 * widening the proposal range.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import { loadSelection, saveSelection, type LabSelection } from '../lib/store';
import type { Lang } from '../lib/types';
import { candidateById } from '../data/candidates';
import { PERSONAS, PERSONA_IDS, PERSONA_MEMORY_NOTES, PERSONA_PROPOSALS, PERSONA_TEXTS, type PersonaId } from '../data/personas';
import { badgeHtml, fieldListHtml, noticeHtml } from './helpers';

export function mountPersonaLab(root: HTMLElement): void {
  let selection: LabSelection = loadSelection();
  let lang: Lang = getLang();
  let shareAttempted = false;
  let customDescriptor = '';

  /** LOW diversity = clones of the first persona; HIGH = distinct personas. */
  function visiblePersonaIds(): PersonaId[] {
    const count = selection.personaCount;
    if (selection.behaviorDiversity === 'LOW') {
      const base = PERSONA_IDS.includes(selection.personaIds[0] as PersonaId)
        ? (selection.personaIds[0] as PersonaId)
        : 'explorer';
      return Array.from({ length: count }, () => base);
    }
    return PERSONA_IDS.slice(0, count);
  }

  function setCount(delta: number): void {
    const next = Math.min(5, Math.max(1, selection.personaCount + delta));
    if (next === selection.personaCount) return;
    selection = { ...selection, personaCount: next };
    saveSelection(selection);
    render();
    announce(`${t(lang, 'persona.countLabel')}: ${next}`);
  }

  function setDiversity(diversity: 'LOW' | 'HIGH'): void {
    selection = { ...selection, behaviorDiversity: diversity };
    saveSelection(selection);
    render();
    announce(t(lang, 'persona.diversityLabel') + ': ' + t(lang, diversity === 'LOW' ? 'persona.diversity.low' : 'persona.diversity.high'));
  }

  function attemptShare(): void {
    shareAttempted = true;
    render();
    announce(t(lang, 'persona.shareBlocked'));
  }

  function onCustomChange(value: string): void {
    customDescriptor = value.slice(0, 200);
    render();
  }

  function personaCard(id: PersonaId, index: number): string {
    const persona = PERSONAS.find((p) => p.id === id);
    if (!persona) return '';
    const texts = PERSONA_TEXTS;
    // goal/behaviors/taskState are stored as keys into PERSONA_TEXTS; render localized.
    const goal = texts[persona.goalScopeKey]?.[lang] ?? persona.goalScopeKey;
    const taskState = texts[persona.currentTaskState]?.[lang] ?? persona.currentTaskState;
    const behaviors = persona.behaviorDescriptor
      .map((key) => texts[key]?.[lang] ?? key)
      .filter((v) => v);
    const cloneMark = selection.behaviorDiversity === 'LOW' && index > 0 ? ` · ${t(lang, 'persona.diversity.low')}` : '';

    const description =
      customDescriptor && index === 0
        ? html`<p><em>${escapeHtml(customDescriptor)}</em> <small>(${escapeHtml(t(lang, 'persona.scopeNote'))})</small></p>`
        : '';

    return html`
      <article class="persona-card">
        <header>
          <h4>${persona.id} <small style="font-weight:400;">${escapeHtml(t(lang, `persona.${persona.id}.desc`))}</small></h4>
          <span class="badge">${escapeHtml(persona.version)}</span>
        </header>
        <dl class="persona-fields">
          <dt>${escapeHtml(t(lang, 'persona.field.goalScope'))}</dt>
          <dd>${escapeHtml(goal)}</dd>
          <dt>${escapeHtml(t(lang, 'persona.field.behavior'))}</dt>
          <dd>${behaviors.map((b) => `· ${escapeHtml(b)}`).join('<br>')}${cloneMark}</dd>
          <dt>${escapeHtml(t(lang, 'persona.field.memory'))}</dt>
          <dd><code>${escapeHtml(persona.memoryNamespace)}</code></dd>
          <dt>${escapeHtml(t(lang, 'persona.field.tools'))}</dt>
          <dd>${fieldListHtml(persona.allowedTools)}</dd>
          <dt>${escapeHtml(t(lang, 'persona.field.risk'))}</dt>
          <dd>${persona.riskBudget}</dd>
          <dt>${escapeHtml(t(lang, 'persona.field.taskState'))}</dt>
          <dd>${escapeHtml(taskState)}</dd>
        </dl>
        ${description}
      </article>
    `;
  }

  function comparisonTable(personaIds: PersonaId[]): string {
    const rows = PERSONA_PROPOSALS.filter((pp) => personaIds.includes(pp.personaId));
    const body = rows
      .map((pp) => {
        const candidate = candidateById(pp.candidateId);
        const counter = pp.counterexample ? escapeHtml(pp.counterexample.text[lang]) : '—';
        const constraint = candidate?.constraintOk
          ? `<span style="color: var(--green);">${escapeHtml(t(lang, 'persona.constraint.ok'))}</span>`
          : `<span style="color: var(--red);">${escapeHtml(t(lang, 'persona.constraint.violated'))}</span>`;
        const leak = pp.roleLeak
          ? `<span style="color: var(--red);">${escapeHtml(t(lang, 'persona.leak.found'))}</span>${pp.memoryNoteKey ? `<br><small>${escapeHtml(t(lang, 'persona.roleLeak.critic'))}</small>` : ''}`
          : escapeHtml(t(lang, 'persona.leak.none'));
        const memory = pp.wrongMemoryRef
          ? `<span style="color: var(--red);">${escapeHtml(t(lang, 'persona.memory.wrong'))}</span>${
              pp.memoryNoteKey
                ? `<br><small>${escapeHtml(PERSONA_MEMORY_NOTES[pp.memoryNoteKey]?.[lang] ?? '')}</small>`
                : ''
            }`
          : escapeHtml(t(lang, 'persona.memory.correct'));
        return html`
          <tr>
            <td><strong>${pp.personaId}</strong><br><span>${escapeHtml(candidate?.title[lang] ?? pp.candidateId)}</span></td>
            <td>${counter}</td>
            <td>${constraint}</td>
            <td>${leak}</td>
            <td>${memory}</td>
          </tr>
        `;
      })
      .join('');
    return html`
      <div class="table-wrap">
        <table>
          <caption class="visually-hidden">${escapeHtml(t(lang, 'persona.propTitle'))}</caption>
          <thead>
            <tr>
              <th scope="col">${escapeHtml(t(lang, 'persona.col.proposal'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'persona.col.counterexample'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'persona.col.constraint'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'persona.col.roleLeak'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'persona.col.memoryRef'))}</th>
            </tr>
          </thead>
          <tbody>
            ${body || `<tr><td colspan="5">—</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  }

  function render(): void {
    const ids = visiblePersonaIds();
    const lowDup = selection.behaviorDiversity === 'LOW' && selection.personaCount > 1;

    root.innerHTML = html`
      <h1>${escapeHtml(t(lang, 'persona.title'))}</h1>
      <p class="lead">${escapeHtml(t(lang, 'persona.lead'))}</p>
      ${badgeHtml(lang, 'SIMULATION')} ${badgeHtml(lang, 'CONCEPT')}

      <div class="lab-toolbar">
        <label>
          ${escapeHtml(t(lang, 'persona.countLabel'))}
          <button type="button" class="btn btn-small" data-action="count-dec" aria-label="-1">−</button>
          <span aria-live="polite" style="min-width: 2ch; text-align:center; display:inline-block;">${selection.personaCount}</span>
          <button type="button" class="btn btn-small" data-action="count-inc" aria-label="+1">＋</button>
        </label>
        <label>
          ${escapeHtml(t(lang, 'persona.diversityLabel'))}
          <select data-action="diversity" aria-label="${escapeHtml(t(lang, 'persona.diversityLabel'))}">
            <option value="LOW" ${selection.behaviorDiversity === 'LOW' ? 'selected' : ''}>${escapeHtml(t(lang, 'persona.diversity.low'))}</option>
            <option value="HIGH" ${selection.behaviorDiversity === 'HIGH' ? 'selected' : ''}>${escapeHtml(t(lang, 'persona.diversity.high'))}</option>
          </select>
        </label>
      </div>

      ${
        lowDup
          ? noticeHtml('notice-warn', null, ['persona.duplicateNote'], lang)
          : ''
      }

      <div class="card-grid card-grid-2">
        ${ids.map((id, i) => personaCard(id, i)).join('')}
      </div>

      <div class="card">
        <h3>${escapeHtml(t(lang, 'persona.scopeNote'))}</h3>
        <p><small>${escapeHtml(t(lang, 'persona.scopeNote'))}</small></p>
        <label for="custom-descriptor">${escapeHtml(t(lang, 'common.optional'))}</label>
        <input
          id="custom-descriptor"
          type="text"
          maxlength="200"
          style="width:100%; font: inherit; padding: .4rem .6rem; border:1px solid var(--line-strong); border-radius: var(--radius); background: var(--surface); color: var(--ink);"
          value="${escapeHtml(customDescriptor)}"
          placeholder="…"
          aria-describedby="custom-note"
        />
        <p id="custom-note" class="visually-hidden">${escapeHtml(t(lang, 'persona.scopeNote'))}</p>
      </div>

      <h2>${escapeHtml(t(lang, 'persona.propTitle'))}</h2>
      ${comparisonTable(ids)}

      <h2>${escapeHtml(t(lang, 'persona.shareTitle'))}</h2>
      <div class="card">
        <button type="button" class="btn" data-action="share">${escapeHtml(t(lang, 'persona.shareTry'))}</button>
        ${
          shareAttempted
            ? html`
                <div class="notice notice-warn" style="margin-top: 1rem;">
                  <span class="notice-title">${escapeHtml(t(lang, 'persona.shareBlocked'))}</span>
                  <p>${escapeHtml(t(lang, 'persona.sharePath'))}</p>
                </div>
              `
            : ''
        }
      </div>
    `;

    bind();
  }

  function bind(): void {
    root.querySelectorAll<HTMLButtonElement>('[data-action="count-inc"]').forEach((b) =>
      b.addEventListener('click', () => setCount(1)),
    );
    root.querySelectorAll<HTMLButtonElement>('[data-action="count-dec"]').forEach((b) =>
      b.addEventListener('click', () => setCount(-1)),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="diversity"]').forEach((s) =>
      s.addEventListener('change', () => setDiversity(s.value as 'LOW' | 'HIGH')),
    );
    root.querySelectorAll<HTMLButtonElement>('[data-action="share"]').forEach((b) =>
      b.addEventListener('click', attemptShare),
    );
    const input = root.querySelector<HTMLInputElement>('#custom-descriptor');
    input?.addEventListener('input', () => onCustomChange(input.value));
    if (input) {
      // keep focus across re-renders
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

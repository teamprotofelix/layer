/**
 * Experiment Lab — C0–C7 comparison and ablations.
 * All numbers are SIMULATION (banner, axis labels, tooltips). The MEASURED
 * area stays empty until reproducible real data exists. No view claims C7
 * is unconditionally best — the datasets deliberately include trade-offs.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import type { ExperimentId, Lang } from '../lib/types';
import { CONDITIONS, DATASETS, conditionById, diffFactors, factorLabel, outcomeKeysFor, type DatasetId } from '../data/experiments';
import { ABLATION_L, ABLATION_L_BASELINE, MOBILITY_OUTCOMES, PERSONA_SWEEP } from '../data/ablation';
import { badgeHtml, noticeHtml } from './helpers';

type Tab = 'main' | 'ablationL' | 'ablationP' | 'ablationM';

export function mountExperimentLab(root: HTMLElement): void {
  let lang: Lang = getLang();
  let tab: Tab = 'main';
  let condA: ExperimentId = 'C0';
  let condB: ExperimentId = 'C7';
  let dataset: DatasetId = 'ds1';

  function setTab(next: Tab): void {
    tab = next;
    render();
    announce(t(lang, `exp.tabs.${next}`));
  }

  function metricCell(labelKey: string, a: number, b: number): string {
    const fmt = (v: number) => (v < 1 ? v.toFixed(2) : String(v));
    const same = a === b;
    return html`
      <div class="metric-cell" title="${escapeHtml(t(lang, 'exp.simBanner'))}">
        <span class="value">${fmt(a)} → ${fmt(b)}</span>
        <span class="label">${escapeHtml(t(lang, labelKey))}</span>
        <span class="${same ? 'diff-same' : 'diff-diff'}" aria-hidden="true">${same ? '=' : '≠'}</span>
      </div>
    `;
  }

  function mainTab(): string {
    const defA = conditionById(condA);
    const defB = conditionById(condB);
    const diffs = diffFactors(defA, defB);
    const outA = DATASETS[dataset][condA];
    const outB = DATASETS[dataset][condB];

    const option = (sel: ExperimentId) =>
      CONDITIONS.map(
        (c) => html`<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.id} · ${escapeHtml(t(lang, c.readingKey))}</option>`,
      ).join('');

    const factorCards = html`
      <div class="compare-grid">
        <div class="compare-card is-selected">
          <h3 style="margin-top:0;">${condA} — ${escapeHtml(t(lang, defA.readingKey))}</h3>
          <p><strong>${escapeHtml(t(lang, 'exp.factor.H'))}</strong>: ${escapeHtml(t(lang, factorLabel('H', defA.h)))}</p>
          <p><strong>${escapeHtml(t(lang, 'exp.factor.P'))}</strong>: ${escapeHtml(t(lang, factorLabel('P', defA.p)))}</p>
          <p><strong>${escapeHtml(t(lang, 'exp.factor.M'))}</strong>: ${escapeHtml(t(lang, factorLabel('M', defA.m)))}</p>
        </div>
        <div class="compare-card is-selected">
          <h3 style="margin-top:0;">${condB} — ${escapeHtml(t(lang, defB.readingKey))}</h3>
          <p><strong>${escapeHtml(t(lang, 'exp.factor.H'))}</strong>: ${escapeHtml(t(lang, factorLabel('H', defB.h)))}</p>
          <p><strong>${escapeHtml(t(lang, 'exp.factor.P'))}</strong>: ${escapeHtml(t(lang, factorLabel('P', defB.p)))}</p>
          <p><strong>${escapeHtml(t(lang, 'exp.factor.M'))}</strong>: ${escapeHtml(t(lang, factorLabel('M', defB.m)))}</p>
        </div>
      </div>
    `;

    const changed = diffs.length
      ? diffs
          .map(
            (d) => html`<li><strong>${escapeHtml(t(lang, `exp.factor.${d.factor}`))}</strong>: ${escapeHtml(t(lang, factorLabel(d.factor, d.from)))} → ${escapeHtml(t(lang, factorLabel(d.factor, d.to)))}</li>`,
          )
          .join('')
      : `<li>— (${escapeHtml(t(lang, 'exp.compare.changed'))}: 없음)</li>`;

    const outcomeKeys = diffs.length > 0 ? diffs.flatMap((d) => outcomeKeysFor(d.factor)) : ['exp.metric.creativeYield'];
    const uniqueOutcomes = [...new Set(outcomeKeys)];

    return html`
      <div class="lab-toolbar">
        <label>${escapeHtml(t(lang, 'exp.pickA'))}
          <select data-action="condA" aria-label="${escapeHtml(t(lang, 'exp.pickA'))}">${option(condA)}</select>
        </label>
        <label>${escapeHtml(t(lang, 'exp.pickB'))}
          <select data-action="condB" aria-label="${escapeHtml(t(lang, 'exp.pickB'))}">${option(condB)}</select>
        </label>
        <label>${escapeHtml(t(lang, 'exp.chartTitle'))}
          <select data-action="dataset" aria-label="dataset">
            <option value="ds1" ${dataset === 'ds1' ? 'selected' : ''}>${escapeHtml(t(lang, 'exp.dataset.1'))}</option>
            <option value="ds2" ${dataset === 'ds2' ? 'selected' : ''}>${escapeHtml(t(lang, 'exp.dataset.2'))}</option>
            <option value="ds3" ${dataset === 'ds3' ? 'selected' : ''}>${escapeHtml(t(lang, 'exp.dataset.3'))}</option>
          </select>
        </label>
      </div>

      ${noticeHtml('notice-sim', 'exp.simBanner', ['exp.noBestNote', 'exp.chartNote'], lang)}

      ${factorCards}

      <div class="card">
        <h3>${escapeHtml(t(lang, 'exp.compare.changed'))}</h3>
        <ul>${changed}</ul>
        <h3>${escapeHtml(t(lang, 'exp.compare.controlled'))}</h3>
        <ul>
          <li>${escapeHtml(t(lang, 'exp.controlledBudget'))}</li>
          <li>${escapeHtml(t(lang, 'exp.controlledTask'))}</li>
          <li>${escapeHtml(t(lang, 'exp.controlledTools'))}</li>
          <li>${escapeHtml(t(lang, 'exp.controlledInfo'))}</li>
        </ul>
        <h3>${escapeHtml(t(lang, 'exp.compare.outcomes'))}</h3>
        <ul>${uniqueOutcomes.map((k) => `<li>${escapeHtml(t(lang, k))}</li>`).join('')}</ul>
        <h3>${escapeHtml(t(lang, 'exp.compare.safety'))}</h3>
        <p>${escapeHtml(t(lang, 'exp.axisNote'))}</p>
      </div>

      <h2>${escapeHtml(t(lang, 'exp.chartTitle'))}</h2>
      <div class="metric-grid">
        ${metricCell('exp.metric.creativeYield', outA.creativeYield, outB.creativeYield)}
        ${metricCell('exp.metric.novelty', outA.novelty, outB.novelty)}
        ${metricCell('exp.metric.constraintOk', outA.constraintOk, outB.constraintOk)}
        ${metricCell('exp.metric.transfer', outA.transfer, outB.transfer)}
        ${metricCell('exp.metric.safety', outA.safetyEvents, outB.safetyEvents)}
        ${metricCell('exp.metric.cost', outA.cost, outB.cost)}
      </div>

      <h2>${escapeHtml(t(lang, 'exp.measuredTitle'))}</h2>
      ${noticeHtml('notice-info', 'common.measuredEmpty', ['exp.measuredEmpty'], lang)}
    `;
  }

  function ablationLTab(): string {
    const rows = ABLATION_L.map((row) => {
      const base = ABLATION_L_BASELINE;
      return html`
        <tr>
          <td>−${row.layer}</td>
          <td>${base.cy.toFixed(2)} → ${row.cy.toFixed(2)}</td>
          <td>${base.novelty.toFixed(2)} → ${row.novelty.toFixed(2)}</td>
          <td>${base.safetyEvents} → ${row.safetyEvents}</td>
          <td>${escapeHtml(t(lang, row.lostKey))}</td>
        </tr>
      `;
    }).join('');
    return html`
      ${noticeHtml('notice-sim', 'exp.simBanner', ['exp.ablationL.note'], lang)}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Layer</th>
              <th scope="col">${escapeHtml(t(lang, 'exp.metric.creativeYield'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'exp.metric.novelty'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'exp.metric.safety'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'common.hint'))}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function ablationPTab(): string {
    const rows = PERSONA_SWEEP.map((row) => html`
      <tr>
        <td>${row.count}</td>
        <td>${escapeHtml(t(lang, row.diversity === 'LOW' ? 'persona.diversity.low' : 'persona.diversity.high'))}</td>
        <td>${row.uniqueProposals}</td>
        <td>${row.cy.toFixed(2)}</td>
      </tr>
    `).join('');
    return html`
      ${noticeHtml('notice-sim', 'exp.simBanner', ['exp.ablationP.note'], lang)}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">${escapeHtml(t(lang, 'persona.countLabel'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'persona.diversityLabel'))}</th>
              <th scope="col">Unique proposals (${escapeHtml(t(lang, 'common.simShort'))})</th>
              <th scope="col">${escapeHtml(t(lang, 'exp.metric.creativeYield'))}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function ablationMTab(): string {
    const rows = MOBILITY_OUTCOMES.map((row) => html`
      <tr>
        <td><strong>${row.mobility}</strong></td>
        <td>${row.hasMovement ? '✓' : '—'}</td>
        <td>${row.hasEnvChange ? '✓' : '—'}</td>
        <td>${row.infoCount}</td>
        <td>${row.movementCost}</td>
        <td>${row.cyDs1.toFixed(2)}</td>
        <td>${row.cyDs3.toFixed(2)}</td>
      </tr>
    `).join('');
    return html`
      ${noticeHtml('notice-sim', 'exp.simBanner', ['exp.ablationM.note'], lang)}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">M</th>
              <th scope="col">Movement</th>
              <th scope="col">Env change</th>
              <th scope="col">Info</th>
              <th scope="col">Move cost</th>
              <th scope="col">${escapeHtml(t(lang, 'exp.dataset.1'))} CY</th>
              <th scope="col">${escapeHtml(t(lang, 'exp.dataset.3'))} CY (M2 = M3)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${noticeHtml('notice-info', 'mob.sameInfoTitle', ['mob.sameInfo'], lang)}
    `;
  }

  function render(): void {
    const tabs = html`
      <div class="tabs" role="tablist" aria-label="${escapeHtml(t(lang, 'exp.title'))}">
        <button type="button" role="tab" aria-selected="${tab === 'main'}" data-action="tab" data-tab="main">${escapeHtml(t(lang, 'exp.tabs.main'))}</button>
        <button type="button" role="tab" aria-selected="${tab === 'ablationL'}" data-action="tab" data-tab="ablationL">${escapeHtml(t(lang, 'exp.tabs.ablationL'))}</button>
        <button type="button" role="tab" aria-selected="${tab === 'ablationP'}" data-action="tab" data-tab="ablationP">${escapeHtml(t(lang, 'exp.tabs.ablationP'))}</button>
        <button type="button" role="tab" aria-selected="${tab === 'ablationM'}" data-action="tab" data-tab="ablationM">${escapeHtml(t(lang, 'exp.tabs.ablationM'))}</button>
      </div>
    `;

    const content = tab === 'main' ? mainTab() : tab === 'ablationL' ? ablationLTab() : tab === 'ablationP' ? ablationPTab() : ablationMTab();

    root.innerHTML = html`
      <h1>${escapeHtml(t(lang, 'exp.title'))}</h1>
      <p class="lead">${escapeHtml(t(lang, 'exp.lead'))}</p>
      <div class="card-title-row">${badgeHtml(lang, 'SIMULATION')} ${badgeHtml(lang, 'CONCEPT')}</div>
      ${tabs}
      <div role="tabpanel">${content}</div>
    `;
    bind();
  }

  function bind(): void {
    root.querySelectorAll<HTMLButtonElement>('[data-action="tab"]').forEach((b) =>
      b.addEventListener('click', () => setTab(b.dataset.tab as Tab)),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="condA"]').forEach((s) =>
      s.addEventListener('change', () => {
        condA = s.value as ExperimentId;
        render();
      }),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="condB"]').forEach((s) =>
      s.addEventListener('change', () => {
        condB = s.value as ExperimentId;
        render();
      }),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="dataset"]').forEach((s) =>
      s.addEventListener('change', () => {
        dataset = s.value as DatasetId;
        render();
      }),
    );
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

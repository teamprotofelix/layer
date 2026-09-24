/**
 * Return Lab — safe return and bounded self-improvement.
 * Two simulated return packets run through the 11-stage pipeline.
 * Packet X carries the research-only fake malicious sentence and stays
 * quarantined; packet G promotes candidates. Approval and rejection can both
 * be operated, but no option bypasses the mandatory gates. Approving the
 * risky L3 candidate fails the regression test and rolls back.
 * The quality-diversity archive keeps candidates with different strengths
 * on a novelty × category grid — not a single-best leaderboard.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import { loadSelection, saveSelection, type LabSelection } from '../lib/store';
import type { HumanDecision, Lang } from '../lib/types';
import { CANDIDATES, candidateById, type CandidateCategory } from '../data/candidates';
import { RETURN_PACKETS, type ReturnPacket } from '../data/returnPackets';
import { runReturnPipeline, riskyCandidateIds, safePacketCandidateIds, type ReturnPipelineResult, type SimStatus } from '../lib/simulate';
import { badgeHtml, noticeHtml, stateBadgeHtml } from './helpers';

const PIPELINE_LABELS = [
  'sim.ret.experience',
  'sim.ret.quarantine',
  'sim.ret.validation',
  'sim.ret.reflection',
  'sim.ret.proposal',
  'sim.ret.sandbox',
  'sim.ret.archive',
  'sim.ret.approval',
  'sim.ret.canary',
  'sim.ret.regression',
  'sim.ret.commit',
];

const GRID_CATEGORIES: CandidateCategory[] = ['provenance', 'counter-evidence', 'recombination', 'constraint-safe'];
const GRID_NOVELTIES = [1, 2, 3, 4, 5] as const;

function statusClass(status: SimStatus): string {
  if (status === 'QUARANTINE') return 'is-quarantine';
  if (status === 'ROLLBACK' || status === 'BLOCKED') return 'is-blocked';
  if (status === 'OK') return 'is-done';
  return '';
}

export function mountReturnLab(root: HTMLElement): void {
  let selection: LabSelection = loadSelection();
  let lang: Lang = getLang();
  let packetId: 'pkt-G' | 'pkt-X' = 'pkt-G';
  let includeRisky = false;
  let decision: HumanDecision | null = null;
  let result: ReturnPipelineResult | null = null;

  function packet(): ReturnPacket {
    return RETURN_PACKETS.find((p) => p.id === packetId) ?? RETURN_PACKETS[0];
  }

  function run(dec: HumanDecision | null): void {
    decision = dec;
    const pkt = packet();
    const extra = includeRisky ? riskyCandidateIds() : [];
    result = runReturnPipeline(
      {
        id: pkt.id,
        observationIds: pkt.observationIds,
        provenanceOk: pkt.provenanceOk,
        containsUntrustedInstruction: pkt.containsUntrustedInstruction,
        candidateIds: pkt.candidateIds.length > 0 ? safePacketCandidateIds() : [],
      },
      dec,
      extra,
    );
    if (dec === 'APPROVE' && result.committedIds.length > 0) {
      selection = {
        ...selection,
        humanDecision: 'APPROVE',
        approvedCandidateIds: [...new Set([...selection.approvedCandidateIds, ...result.committedIds])],
      };
      saveSelection(selection);
    } else if (dec === 'REJECT') {
      selection = { ...selection, humanDecision: 'REJECT' };
      saveSelection(selection);
    }
    render();
    announce(
      result.rolledBackFrom
        ? t(lang, 'sim.detail.rollbackToPrevious')
        : result.committedIds.length > 0
          ? t(lang, 'sim.detail.committed')
          : dec === 'REJECT'
            ? t(lang, 'sim.detail.rejected')
            : t(lang, 'sim.detail.approvalWaiting'),
    );
  }

  function reset(): void {
    decision = null;
    result = null;
    includeRisky = false;
    selection = { ...selection, humanDecision: null, approvedCandidateIds: [] };
    saveSelection(selection);
    render();
    announce(t(lang, 'common.resetAll'));
  }

  function pipelineHtml(result: ReturnPipelineResult): string {
    const stepByStage = new Map(result.steps.map((s) => [s.id, s]));
    const pills = PIPELINE_LABELS.map((labelKey, i) => {
      const stage = labelKey.split('.').pop() ?? '';
      const step = stepByStage.get(stage);
      const cls = step ? statusClass(step.status) : '';
      const title = step
        ? `${escapeHtml(t(lang, step.labelKey))} — ${escapeHtml(t(lang, step.statusKey))}`
        : escapeHtml(t(lang, labelKey));
      return html`<span class="pipeline-step ${cls}" title="${title}">${escapeHtml(t(lang, labelKey))}</span>`;
    }).join('');

    const rows = result.steps
      .map(
        (step) => html`
          <tr>
            <td>${escapeHtml(t(lang, step.labelKey))}</td>
            <td><span class="badge badge-state state-${
              step.status === 'QUARANTINE'
                ? 'QUARANTINED'
                : step.status === 'ROLLBACK' || step.status === 'BLOCKED'
                  ? 'REJECTED'
                  : step.status === 'OK'
                    ? 'APPROVED'
                    : step.status === 'WARN'
                      ? 'QUARANTINED'
                      : 'OBSERVED'
            }">${escapeHtml(t(lang, step.statusKey))}</span></td>
            <td>
              ${step.detailKeys.map((k) => `<p style="margin:0 0 .3rem;">${escapeHtml(t(lang, k))}</p>`).join('')}
              ${
                step.itemIds.length > 0
                  ? `<p style="margin:0; font-family: var(--font-mono); font-size:.78rem; color: var(--ink-faint);">${step.itemIds.map(escapeHtml).join(' · ')}</p>`
                  : ''
              }
            </td>
          </tr>
        `,
      )
      .join('');

    return html`
      <div class="pipeline" aria-label="${escapeHtml(t(lang, 'ret.pipelineTitle'))}">${pills}</div>
      <div class="table-wrap">
        <table>
          <caption class="visually-hidden">${escapeHtml(t(lang, 'ret.pipelineTitle'))}</caption>
          <thead>
            <tr>
              <th scope="col">${escapeHtml(t(lang, 'ret.pipelineTitle'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'common.status'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'common.hint'))}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function archiveHtml(): string {
    const approved = new Set(selection.approvedCandidateIds);
    const rows = GRID_CATEGORIES.map((cat) => {
      const cells = GRID_NOVELTIES.map((n) => {
        const items = CANDIDATES.filter(
          (c) => c.category === cat && c.constraintOk && c.regression !== 'FAIL' && c.novelty === n,
        );
        return html`<div class="archive-cell ${items.length ? 'is-filled' : ''}" data-cell-label="${escapeHtml(t(lang, 'ret.axis.novelty'))} ${n}">
          ${items
            .map((c) => {
              const isApproved = approved.has(c.id);
              return html`<div class="archive-item" style="${isApproved ? 'border-color: var(--green); background: var(--green-soft);' : ''}">
                <span class="visually-hidden">${escapeHtml(t(lang, 'ret.axis.novelty'))} ${n}, ${escapeHtml(t(lang, `cat.${cat}`))}: </span>${escapeHtml(c.title[lang])}${isApproved ? ` ${stateBadgeHtml(lang, 'APPROVED')}` : ''}
              </div>`;
            })
            .join('')}
        </div>`;
      }).join('');
      return html`<span style="font-weight:600;">${escapeHtml(t(lang, `cat.${cat}`))}</span>${cells}`;
    }).join('');
    return html`<div class="archive-grid archive-grid-novelty">
      <span></span>
      ${GRID_NOVELTIES.map((n) => `<span class="archive-axis" style="font-weight:700; text-align:center;">${escapeHtml(t(lang, 'ret.axis.novelty'))} ${n}</span>`).join('')}
      ${rows}
    </div>`;
  }

  function render(): void {
    const pkt = packet();
    const riskyCandidate = candidateById('c-strict-link-filter');

    root.innerHTML = html`
      <h1>${escapeHtml(t(lang, 'ret.title'))}</h1>
      <p class="lead">${escapeHtml(t(lang, 'ret.lead'))}</p>
      <div class="card-title-row">${badgeHtml(lang, 'SIMULATION')}</div>
      ${noticeHtml('notice-info', 'ret.mergeRule', ['ret.selfEvoNote'], lang)}

      <h2>${escapeHtml(t(lang, 'ret.packetTitle'))}</h2>
      <div class="card-grid card-grid-2">
        ${RETURN_PACKETS.map(
          (p) => html`
            <div class="card ${p.id === packetId ? 'is-selected' : ''}">
              <h3 style="margin-top:0;">${escapeHtml(t(lang, p.nameKey))}</h3>
              <p>${escapeHtml(t(lang, p.descKey))}</p>
              ${
                p.id === 'pkt-X'
                  ? html`<div class="notice notice-warn"><span class="notice-title">${escapeHtml(t(lang, 'common.quarantined'))}</span><p>${escapeHtml(t(lang, 'ret.badSentence'))}</p><p>${escapeHtml(t(lang, 'ret.quarantineNotice'))}</p></div>`
                  : ''
              }
              <button type="button" class="btn ${p.id === packetId ? 'btn-primary' : ''}" data-action="select-packet" data-packet="${p.id}">
                ${p.id === packetId ? '✓ ' : ''}${escapeHtml(t(lang, p.nameKey))}
              </button>
            </div>
          `,
        ).join('')}
      </div>

      <div class="lab-toolbar">
        <label style="align-items:flex-start;">
          <input type="checkbox" data-action="risky" ${includeRisky ? 'checked' : ''} />
          <span>${escapeHtml(t(lang, 'ret.regression.trigger'))}</span>
        </label>
      </div>

      <div class="btn-row">
        <button type="button" class="btn btn-primary" data-action="run">▶ ${escapeHtml(t(lang, 'ret.pipelineTitle'))}</button>
        ${
          result
            ? html`
                <button type="button" class="btn" data-action="approve" style="border-color: var(--green); color: var(--green); font-weight: 700;">${escapeHtml(t(lang, 'common.approve'))}</button>
                <button type="button" class="btn" data-action="reject" style="border-color: var(--red); color: var(--red);">${escapeHtml(t(lang, 'common.reject'))}</button>
                <button type="button" class="btn btn-ghost" data-action="reset">${escapeHtml(t(lang, 'common.resetAll'))}</button>
              `
            : ''
        }
      </div>

      ${result ? pipelineHtml(result) : `<p style="color: var(--ink-faint);">${escapeHtml(t(lang, 'ret.decisionNote'))}</p>`}

      ${
        result?.rolledBackFrom
          ? noticeHtml('notice-warn', 'ret.regression.fail', ['ret.rollbackNote'], lang)
          : ''
      }
      ${
        result && decision === 'APPROVE' && result.committedIds.length > 0 && !result.rolledBackFrom
          ? noticeHtml('notice-info', 'sim.detail.regressionPass', ['sim.detail.committed'], lang)
          : ''
      }
      ${
        decision === 'REJECT'
          ? noticeHtml('notice-info', null, ['sim.detail.rejected'], lang)
          : ''
      }

      <h2>${escapeHtml(t(lang, 'ret.archiveTitle'))}</h2>
      <p>${escapeHtml(t(lang, 'ret.archiveNote'))}</p>
      ${archiveHtml()}
    `;

    bind();
  }

  function bind(): void {
    root.querySelectorAll<HTMLButtonElement>('[data-action="select-packet"]').forEach((b) =>
      b.addEventListener('click', () => {
        packetId = b.dataset.packet as 'pkt-G' | 'pkt-X';
        decision = null;
        result = null;
        render();
      }),
    );
    root.querySelectorAll<HTMLInputElement>('[data-action="risky"]').forEach((c) =>
      c.addEventListener('change', () => {
        includeRisky = c.checked;
        decision = null;
        result = null;
        render();
      }),
    );
    root.querySelectorAll<HTMLButtonElement>('[data-action="run"]').forEach((b) => b.addEventListener('click', () => run(null)));
    root.querySelectorAll<HTMLButtonElement>('[data-action="approve"]').forEach((b) => b.addEventListener('click', () => run('APPROVE')));
    root.querySelectorAll<HTMLButtonElement>('[data-action="reject"]').forEach((b) => b.addEventListener('click', () => run('REJECT')));
    root.querySelectorAll<HTMLButtonElement>('[data-action="reset"]').forEach((b) => b.addEventListener('click', reset));
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

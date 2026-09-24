/**
 * Mobility Lab — separate movement from new-information exposure.
 * Depart → Arrive → Return drives a timeline; the Return step runs the
 * deterministic simulator so the same rules as the other labs apply.
 * M0/M1 record no external observations; M2 delivers the same information
 * without movement; M3 travels. M2 and M3 always receive identical info.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import { loadSelection, saveSelection, type LabSelection } from '../lib/store';
import type { EnvironmentId, Mechanism, MobilityId } from '../lib/types';
import { ENVIRONMENTS, OBSERVATION_MAP, environmentById } from '../data/environments';
import { PERSONAS } from '../data/personas';
import { MECHANISM_COSTS } from '../data/ablation';
import {
  buildDemoStudy,
  deriveCondition,
  simulate,
  snapshotId,
  type SimStep,
} from '../lib/simulate';
import { badgeHtml, dotBar, noticeHtml, stateBadgeHtml } from './helpers';

type Phase = 'idle' | 'departed' | 'arrived' | 'returned';

interface TimelineEntry {
  kind: 'snapshot' | 'cap' | 'obs' | 'warn' | 'fail' | 'restore' | 'step';
  textKey?: string;
  itemIds?: string[];
  status?: SimStep['status'];
  statusKey?: string;
}

export function mountMobilityLab(root: HTMLElement): void {
  let selection: LabSelection = loadSelection();
  let lang: ReturnType<typeof getLang> = getLang();
  let phase: Phase = 'idle';
  let timeline: TimelineEntry[] = [];

  function reset(): void {
    phase = 'idle';
    timeline = [];
    render();
    announce(t(lang, 'common.resetAll'));
  }

  function setField<K extends keyof LabSelection>(key: K, value: LabSelection[K]): void {
    if (phase === 'returned' || phase === 'departed' || phase === 'arrived') reset();
    selection = { ...selection, [key]: value };
    saveSelection(selection);
    render();
  }

  function depart(): void {
    if (phase !== 'idle') return;
    phase = 'departed';
    const persona = PERSONAS.find((p) => p.id === selection.personaIds[0]);
    const env = environmentById(selection.environmentId as EnvironmentId) ?? ENVIRONMENTS[0];
    const capBefore = persona?.allowedTools ?? [];
    const beyond = env.availableTools.filter((tool) => !capBefore.includes(tool));
    timeline = [
      {
        kind: 'snapshot',
        textKey: 'mob.ev.snapshot',
        itemIds: [snapshotId(selection.personaIds[0] ?? 'explorer', env.id, selection.mobility as MobilityId, selection.mechanism as Mechanism)],
      },
      { kind: 'cap', textKey: 'mob.ev.capLimit', itemIds: beyond },
    ];
    render();
    announce(t(lang, 'mob.btn.start'));
  }

  function arrive(): void {
    if (phase !== 'departed') return;
    phase = 'arrived';
    const env = environmentById(selection.environmentId as EnvironmentId) ?? ENVIRONMENTS[0];
    const travels = selection.mobility === 'M1' || selection.mobility === 'M3';
    const envChanges = selection.mobility === 'M2' || selection.mobility === 'M3';
    const obsIds = envChanges ? env.observationIds : [];
    const entry: TimelineEntry = travels
      ? { kind: 'obs', textKey: 'mob.ev.observe', itemIds: obsIds }
      : { kind: 'obs', textKey: envChanges ? 'sim.detail.deliveryM2' : 'sim.detail.noEnvChangeM0', itemIds: obsIds };
    timeline = [...timeline, entry];
    if (env.containsUntrustedInput && envChanges) {
      timeline = [...timeline, { kind: 'warn', textKey: 'mob.warning' }];
    }
    render();
    announce(t(lang, 'mob.btn.arrive'));
  }

  function returnHome(): void {
    if (phase !== 'arrived') return;
    phase = 'returned';
    const selectionFull = {
      ...selection,
      environmentId: selection.environmentId as EnvironmentId,
      mobility: selection.mobility as MobilityId,
      mechanism: selection.mechanism as Mechanism,
      condition: deriveCondition(
        selection.layerIds as never[],
        selection.personaIds,
        selection.mobility as MobilityId,
      ),
    };
    const study = buildDemoStudy(selectionFull as Parameters<typeof simulate>[1]);
    const result = simulate(study, selectionFull as Parameters<typeof simulate>[1]);

    const stepEntries: TimelineEntry[] = result.steps.map((step) => ({
      kind: 'step' as const,
      textKey: step.labelKey,
      status: step.status,
      statusKey: step.statusKey,
      itemIds: step.itemIds,
    }));

    // mechanism restore rule (deterministic demonstration)
    if (selection.mechanism === 'MESSAGE') {
      timeline = [...timeline, { kind: 'fail', textKey: 'mob.ev.fail' }, ...stepEntries, { kind: 'restore', textKey: 'mob.ev.restore' }];
    } else {
      timeline = [...timeline, ...stepEntries, { kind: 'restore', textKey: 'mob.ev.restore' }];
    }
    render();
    announce(t(lang, 'mob.btn.return'));
  }

  function entryHtml(entry: TimelineEntry, i: number): string {
    const cls = entry.kind === 'fail' ? 'ev-fail' : entry.kind === 'warn' ? 'ev-warn' : '';
    const items = (entry.itemIds ?? [])
      .map((id) => {
        const obs = OBSERVATION_MAP.get(id);
        if (obs) return html`<div class="archive-item">${escapeHtml(obs.text[lang])}</div>`;
        return html`<span class="timeline-meta">${escapeHtml(id)}</span>`;
      })
      .join(' ');
    const status = entry.status ? ` <span class="badge badge-state state-${entry.status === 'QUARANTINE' ? 'QUARANTINED' : entry.status === 'ROLLBACK' ? 'REJECTED' : entry.status === 'BLOCKED' ? 'REJECTED' : entry.status === 'WARN' ? 'QUARANTINED' : 'CANDIDATE'}">${escapeHtml(t(lang, entry.statusKey ?? 'sim.status.info'))}</span>` : '';
    return html`
      <li class="${cls}">
        <span class="timeline-meta">#${String(i + 1).padStart(2, '0')}</span>
        ${escapeHtml(t(lang, entry.textKey ?? ''))}${status}
        ${items ? `<div class="card-grid" style="margin-top:.4rem;">${items}</div>` : ''}
      </li>
    `;
  }

  function render(): void {
    const env = environmentById(selection.environmentId as EnvironmentId) ?? ENVIRONMENTS[0];
    const travels = selection.mobility === 'M1' || selection.mobility === 'M3';
    const envChanges = selection.mobility === 'M2' || selection.mobility === 'M3';
    const condition = deriveCondition(selection.layerIds as never[], selection.personaIds, selection.mobility as MobilityId);

    const envOptions = ENVIRONMENTS.map(
      (e) =>
        html`<option value="${e.id}" ${e.id === env.id ? 'selected' : ''}>${escapeHtml(t(lang, `mob.env.${e.id}.name`))}</option>`,
    ).join('');

    const mobilityOptions = (['M0', 'M1', 'M2', 'M3'] as MobilityId[])
      .map(
        (m) =>
          html`<option value="${m}" ${m === selection.mobility ? 'selected' : ''}>${escapeHtml(t(lang, `mob.${m}.name`))}</option>`,
      )
      .join('');

    const mechanismOptions = (['MESSAGE', 'CAPSULE', 'CRIU', 'VM'] as Mechanism[])
      .map(
        (mech) =>
          html`<option value="${mech}" ${mech === selection.mechanism ? 'selected' : ''}>${escapeHtml(t(lang, `mob.mech.${mech}.name`))}</option>`,
      )
      .join('');

    const personaOptions = PERSONAS.filter((p) => selection.personaIds.includes(p.id) || selection.personaIds.length === 0)
      .map((p) => html`<option value="${p.id}" ${p.id === selection.personaIds[0] ? 'selected' : ''}>${p.id}</option>`)
      .join('');

    const envFacts = html`
      <p>${escapeHtml(t(lang, `mob.env.${env.id}.desc`))}</p>
      <p>
        ${escapeHtml(t(lang, 'mob.attr.latency'))}:
        <strong>${escapeHtml(t(lang, env.latencyClass === 'LOW' ? 'mob.attr.latencyLow' : 'mob.attr.latencyHigh'))}</strong>
        ·
        ${escapeHtml(t(lang, 'mob.attr.tools'))}: ${env.availableTools.map((x) => `<code>${escapeHtml(x)}</code>`).join(' ')}
        ${
          env.containsUntrustedInput
            ? ` · <span style="color: var(--red); font-weight: 700;">${escapeHtml(t(lang, 'mob.attr.untrusted'))}</span>`
            : ''
        }
      </p>
    `;

    const mobilityCards = (['M0', 'M1', 'M2', 'M3'] as MobilityId[])
      .map(
        (m) => html`
          <div class="card ${m === selection.mobility ? 'is-selected' : ''}" style="padding: .9rem;">
            <h3 style="margin:0 0 .3rem;">${escapeHtml(t(lang, `mob.${m}.name`))}</h3>
            <p style="margin:0 0 .3rem;">${escapeHtml(t(lang, `mob.${m}.desc`))}</p>
            <p style="margin:0; font-size:.85rem; color: var(--ink-faint);">${escapeHtml(t(lang, `mob.${m}.question`))}</p>
          </div>
        `,
      )
      .join('');

    const costTable = html`
      <div class="table-wrap">
        <table>
          <caption class="visually-hidden">${escapeHtml(t(lang, 'mob.costTitle'))}</caption>
          <thead>
            <tr>
              <th scope="col">${escapeHtml(t(lang, 'mob.cost.col.mechanism'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'mob.cost.col.preserve'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'mob.cost.col.cost'))}</th>
              <th scope="col">${escapeHtml(t(lang, 'mob.cost.col.downtime'))}</th>
            </tr>
          </thead>
          <tbody>
            ${MECHANISM_COSTS.map(
              (row) => html`
                <tr>
                  <td><strong>${escapeHtml(t(lang, `mob.mech.${row.mechanism}.name`))}</strong><br><small>${escapeHtml(t(lang, `mob.mech.${row.mechanism}.desc`))}</small></td>
                  <td>${dotBar(row.preservation, 4)}</td>
                  <td>${dotBar(row.cost, 4)}</td>
                  <td>${dotBar(row.downtime, 4)}</td>
                </tr>
              `,
            ).join('')}
          </tbody>
        </table>
      </div>
    `;

    root.innerHTML = html`
      <h1>${escapeHtml(t(lang, 'mob.title'))}</h1>
      <p class="lead">${escapeHtml(t(lang, 'mob.lead'))}</p>
      <div class="card-title-row">
        ${badgeHtml(lang, 'SIMULATION')}
        <span class="badge">${condition}</span>
      </div>
      ${noticeHtml('notice-info', null, ['common.notRealVm', 'mob.mechNote'], lang)}

      <div class="lab-toolbar">
        <label>
          ${escapeHtml(t(lang, 'persona.countLabel')) !== '' ? 'Persona' : 'Persona'}
          <select data-action="persona" aria-label="Persona">${personaOptions}</select>
        </label>
        <label>
          ${escapeHtml(t(lang, 'mob.envTitle'))}
          <select data-action="env" aria-label="${escapeHtml(t(lang, 'mob.envTitle'))}">${envOptions}</select>
        </label>
        <label>
          ${escapeHtml(t(lang, 'mob.mTitle'))}
          <select data-action="mobility" aria-label="${escapeHtml(t(lang, 'mob.mTitle'))}">${mobilityOptions}</select>
        </label>
        <label>
          ${escapeHtml(t(lang, 'mob.mechTitle'))}
          <select data-action="mechanism" aria-label="${escapeHtml(t(lang, 'mob.mechTitle'))}">${mechanismOptions}</select>
        </label>
      </div>

      <div class="card">
        <h3 style="margin-top:0;">${env.id} — ${escapeHtml(t(lang, `mob.env.${env.id}.name`))}</h3>
        ${envFacts}
      </div>

      <h2>${escapeHtml(t(lang, 'mob.mTitle'))}</h2>
      <div class="card-grid card-grid-2">${mobilityCards}</div>

      <h2>${escapeHtml(t(lang, 'mob.mechTitle'))}</h2>
      ${costTable}

      <div class="btn-row">
        <button type="button" class="btn btn-primary" data-action="depart" ${phase !== 'idle' ? 'disabled' : ''}>${escapeHtml(t(lang, 'mob.btn.start'))}</button>
        <button type="button" class="btn" data-action="arrive" ${phase !== 'departed' ? 'disabled' : ''}>${escapeHtml(t(lang, 'mob.btn.arrive'))}</button>
        <button type="button" class="btn" data-action="return" ${phase !== 'arrived' ? 'disabled' : ''}>${escapeHtml(t(lang, 'mob.btn.return'))}</button>
        <button type="button" class="btn btn-ghost" data-action="reset">${escapeHtml(t(lang, 'common.resetAll'))}</button>
      </div>

      <h2>${escapeHtml(t(lang, 'mob.timeline'))}</h2>
      ${
        timeline.length === 0
          ? `<p style="color: var(--ink-faint);">—</p>`
          : `<ol class="timeline">${timeline.map(entryHtml).join('')}</ol>`
      }

      <h2>${escapeHtml(t(lang, 'mob.sameInfoTitle'))}</h2>
      <p>${escapeHtml(t(lang, 'mob.sameInfo'))}</p>

      ${
        env.containsUntrustedInput && envChanges
          ? noticeHtml('notice-warn', 'common.quarantined', ['mob.warning'], lang)
          : ''
      }
    `;

    bind();
  }

  function bind(): void {
    root.querySelectorAll<HTMLSelectElement>('[data-action="env"]').forEach((s) =>
      s.addEventListener('change', () => setField('environmentId', s.value)),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="mobility"]').forEach((s) =>
      s.addEventListener('change', () => setField('mobility', s.value)),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="mechanism"]').forEach((s) =>
      s.addEventListener('change', () => setField('mechanism', s.value)),
    );
    root.querySelectorAll<HTMLSelectElement>('[data-action="persona"]').forEach((s) =>
      s.addEventListener('change', () => setField('personaIds', [s.value])),
    );
    root.querySelectorAll<HTMLButtonElement>('[data-action="depart"]').forEach((b) => b.addEventListener('click', depart));
    root.querySelectorAll<HTMLButtonElement>('[data-action="arrive"]').forEach((b) => b.addEventListener('click', arrive));
    root.querySelectorAll<HTMLButtonElement>('[data-action="return"]').forEach((b) => b.addEventListener('click', returnHome));
    root.querySelectorAll<HTMLButtonElement>('[data-action="reset"]').forEach((b) => b.addEventListener('click', reset));
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

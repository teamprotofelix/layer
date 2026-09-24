/**
 * Layer Lab — conditional activation of L0–L5.
 * Toggling layers changes which pre-written synthetic candidates appear.
 * L3 candidates never become facts automatically; L5 violations are
 * stopped at the output gate; output/memory/tools always show approval gates.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import { loadSelection, saveSelection, type LabSelection } from '../lib/store';
import type { LayerId, Lang } from '../lib/types';
import { LAYERS } from '../data/layers';
import { CREATIVE_TASK } from '../data/task';
import { badgeHtml, noticeHtml } from './helpers';

const ROOT_ID = 'layer-lab';

export function mountLayerLab(root: HTMLElement): void {
  let selection: LabSelection = loadSelection();
  let lang: Lang = getLang();

  function toggle(id: LayerId): void {
    const on = selection.layerIds.includes(id);
    selection = {
      ...selection,
      layerIds: on ? selection.layerIds.filter((l) => l !== id) : [...selection.layerIds, id],
    };
    saveSelection(selection);
    render();
    announce(t(lang, `layer.${id}.name`) + ' — ' + t(lang, on ? 'layer.off' : 'layer.on'));
  }

  function render(): void {
    const on = new Set(selection.layerIds);
    const l2Off = !on.has('L2');
    const l3On = on.has('L3');
    const l5On = on.has('L5');

    const layerRows = LAYERS.map((layer) => {
      const active = on.has(layer.id);
      return html`
        <div class="layer-row ${active ? '' : 'is-off'}">
          <div>
            <button
              type="button"
              class="toggle"
              data-action="toggle"
              data-layer="${layer.id}"
              aria-pressed="${active}"
            >
              <span>${layer.id}</span>
              <span class="toggle-state">${escapeHtml(t(lang, active ? 'layer.on' : 'layer.off'))}</span>
            </button>
          </div>
          <div>
            <h3>${layer.id} ${escapeHtml(t(lang, `layer.${layer.id}.name`))}</h3>
            <p>${escapeHtml(t(lang, `layer.${layer.id}.desc`))}</p>
            <p class="layer-boundary">${escapeHtml(t(lang, `layer.${layer.id}.boundary`))}</p>
          </div>
        </div>
      `;
    }).join('');

    const outputs: string[] = [];
    outputs.push(
      html`<div class="card">
        <p><strong>${escapeHtml(t(lang, 'layer.out.baseline'))}</strong></p>
      </div>`,
    );
    if (l2Off) {
      outputs.push(
        html`<div class="card" style="border-color: var(--red);">
          <p class="diff-diff" role="img" aria-label="failure">✗</p>
          <p>${escapeHtml(t(lang, 'layer.out.lostClues'))}</p>
        </div>`,
      );
    }
    if (l3On) {
      outputs.push(
        html`<div class="card">
          <p>${escapeHtml(t(lang, 'layer.out.hypothesis'))}</p>
          <ul>
            <li>${escapeHtml(t(lang, 'layer.hyp1'))}</li>
            <li>${escapeHtml(t(lang, 'layer.hyp2'))}</li>
            <li>${escapeHtml(t(lang, 'layer.hyp3'))}</li>
          </ul>
          <p><small>${escapeHtml(t(lang, 'layer.factNote'))}</small></p>
        </div>`,
      );
    }
    if (l5On) {
      outputs.push(
        html`<div class="card">
          <p>${escapeHtml(t(lang, 'layer.out.recombine'))}</p>
          <ul>
            <li>${escapeHtml(t(lang, 'layer.recomb1'))}</li>
            <li style="color: var(--red);">${escapeHtml(t(lang, 'layer.recomb2'))}</li>
          </ul>
          <p><strong>${escapeHtml(t(lang, 'layer.out.violation'))}</strong></p>
        </div>`,
      );
    }

    const gates = html`
      <div class="card-grid card-grid-3">
        <div class="card">
          <h3>${escapeHtml(t(lang, 'layer.gate.output'))}</h3>
          <p>${escapeHtml(t(lang, 'layer.gate.outputDesc'))}</p>
        </div>
        <div class="card">
          <h3>${escapeHtml(t(lang, 'layer.gate.memory'))}</h3>
          <p>${escapeHtml(t(lang, 'layer.gate.memoryDesc'))}</p>
        </div>
        <div class="card">
          <h3>${escapeHtml(t(lang, 'layer.gate.tools'))}</h3>
          <p>${escapeHtml(t(lang, 'layer.gate.toolsDesc'))}</p>
        </div>
      </div>
    `;

    root.innerHTML = html`
      <div class="card">
        <div class="card-title-row">
          <h2 style="margin:0;">${escapeHtml(t(lang, 'layer.taskTitle'))}</h2>
          ${badgeHtml(lang, 'SIMULATION')}
        </div>
        <p>${escapeHtml(CREATIVE_TASK.text[lang])}</p>
        <h3>${escapeHtml(t(lang, 'layer.constraintTitle'))}</h3>
        <ul>
          ${CREATIVE_TASK.constraints.map((c) => `<li>${escapeHtml(c.text[lang])}</li>`).join('')}
        </ul>
      </div>

      <h2>${escapeHtml(t(lang, 'layer.toggleTitle'))}</h2>
      <p>${escapeHtml(t(lang, 'layer.lead'))}</p>
      <div class="layer-grid">${layerRows}</div>

      <h2>${escapeHtml(t(lang, 'layer.outTitle'))}</h2>
      <p class="notice notice-info">${escapeHtml(t(lang, 'layer.outMode'))}</p>
      <div class="card-grid">${outputs.join('')}</div>

      <h2>${escapeHtml(t(lang, 'layer.gateTitle'))}</h2>
      <p>${escapeHtml(t(lang, 'layer.gateNote'))}</p>
      ${gates}
    `;

    bind();
  }

  function bind(): void {
    root.querySelectorAll<HTMLButtonElement>('[data-action="toggle"]').forEach((btn) => {
      btn.addEventListener('click', () => toggle(btn.dataset.layer as LayerId));
    });
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

export function hasLayerLabRoot(): boolean {
  return Boolean(document.getElementById(ROOT_ID));
}

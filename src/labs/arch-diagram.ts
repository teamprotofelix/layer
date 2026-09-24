/**
 * Architecture page diagram — an SVG with clickable, keyboard-focusable
 * parts (Ark regions, capsules, environments, quarantine). Selecting a part
 * shows its localized description and boundary. Colors are never the only
 * signal: every part carries a text label.
 */
import { t } from '../i18n';
import { escapeHtml, html } from '../lib/dom';
import { announce, getLang, onLangChange } from '../lib/i18n';
import type { Lang } from '../lib/types';

interface Part {
  id: string;
  titleKey: string;
  descKey: string;
}

const PARTS: Part[] = [
  { id: 'policy', titleKey: 'arch.policy', descKey: 'arch.policyDesc' },
  { id: 'identity', titleKey: 'arch.identity', descKey: 'arch.identityDesc' },
  { id: 'approval', titleKey: 'arch.approval', descKey: 'arch.approvalDesc' },
  { id: 'provenance', titleKey: 'arch.provenance', descKey: 'arch.provenanceDesc' },
  { id: 'capsule', titleKey: 'arch.capsuleTitle', descKey: 'arch.capsuleDesc' },
  { id: 'env', titleKey: 'arch.envTitle', descKey: 'arch.envDesc' },
  { id: 'quarantine', titleKey: 'arch.quarantineTitle', descKey: 'arch.quarantineDesc' },
];

export function mountArchDiagram(root: HTMLElement): void {
  let lang: Lang = getLang();
  let selected = 'policy';

  function select(id: string): void {
    selected = id;
    render();
    const part = PARTS.find((p) => p.id === id);
    if (part) announce(t(lang, part.titleKey));
  }

  function render(): void {
    const active = PARTS.find((p) => p.id === selected) ?? PARTS[0];
    const group = (id: string, label: string, children: string) => html`
      <g
        class="diagram-part"
        role="button"
        tabindex="0"
        data-action="part"
        data-part="${id}"
        aria-pressed="${id === selected}"
        aria-label="${escapeHtml(label)}"
      >
        ${children}
        <title>${escapeHtml(label)}</title>
      </g>
    `;

    const svg = html`
      <svg viewBox="0 0 960 420" role="img" aria-label="${escapeHtml(t(lang, 'arch.title'))}" style="width:100%; height:auto;">
        <!-- Ark Control Plane (outer frame, not clickable itself) -->
        <g>
          <rect x="330" y="70" width="300" height="240" rx="18" fill="var(--teal-soft)" stroke="var(--teal)" stroke-width="2.5"></rect>
          <text x="480" y="100" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">${escapeHtml(t(lang, 'arch.arkTitle'))}</text>
        </g>
        ${group('policy', t(lang, 'arch.policy'), html`<rect x="350" y="115" width="120" height="60" rx="10" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"></rect><text x="410" y="150" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${escapeHtml(t(lang, 'arch.policy'))}</text>`)}
        ${group('identity', t(lang, 'arch.identity'), html`<rect x="490" y="115" width="120" height="60" rx="10" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"></rect><text x="550" y="150" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${escapeHtml(t(lang, 'arch.identity'))}</text>`)}
        ${group('approval', t(lang, 'arch.approval'), html`<rect x="350" y="195" width="120" height="60" rx="10" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"></rect><text x="410" y="230" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${escapeHtml(t(lang, 'arch.approval'))}</text>`)}
        ${group('provenance', t(lang, 'arch.provenance'), html`<rect x="490" y="195" width="120" height="60" rx="10" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"></rect><text x="550" y="230" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${escapeHtml(t(lang, 'arch.provenance'))}</text>`)}
        <!-- Persona Capsules -->
        ${group('capsule', t(lang, 'arch.capsuleTitle'), html`<rect x="60" y="90" width="150" height="110" rx="14" fill="var(--surface)" stroke="var(--teal)" stroke-width="2.5"></rect><text x="135" y="130" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${escapeHtml(t(lang, 'arch.capsuleTitle'))}</text><text x="135" y="150" text-anchor="middle" font-size="11" fill="var(--ink-soft)">goal · memory · tools</text>`)}
        <!-- Environments -->
        ${group('env', t(lang, 'arch.envTitle'), html`<rect x="730" y="90" width="170" height="110" rx="14" fill="var(--surface)" stroke="var(--amber)" stroke-width="2.5" stroke-dasharray="7 5"></rect><text x="815" y="130" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${escapeHtml(t(lang, 'arch.envTitle'))}</text><text x="815" y="150" text-anchor="middle" font-size="11" fill="var(--ink-soft)">A · B · C · D · E</text>`)}
        <!-- Quarantine -->
        ${group('quarantine', t(lang, 'arch.quarantineTitle'), html`<rect x="60" y="250" width="150" height="60" rx="12" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="2"></rect><text x="135" y="285" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${escapeHtml(t(lang, 'arch.quarantineTitle'))}</text>`)}
        <!-- connectors -->
        <path d="M210 145 L330 145" stroke="var(--line-strong)" stroke-width="2" marker-end="url(#arrow)"></path>
        <path d="M630 145 L730 145" stroke="var(--line-strong)" stroke-width="2" marker-end="url(#arrow)"></path>
        <path d="M815 200 L815 240 L135 240 L135 250" stroke="var(--amber)" stroke-width="2" fill="none" stroke-dasharray="6 4"></path>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--line-strong)"></path>
          </marker>
        </defs>
      </svg>
    `;

    root.innerHTML = html`
      <div class="diagram-wrap">${svg}</div>
      <p>${escapeHtml(t(lang, 'arch.clickHint'))}</p>
      <div class="card">
        <h3 style="margin-top:0;">${escapeHtml(t(lang, active.titleKey))}</h3>
        <p>${escapeHtml(t(lang, active.descKey))}</p>
      </div>
    `;
    bind();
  }

  function bind(): void {
    root.querySelectorAll<SVGGElement>('[data-action="part"]').forEach((el) => {
      const select2 = () => select(el.dataset.part ?? 'policy');
      el.addEventListener('click', select2);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select2();
        }
      });
    });
  }

  onLangChange((next) => {
    lang = next;
    render();
  });
  render();
}

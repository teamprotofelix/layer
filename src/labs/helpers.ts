/**
 * Shared rendering helpers for the four labs.
 */
import { t } from '../i18n';
import type { Lang, MemoryState } from '../lib/types';
import { escapeHtml, html } from '../lib/dom';

export function badgeHtml(lang: Lang, state: 'NARRATIVE' | 'CONCEPT' | 'PROTOTYPE' | 'SIMULATION' | 'EXPECTED' | 'MEASURED'): string {
  return html`<span class="badge badge-${state}" title="${escapeHtml(t(lang, `badge.${state}.desc`))}">${escapeHtml(t(lang, `badge.${state}`))}</span>`;
}

export function stateBadgeHtml(lang: Lang, state: MemoryState): string {
  return html`<span class="badge badge-state state-${state}">${escapeHtml(t(lang, `common.state.${state}`))}</span>`;
}

export function noticeHtml(cls: string, titleKey: string | null, textKeys: string[], lang: Lang): string {
  const title = titleKey ? html`<span class="notice-title">${escapeHtml(t(lang, titleKey))}</span>` : '';
  const body = textKeys.map((k) => `<p>${escapeHtml(t(lang, k))}</p>`).join('');
  return html`<div class="notice ${cls}">${title}${body}</div>`;
}

export function simNoticeHtml(lang: Lang): string {
  return noticeHtml('notice-sim', null, ['common.simNotice'], lang);
}

export function fieldListHtml(items: string[]): string {
  return html`<ul class="field-list">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
}

export function dotBar(level: number, max: number): string {
  const dots = Array.from({ length: max }, (_, i) =>
    i < level ? '<span aria-hidden="true">●</span>' : '<span aria-hidden="true">○</span>',
  ).join('');
  return html`<span class="visually-hidden">${level}/${max}</span><span aria-hidden="true">${dots}</span>`;
}

export function labFrame(lang: Lang, titleKey: string, leadKey: string, content: string): string {
  return html`
    <h1>${escapeHtml(t(lang, titleKey))}</h1>
    <p class="lead">${escapeHtml(t(lang, leadKey))}</p>
    ${simNoticeHtml(lang)}
    ${content}
  `;
}

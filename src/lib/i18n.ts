/**
 * Client-side i18n runtime.
 *
 * Language resolution order: `?lang=ko|en|ja` in the URL → saved choice
 * (localStorage) → Korean. Changing the language keeps every lab at its
 * current step: labs re-render on the `astra:lang` event using the same
 * in-memory state.
 */
import { DICTS, ko, isI18nKey } from '../i18n';
import type { Lang } from './types';
import { LANGS } from './types';

const STORAGE_KEY = 'astra.lang';

export function getLang(): Lang {
  try {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param && LANGS.includes(param as Lang)) {
      try {
        window.localStorage.setItem(STORAGE_KEY, param);
      } catch {
        /* storage unavailable — param still wins this visit */
      }
      return param as Lang;
    }
  } catch {
    /* no URL access — continue */
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS.includes(saved as Lang)) return saved as Lang;
  } catch {
    /* storage unavailable — fall through to default */
  }
  return 'ko';
}

export function setLang(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable — still apply for this visit */
  }
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent<{ lang: Lang }>('astra:lang', { detail: { lang } }));
}

/** Re-run after every language change. */
export function onLangChange(callback: (lang: Lang) => void): void {
  window.addEventListener('astra:lang', (event) => {
    callback((event as CustomEvent<{ lang: Lang }>).detail.lang);
  });
}

interface PageMeta {
  titleKey: string;
  descKey?: string;
}

let currentMeta: PageMeta | null = null;

/** Pages register their meta keys so title/description follow the language. */
export function setPageMeta(meta: PageMeta): void {
  currentMeta = meta;
  applyMeta(getLang());
}

function applyMeta(lang: Lang): void {
  if (!currentMeta) return;
  const dict = DICTS[lang] as Record<string, string>;
  const fallback = ko as Record<string, string>;
  const title = dict[currentMeta.titleKey] ?? fallback[currentMeta.titleKey];
  if (title) document.title = title;
  if (currentMeta.descKey) {
    const desc = dict[currentMeta.descKey] ?? fallback[currentMeta.descKey];
    const el = document.querySelector('meta[name="description"]');
    if (desc && el) el.setAttribute('content', desc);
  }
}

/**
 * Apply translations to static markup. Elements carry `data-i18n="key"`
 * (textContent) or `data-i18n-attr="title|key"` (attribute).
 * Korean is authored in the HTML and doubles as the no-JS fallback.
 */
export function applyTranslations(lang: Lang): void {
  const dict = DICTS[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key || !isI18nKey(key)) return;
    const value = (dict as Record<string, string>)[key] ?? (ko as Record<string, string>)[key];
    if (typeof value === 'string' && value !== '') el.textContent = value;
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    const spec = el.dataset.i18nAttr;
    if (!spec) return;
    const separator = spec.indexOf('|');
    const attr = separator === -1 ? spec : spec.slice(0, separator);
    const key = separator === -1 ? '' : spec.slice(separator + 1);
    if (!key || !isI18nKey(key)) return;
    const value = (dict as Record<string, string>)[key] ?? (ko as Record<string, string>)[key];
    if (typeof value === 'string') el.setAttribute(attr, value);
  });

  applyMeta(lang);
}

/** Bootstrap i18n on every page: set lang + apply translations + react to changes. */
export function initI18n(): void {
  const lang = getLang();
  applyTranslations(lang);
  onLangChange((next) => applyTranslations(next));
}

export function announce(text: string): void {
  const region = document.getElementById('astra-announcer');
  if (region) region.textContent = text;
}

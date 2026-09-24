/**
 * Dictionary registry. `ko` is the source of truth for keys; en/ja must match
 * exactly (compile-time via `satisfies` + runtime via scripts/check-i18n.mjs).
 */
import { ko } from './ko';
import { en } from './en';
import { ja } from './ja';
import type { Lang } from '../lib/types';

export { ko } from './ko';
export type { KoShape } from './ko';
export type Dict = typeof ko;
export type I18nKey = keyof Dict;

export const DICTS: Record<Lang, Dict> = { ko, en, ja };

/**
 * Translate a key. Accepts the literal key union (compile-checked at call
 * sites) as well as dynamic keys built at runtime; dictionary completeness
 * across languages is enforced by `npm run check:i18n` and the i18n tests,
 * and any unknown key falls back to Korean, then to the key itself.
 */
export function t(lang: Lang, key: I18nKey | (string & {})): string {
  const dict = DICTS[lang] as Record<string, string>;
  const fallback = ko as Record<string, string>;
  const value = dict[key] ?? fallback[key];
  return typeof value === 'string' && value !== '' ? value : key;
}

/** Escape a key for use in data-i18n attributes (keys contain only safe chars). */
export function isI18nKey(key: string): key is I18nKey {
  return key in ko;
}

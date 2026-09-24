/**
 * Client-side theme runtime.
 *
 * Choice: system | light | dark. `system` follows the OS immediately when the
 * OS setting changes. The pre-paint inline script in the layout already set
 * the initial attributes; this module handles the picker and OS watching.
 * `data-theme-choice` keeps the user's choice, `data-resolved-theme` carries
 * the actually applied light/dark value used by CSS.
 */
import type { ResolvedTheme, ThemeChoice } from './types';

const STORAGE_KEY = 'astra.theme';

function mediaQuery(): MediaQueryList | null {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  if (choice === 'light' || choice === 'dark') return choice;
  return mediaQuery()?.matches ? 'dark' : 'light';
}

export function getThemeChoice(): ThemeChoice {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'system' || saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

export function applyTheme(choice: ThemeChoice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage unavailable — still apply for this visit */
  }
  document.documentElement.setAttribute('data-theme-choice', choice);
  document.documentElement.setAttribute('data-resolved-theme', resolveTheme(choice));
}

/** Watch the OS theme so `system` follows changes immediately. */
export function watchSystemTheme(): void {
  const mq = mediaQuery();
  if (!mq || typeof mq.addEventListener !== 'function') return;
  mq.addEventListener('change', () => {
    if (getThemeChoice() === 'system') {
      document.documentElement.setAttribute('data-resolved-theme', resolveTheme('system'));
    }
  });
}

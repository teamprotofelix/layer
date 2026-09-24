/**
 * Wires up the global chrome: mobile nav toggle, theme buttons,
 * language select. Called once per page from the layout script.
 */
import { applyTheme, getThemeChoice, resolveTheme } from './theme';
import { getLang, setLang } from './i18n';
import type { Lang, ResolvedTheme, ThemeChoice } from './types';
import { DICTS } from '../i18n';

function updateThemeButtons(): void {
  const choice = getThemeChoice();
  const resolved: ResolvedTheme = resolveTheme(choice);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-choice-btn]').forEach((btn) => {
    const value = btn.dataset.themeChoiceBtn as ThemeChoice;
    const pressed = value === choice;
    btn.setAttribute('aria-pressed', String(pressed));
    const dot = btn.querySelector<HTMLElement>('.theme-dot');
    if (dot) {
      dot.className = `theme-dot ${resolved}`;
    }
  });
}

function updateLangSelect(): void {
  const select = document.getElementById('lang-select') as HTMLSelectElement | null;
  if (select) select.value = getLang();
}

export function wireChrome(): void {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const labels = DICTS[getLang()];
    const updateToggle = (open: boolean) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? labels['nav.menuClose'] : labels['nav.menuToggle']);
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => {
      updateToggle(!nav.classList.contains('is-open'));
    });
    document.addEventListener('astra:lang', () => {
      updateToggle(nav.classList.contains('is-open'));
    });
  }

  // Theme buttons
  document.querySelectorAll<HTMLButtonElement>('[data-theme-choice-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.themeChoiceBtn as ThemeChoice;
      if (value === 'system' || value === 'light' || value === 'dark') {
        applyTheme(value);
        updateThemeButtons();
      }
    });
  });

  // Language select
  const select = document.getElementById('lang-select') as HTMLSelectElement | null;
  select?.addEventListener('change', () => {
    const value = select.value;
    if (value === 'ko' || value === 'en' || value === 'ja') setLang(value as Lang);
  });

  updateThemeButtons();
  updateLangSelect();
  document.addEventListener('astra:lang', updateLangSelect);
}

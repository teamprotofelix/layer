import { describe, expect, it } from 'vitest';
import { ko } from '../src/i18n/ko';
import { en } from '../src/i18n/en';
import { ja } from '../src/i18n/ja';
import { DICTS, t } from '../src/i18n';
import { LANGS, type Localized } from '../src/lib/types';
import { CREATIVE_TASK } from '../src/data/task';
import { CANDIDATES } from '../src/data/candidates';
import { OBSERVATIONS } from '../src/data/environments';
import { GLOSSARY } from '../src/data/glossary';
import { PERSONA_TEXTS, PERSONA_MEMORY_NOTES, PERSONA_PROPOSALS } from '../src/data/personas';

describe('i18n — key parity', () => {
  it('en and ja contain exactly the keys of ko', () => {
    const koKeys = new Set(Object.keys(ko));
    const enKeys = new Set(Object.keys(en));
    const jaKeys = new Set(Object.keys(ja));
    expect([...koKeys].filter((k) => !enKeys.has(k))).toEqual([]);
    expect([...koKeys].filter((k) => !jaKeys.has(k))).toEqual([]);
    expect([...enKeys].filter((k) => !koKeys.has(k))).toEqual([]);
    expect([...jaKeys].filter((k) => !koKeys.has(k))).toEqual([]);
  });

  it('has no empty translation values', () => {
    for (const lang of LANGS) {
      const dict = DICTS[lang];
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim().length, `${lang}:${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps code/experiment IDs untranslated', () => {
    for (const lang of LANGS) {
      expect(t(lang, 'layer.L3.name')).toContain('L3');
      expect(t(lang, 'mob.M2.name')).toContain('M2');
      expect(t(lang, 'research.terms.experiment')).toContain('C0–C7');
      expect(t(lang, 'research.terms.mobility')).toContain('M0–M3');
    }
  });

  it('translates the mandated strings', () => {
    expect(t('ko', 'home.h1')).toBe('여행하는 페르소나는 더 유용한 아이디어를 만들까?');
    expect(t('en', 'home.h1')).toBe('Can traveling personas produce more useful ideas?');
    expect(t('ja', 'home.h1')).toBe('旅するペルソナは、より役立つアイデアを生み出せるか');
    expect(t('en', 'common.quarantined')).toBe('External material was quarantined');
    expect(t('en', 'common.approvalNeeded')).toBe('Human approval required');
  });
});

function assertLocalized(value: unknown, label: string): void {
  expect(value, label).toBeTypeOf('object');
  const record = value as Localized<string>;
  for (const lang of LANGS) {
    expect(typeof record[lang], `${label}.${lang}`).toBe('string');
    expect((record[lang] as string).trim().length, `${label}.${lang}`).toBeGreaterThan(0);
  }
}

describe('i18n — localized data completeness', () => {
  it('task texts and constraints are complete in all languages', () => {
    assertLocalized(CREATIVE_TASK.text, 'task.text');
    CREATIVE_TASK.constraints.forEach((c) => assertLocalized(c.text, `constraint ${c.id}`));
  });

  it('candidate titles are complete in all languages', () => {
    CANDIDATES.forEach((c) => assertLocalized(c.title, `candidate ${c.id}`));
  });

  it('observation texts are complete in all languages', () => {
    OBSERVATIONS.forEach((o) => assertLocalized(o.text, `observation ${o.id}`));
  });

  it('glossary names are complete in all languages', () => {
    GLOSSARY.forEach((g) => assertLocalized(g.name, `glossary ${g.id}`));
  });

  it('persona texts are complete in all languages', () => {
    for (const [key, texts] of Object.entries(PERSONA_TEXTS)) {
      assertLocalized(texts, `personaText ${key}`);
    }
    for (const [key, note] of Object.entries(PERSONA_MEMORY_NOTES)) {
      assertLocalized(note, `memoryNote ${key}`);
    }
    PERSONA_PROPOSALS.forEach((p) => {
      if (p.counterexample) assertLocalized(p.counterexample.text, `counterexample ${p.id}`);
    });
  });
});

describe('i18n — evidence labels', () => {
  it('every evidence state has a badge and description', () => {
    for (const state of ['NARRATIVE', 'CONCEPT', 'PROTOTYPE', 'SIMULATION', 'EXPECTED', 'MEASURED']) {
      for (const lang of LANGS) {
        expect(t(lang, `badge.${state}`).length).toBeGreaterThan(0);
        expect(t(lang, `badge.${state}.desc`).length).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * The paper's 2×2×2 factorial design C0–C7, exactly as specified, plus
 * deliberately fictional outcome datasets. Values are SIMULATION only;
 * datasets intentionally include trade-offs and failures — no dataset
 * claims C7 is unconditionally best.
 */
import type { ExperimentId } from '../lib/types';

export interface ConditionDef {
  id: ExperimentId;
  h: 'FLAT' | 'HIER';
  p: 'SINGLE' | 'MULTI';
  m: 'STATIONARY' | 'MOBILE';
  /** "읽는 방법" — i18n key */
  readingKey: string;
}

export const CONDITIONS: ConditionDef[] = [
  { id: 'C0', h: 'FLAT', p: 'SINGLE', m: 'STATIONARY', readingKey: 'exp.C0' },
  { id: 'C1', h: 'HIER', p: 'SINGLE', m: 'STATIONARY', readingKey: 'exp.C1' },
  { id: 'C2', h: 'FLAT', p: 'MULTI', m: 'STATIONARY', readingKey: 'exp.C2' },
  { id: 'C3', h: 'HIER', p: 'MULTI', m: 'STATIONARY', readingKey: 'exp.C3' },
  { id: 'C4', h: 'FLAT', p: 'SINGLE', m: 'MOBILE', readingKey: 'exp.C4' },
  { id: 'C5', h: 'HIER', p: 'SINGLE', m: 'MOBILE', readingKey: 'exp.C5' },
  { id: 'C6', h: 'FLAT', p: 'MULTI', m: 'MOBILE', readingKey: 'exp.C6' },
  { id: 'C7', h: 'HIER', p: 'MULTI', m: 'MOBILE', readingKey: 'exp.C7' },
];

export function conditionById(id: ExperimentId): ConditionDef {
  return CONDITIONS.find((c) => c.id === id) ?? CONDITIONS[0];
}

export interface ConditionOutcome {
  /** Creative Yield (share of novel AND useful proposals), 0–1 */
  creativeYield: number;
  /** mean novelty, 1–5 */
  novelty: number;
  /** constraint compliance rate, 0–1 */
  constraintOk: number;
  /** unseen-task transfer, 0–1 */
  transfer: number;
  /** fictional safety events per run */
  safetyEvents: number;
  /** relative compute cost */
  cost: number;
}

export type DatasetId = 'ds1' | 'ds2' | 'ds3';

export const DATASETS: Record<DatasetId, Record<ExperimentId, ConditionOutcome>> = {
  ds1: {
    C0: { creativeYield: 0.3, novelty: 2.1, constraintOk: 0.92, transfer: 0.3, safetyEvents: 0, cost: 10 },
    C1: { creativeYield: 0.4, novelty: 2.6, constraintOk: 0.94, transfer: 0.38, safetyEvents: 0, cost: 24 },
    C2: { creativeYield: 0.46, novelty: 3.2, constraintOk: 0.88, transfer: 0.44, safetyEvents: 1, cost: 30 },
    C3: { creativeYield: 0.52, novelty: 3.5, constraintOk: 0.93, transfer: 0.5, safetyEvents: 1, cost: 45 },
    C4: { creativeYield: 0.38, novelty: 2.4, constraintOk: 0.9, transfer: 0.4, safetyEvents: 0, cost: 30 },
    C5: { creativeYield: 0.5, novelty: 3.0, constraintOk: 0.92, transfer: 0.48, safetyEvents: 1, cost: 52 },
    C6: { creativeYield: 0.6, novelty: 3.9, constraintOk: 0.85, transfer: 0.56, safetyEvents: 2, cost: 92 },
    C7: { creativeYield: 0.62, novelty: 4.1, constraintOk: 0.9, transfer: 0.6, safetyEvents: 3, cost: 100 },
  },
  ds2: {
    C0: { creativeYield: 0.28, novelty: 2.0, constraintOk: 0.9, transfer: 0.28, safetyEvents: 0, cost: 10 },
    C1: { creativeYield: 0.38, novelty: 2.5, constraintOk: 0.93, transfer: 0.36, safetyEvents: 0, cost: 24 },
    C2: { creativeYield: 0.44, novelty: 3.0, constraintOk: 0.86, transfer: 0.42, safetyEvents: 1, cost: 30 },
    C3: { creativeYield: 0.5, novelty: 3.3, constraintOk: 0.91, transfer: 0.48, safetyEvents: 1, cost: 45 },
    C4: { creativeYield: 0.32, novelty: 2.2, constraintOk: 0.88, transfer: 0.34, safetyEvents: 1, cost: 30 },
    C5: { creativeYield: 0.44, novelty: 2.8, constraintOk: 0.9, transfer: 0.42, safetyEvents: 1, cost: 52 },
    C6: { creativeYield: 0.42, novelty: 3.4, constraintOk: 0.8, transfer: 0.4, safetyEvents: 3, cost: 92 },
    C7: { creativeYield: 0.44, novelty: 3.5, constraintOk: 0.82, transfer: 0.42, safetyEvents: 4, cost: 100 },
  },
  ds3: {
    C0: { creativeYield: 0.3, novelty: 2.1, constraintOk: 0.92, transfer: 0.3, safetyEvents: 0, cost: 10 },
    C1: { creativeYield: 0.4, novelty: 2.6, constraintOk: 0.94, transfer: 0.38, safetyEvents: 0, cost: 24 },
    C2: { creativeYield: 0.46, novelty: 3.2, constraintOk: 0.88, transfer: 0.44, safetyEvents: 1, cost: 30 },
    C3: { creativeYield: 0.52, novelty: 3.5, constraintOk: 0.93, transfer: 0.5, safetyEvents: 1, cost: 45 },
    C4: { creativeYield: 0.46, novelty: 3.2, constraintOk: 0.88, transfer: 0.44, safetyEvents: 1, cost: 30 },
    C5: { creativeYield: 0.52, novelty: 3.5, constraintOk: 0.93, transfer: 0.5, safetyEvents: 1, cost: 45 },
    C6: { creativeYield: 0.6, novelty: 3.9, constraintOk: 0.85, transfer: 0.56, safetyEvents: 2, cost: 92 },
    C7: { creativeYield: 0.62, novelty: 4.1, constraintOk: 0.9, transfer: 0.6, safetyEvents: 3, cost: 100 },
  },
};

export const DATASET_NAMES: Record<DatasetId, { key: string; note: string }> = {
  ds1: { key: 'exp.dataset.1', note: '' },
  ds2: { key: 'exp.dataset.2', note: '' },
  ds3: { key: 'exp.dataset.3', note: '' },
};

/**
 * ds3 makes M2-equal-to-M3 explicit: C4 (mobile single) equals C2 (stationary
 * multi) and C5 equals C3 — the same information lands with or without
 * movement, teaching the "exposure explains it" reading.
 */

/** Factors that differ between two conditions (for the comparison view). */
export function diffFactors(a: ConditionDef, b: ConditionDef): { factor: 'H' | 'P' | 'M'; from: string; to: string }[] {
  const diffs: { factor: 'H' | 'P' | 'M'; from: string; to: string }[] = [];
  if (a.h !== b.h) diffs.push({ factor: 'H', from: a.h, to: b.h });
  if (a.p !== b.p) diffs.push({ factor: 'P', from: a.p, to: b.p });
  if (a.m !== b.m) diffs.push({ factor: 'M', from: a.m, to: b.m });
  return diffs;
}

export function factorLabel(factor: 'H' | 'P' | 'M', level: string): string {
  if (factor === 'H') return level === 'FLAT' ? 'exp.level.flat' : 'exp.level.hierarchical';
  if (factor === 'P') return level === 'SINGLE' ? 'exp.level.single' : 'exp.level.multi';
  return level === 'STATIONARY' ? 'exp.level.stationary' : 'exp.level.mobile';
}

/** Related outcome variables for a changed factor. */
export function outcomeKeysFor(factor: 'H' | 'P' | 'M'): string[] {
  switch (factor) {
    case 'H':
      return ['exp.metric.creativeYield', 'exp.metric.constraintOk'];
    case 'P':
      return ['exp.metric.novelty', 'exp.metric.creativeYield'];
    case 'M':
      return ['exp.metric.transfer', 'exp.metric.creativeYield'];
  }
}

/** Safety/cost variables relevant to a changed factor. */
export function safetyKeysFor(factor: 'H' | 'P' | 'M'): string[] {
  switch (factor) {
    case 'H':
      return ['exp.metric.safety', 'exp.metric.cost'];
    case 'P':
      return ['exp.metric.safety', 'exp.metric.cost'];
    case 'M':
      return ['exp.metric.safety', 'exp.metric.cost'];
  }
}

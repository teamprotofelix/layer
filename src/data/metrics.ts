/**
 * Metric catalogue for /method/. Names and the six fields (정의 → 필요한
 * 원자료 → 대조군 → 실패 기준 → 누가 평가하는가 → 현재 증거 상태) are i18n
 * keys: meth.metric.<id>, meth.metric.<id>.def/.raw/.ctrl/.fail,
 * meth.who.expert, badge.EXPECTED. No measured values are filled in.
 */
import type { EvidenceState } from '../lib/types';

export interface MetricDemo {
  id: string;
  state: EvidenceState;
  whoKey: string;
}

export const METRICS: MetricDemo[] = [
  { id: 'creativeYield', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'novelty', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'drift', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'memoryMismatch', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'unseenTransfer', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'archiveCoverage', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'negativeTransfer', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'rollback', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'migrationSuccess', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'unauthorizedTool', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'contaminatedMerge', state: 'EXPECTED', whoKey: 'meth.who.expert' },
  { id: 'computeCost', state: 'EXPECTED', whoKey: 'meth.who.expert' },
];

/** The minimum evidence a future MEASURED result card must carry. */
export const MEASURED_REQUIREMENTS: string[] = [
  'meth.required.expId',
  'meth.required.baseline',
  'meth.required.dataVersion',
  'meth.required.seed',
  'meth.required.model',
  'meth.required.config',
  'meth.required.mechanism',
  'meth.required.env',
  'meth.required.n',
  'meth.required.metric',
  'meth.required.expertEval',
  'meth.required.ci',
  'meth.required.failures',
  'meth.required.cost',
  'meth.required.repro',
];

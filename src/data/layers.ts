/**
 * L0–L5 functional layers. Names, descriptions, and permission boundaries
 * live in the i18n dictionaries (layer.L0.name / .desc / .boundary).
 * This file only carries structural facts for the simulator.
 */
import type { LayerId } from '../lib/types';

export interface LayerDemo {
  id: LayerId;
  /** true = the task needs this layer by default */
  defaultOn: boolean;
  /** candidate ids this layer contributes when enabled */
  contributes: string[];
  /** what is lost when the layer is off (i18n key) */
  offEffectKey: string;
}

export const LAYERS: LayerDemo[] = [
  { id: 'L0', defaultOn: true, contributes: ['c-pending-label'], offEffectKey: 'layer.out.baseline' },
  { id: 'L1', defaultOn: true, contributes: [], offEffectKey: 'layer.out.baseline' },
  { id: 'L2', defaultOn: true, contributes: ['c-pending-label'], offEffectKey: 'layer.out.lostClues' },
  { id: 'L3', defaultOn: true, contributes: ['c-strict-link-filter', 'c-hyp-cap', 'c-appendix'], offEffectKey: 'layer.out.hypothesis' },
  { id: 'L4', defaultOn: true, contributes: ['c-review-queue'], offEffectKey: 'layer.out.baseline' },
  { id: 'L5', defaultOn: true, contributes: ['c-cross-lab-recombine', 'c-unverified-first'], offEffectKey: 'layer.out.recombine' },
];

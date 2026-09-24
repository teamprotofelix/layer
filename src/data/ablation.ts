/**
 * Ablation demonstration data: –L1…–L5, persona count sweep, M0–M3.
 * All values are SIMULATION and include deliberate trade-offs.
 */
import type { LayerId, MobilityId } from '../lib/types';

export interface AblationL {
  layer: LayerId;
  /** fictional Creative Yield when C7 runs without this layer */
  cy: number;
  /** fictional mean novelty without this layer */
  novelty: number;
  /** fictional safety events without this layer */
  safetyEvents: number;
  /** i18n key describing what is lost */
  lostKey: string;
}

export const ABLATION_L: AblationL[] = [
  { layer: 'L1', cy: 0.58, novelty: 4.05, safetyEvents: 3, lostKey: 'exp.ablationL.l1' },
  { layer: 'L2', cy: 0.5, novelty: 3.9, safetyEvents: 3, lostKey: 'exp.ablationL.l2' },
  { layer: 'L3', cy: 0.52, novelty: 3.3, safetyEvents: 3, lostKey: 'exp.ablationL.l3' },
  { layer: 'L4', cy: 0.5, novelty: 4.0, safetyEvents: 4, lostKey: 'exp.ablationL.l4' },
  { layer: 'L5', cy: 0.58, novelty: 3.2, safetyEvents: 2, lostKey: 'exp.ablationL.l5' },
];

export const ABLATION_L_BASELINE = { cy: 0.62, novelty: 4.1, safetyEvents: 3 };

export interface PersonaSweep {
  count: number;
  diversity: 'LOW' | 'HIGH';
  /** fictional number of unique proposals */
  uniqueProposals: number;
  cy: number;
}

export const PERSONA_SWEEP: PersonaSweep[] = [
  { count: 1, diversity: 'LOW', uniqueProposals: 4, cy: 0.4 },
  { count: 1, diversity: 'HIGH', uniqueProposals: 4, cy: 0.4 },
  { count: 2, diversity: 'LOW', uniqueProposals: 4, cy: 0.4 },
  { count: 2, diversity: 'HIGH', uniqueProposals: 7, cy: 0.5 },
  { count: 4, diversity: 'LOW', uniqueProposals: 5, cy: 0.42 },
  { count: 4, diversity: 'HIGH', uniqueProposals: 9, cy: 0.56 },
  { count: 8, diversity: 'LOW', uniqueProposals: 5, cy: 0.42 },
  { count: 8, diversity: 'HIGH', uniqueProposals: 9, cy: 0.57 },
];

export interface MobilityOutcome {
  mobility: MobilityId;
  hasMovement: boolean;
  hasEnvChange: boolean;
  /** fictional observations received (M2 == M3 by design) */
  infoCount: number;
  /** fictional migration cost (movement only) */
  movementCost: number;
  /** dataset1-style Creative Yield (M3 slightly above M2) */
  cyDs1: number;
  /** dataset3-style Creative Yield (M2 == M3 — exposure explains it) */
  cyDs3: number;
}

export const MOBILITY_OUTCOMES: MobilityOutcome[] = [
  { mobility: 'M0', hasMovement: false, hasEnvChange: false, infoCount: 2, movementCost: 0, cyDs1: 0.3, cyDs3: 0.3 },
  { mobility: 'M1', hasMovement: true, hasEnvChange: false, infoCount: 2, movementCost: 12, cyDs1: 0.3, cyDs3: 0.3 },
  { mobility: 'M2', hasMovement: false, hasEnvChange: true, infoCount: 8, movementCost: 0, cyDs1: 0.52, cyDs3: 0.52 },
  { mobility: 'M3', hasMovement: true, hasEnvChange: true, infoCount: 8, movementCost: 18, cyDs1: 0.55, cyDs3: 0.52 },
];

/** Mechanism cost table for the Mobility Lab. */
export interface MechanismCost {
  mechanism: 'MESSAGE' | 'CAPSULE' | 'CRIU' | 'VM';
  preservation: 1 | 2 | 3 | 4;
  cost: 1 | 2 | 3 | 4;
  downtime: 1 | 2 | 3 | 4;
}

export const MECHANISM_COSTS: MechanismCost[] = [
  { mechanism: 'MESSAGE', preservation: 1, cost: 1, downtime: 1 },
  { mechanism: 'CAPSULE', preservation: 2, cost: 2, downtime: 2 },
  { mechanism: 'CRIU', preservation: 3, cost: 3, downtime: 3 },
  { mechanism: 'VM', preservation: 4, cost: 4, downtime: 4 },
];

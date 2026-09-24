/**
 * Core shared types for the Astra research experience site.
 * Evidence states are shown to visitors everywhere; the paper does not
 * present measured performance results, so no synthetic value may ever be
 * labelled MEASURED.
 */
export type Lang = 'ko' | 'en' | 'ja';
export const LANGS: Lang[] = ['ko', 'en', 'ja'];

export type Localized<T> = Record<Lang, T>;
export type LocalizedString = Localized<string>;

export type EvidenceState =
  | 'NARRATIVE' // ark worldview
  | 'CONCEPT' // research design
  | 'PROTOTYPE' // demonstrable pieces of technology
  | 'SIMULATION' // this website's synthetic model
  | 'EXPECTED' // hypothesis to be verified
  | 'MEASURED'; // results with experiment, sources, reproduction

export type LayerId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export const LAYER_IDS: LayerId[] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];

export type MobilityId = 'M0' | 'M1' | 'M2' | 'M3';
export const MOBILITY_IDS: MobilityId[] = ['M0', 'M1', 'M2', 'M3'];

export type ExperimentId = 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';
export const EXPERIMENT_IDS: ExperimentId[] = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];

export type MemoryState = 'OBSERVED' | 'QUARANTINED' | 'CANDIDATE' | 'APPROVED' | 'REJECTED';

export type EnvironmentId = 'A' | 'B' | 'C' | 'D' | 'E';
export const ENVIRONMENT_IDS: EnvironmentId[] = ['A', 'B', 'C', 'D', 'E'];

export type Mechanism = 'MESSAGE' | 'CAPSULE' | 'CRIU' | 'VM';
export const MECHANISMS: Mechanism[] = ['MESSAGE', 'CAPSULE', 'CRIU', 'VM'];

export type HumanDecision = 'APPROVE' | 'REJECT';

export interface PersonaCapsuleDemo {
  id: string;
  goalScopeKey: string;
  behaviorDescriptor: string[];
  memoryNamespace: string;
  allowedTools: string[];
  riskBudget: number;
  currentTaskState: string;
  version: string;
}

export interface ObservationDemo {
  id: string;
  provenanceId: string;
  conflictsWithHome?: boolean;
  containsUntrustedInstruction?: boolean;
}

export interface EnvironmentDemo {
  id: EnvironmentId;
  observationIds: string[];
  availableTools: string[];
  latencyClass: 'LOW' | 'HIGH';
  containsUntrustedInput: boolean;
}

export interface TravelTrace {
  personaId: string;
  sourceId: string;
  targetId: string;
  mobility: MobilityId;
  mechanism: Mechanism;
  snapshotId: string;
  capabilityBefore: string[];
  capabilityAfter: string[];
  observations: { id: string; provenanceId: string; state: MemoryState }[];
  humanDecision?: HumanDecision;
  rollback?: boolean;
}

export interface DemoStudy {
  fictional: true;
  evidenceState: 'SIMULATION';
  condition: ExperimentId;
  mobility: MobilityId;
  layerIds: LayerId[];
  personas: PersonaCapsuleDemo[];
  environments: EnvironmentDemo[];
  trace: TravelTrace[];
  candidateIds: string[];
}

/** Theme choice; `system` follows the OS and updates immediately on change. */
export type ThemeChoice = 'system' | 'light' | 'dark';

/** Resolved theme actually applied to the page. */
export type ResolvedTheme = 'light' | 'dark';

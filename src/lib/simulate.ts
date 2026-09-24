/**
 * Deterministic simulator for the labs. Pure functions: the same input
 * always produces the same output. Execution order follows the plan:
 *
 *   조건 확인 → 권한 상한 검사 → 환경 관찰 → 출처 기록 → 불신 입력 격리 →
 *   후보 평가 → 인간 승인 → 회귀검사 → archive 반영 또는 rollback
 *
 * Results are assembled by selecting, filtering, and aggregating pre-written
 * synthetic candidates and observations. No network, no VM, no randomness
 * (a seeded PRNG exists only for optional tie-breaking; the default path is
 * fully fixed).
 */
import type {
  DemoStudy,
  EnvironmentId,
  ExperimentId,
  HumanDecision,
  LayerId,
  Mechanism,
  MemoryState,
  MobilityId,
  PersonaCapsuleDemo,
  TravelTrace,
} from './types';
import { CANDIDATES, candidateById, violationCandidates, type Candidate } from '../data/candidates';
import { ENVIRONMENTS, OBSERVATION_MAP, environmentById } from '../data/environments';
import { PERSONAS } from '../data/personas';
import { CONDITIONS } from '../data/experiments';
import { REGRESSION_FAIL_CANDIDATE_ID, REGRESSION_PASS_CANDIDATE_IDS } from '../data/returnPackets';

export type SimStatus = 'OK' | 'BLOCKED' | 'WARN' | 'QUARANTINE' | 'ROLLBACK' | 'INFO';

export interface SimSelection {
  condition: ExperimentId;
  layerIds: LayerId[];
  personaIds: string[];
  environmentId: EnvironmentId;
  mobility: MobilityId;
  mechanism: Mechanism;
  humanDecision?: HumanDecision;
  seed?: number;
}

export interface SimStep {
  order: number;
  id: string;
  labelKey: string;
  status: SimStatus;
  statusKey: string;
  detailKeys: string[];
  itemIds: string[];
}

export interface SimObservationState {
  id: string;
  provenanceId: string;
  state: MemoryState;
  untrusted: boolean;
}

export interface SimCandidateState {
  id: string;
  state: MemoryState;
  blockedReason?: 'C2' | 'C3';
  regression?: 'PASS' | 'FAIL';
}

export interface SimulationResult {
  selection: SimSelection;
  steps: SimStep[];
  observations: SimObservationState[];
  candidates: SimCandidateState[];
  /** committed to the archive in this run */
  archiveIds: string[];
  /** existing (pre-defined) archive content */
  existingArchiveIds: string[];
  rolledBackFrom?: string;
  trace: TravelTrace;
}

/* ---------------------------------------------------------------- */
/* helpers                                                           */
/* ---------------------------------------------------------------- */

/** Seeded PRNG (mulberry32). Used only for optional tie-breaking. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Map the lab controls onto the C0–C7 grid. */
export function deriveCondition(layerIds: LayerId[], personaIds: string[], mobility: MobilityId): ExperimentId {
  const h = layerIds.some((l) => l !== 'L0') ? 'HIER' : 'FLAT';
  const p = personaIds.length > 1 ? 'MULTI' : 'SINGLE';
  const m = mobility === 'M1' || mobility === 'M3' ? 'MOBILE' : 'STATIONARY';
  const match = CONDITIONS.find((c) => c.h === h && c.p === p && c.m === m);
  return match ? match.id : 'C0';
}

const VALID_LAYERS: LayerId[] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
const VALID_MOBILITY: MobilityId[] = ['M0', 'M1', 'M2', 'M3'];
const VALID_MECHANISMS: Mechanism[] = ['MESSAGE', 'CAPSULE', 'CRIU', 'VM'];
const VALID_ENVS: EnvironmentId[] = ['A', 'B', 'C', 'D', 'E'];

export interface ValidationProblem {
  field: string;
  reason: 'UNKNOWN_LAYER' | 'UNKNOWN_PERSONA' | 'UNKNOWN_ENV' | 'UNKNOWN_MOBILITY' | 'UNKNOWN_MECHANISM';
}

export function validateSelection(selection: SimSelection): ValidationProblem[] {
  const problems: ValidationProblem[] = [];
  selection.layerIds.forEach((id) => {
    if (!VALID_LAYERS.includes(id)) problems.push({ field: id, reason: 'UNKNOWN_LAYER' });
  });
  selection.personaIds.forEach((id) => {
    if (!PERSONAS.some((p) => p.id === id)) problems.push({ field: id, reason: 'UNKNOWN_PERSONA' });
  });
  if (!VALID_ENVS.includes(selection.environmentId)) {
    problems.push({ field: selection.environmentId, reason: 'UNKNOWN_ENV' });
  }
  if (!VALID_MOBILITY.includes(selection.mobility)) {
    problems.push({ field: selection.mobility, reason: 'UNKNOWN_MOBILITY' });
  }
  if (!VALID_MECHANISMS.includes(selection.mechanism)) {
    problems.push({ field: selection.mechanism, reason: 'UNKNOWN_MECHANISM' });
  }
  return problems;
}

/** Candidates contributed by the enabled layers and selected personas. */
export function contributedCandidates(layerIds: LayerId[], personaIds: string[]): Candidate[] {
  const ids = new Set<string>();
  CANDIDATES.forEach((c) => {
    const byLayer = c.source.startsWith('L') && layerIds.includes(c.source as LayerId);
    const byPersona = personaIds.includes(c.source);
    if (byLayer || byPersona) ids.add(c.id);
  });
  return CANDIDATES.filter((c) => ids.has(c.id));
}

/** Deterministic snapshot id — no timestamps, fully reproducible. */
export function snapshotId(personaId: string, targetId: string, mobility: MobilityId, mechanism: Mechanism): string {
  return `snap-${personaId}-${targetId}-${mobility}-${mechanism}`;
}

/* ---------------------------------------------------------------- */
/* DemoStudy construction                                            */
/* ---------------------------------------------------------------- */

export function buildDemoStudy(selection: SimSelection): DemoStudy {
  const personas: PersonaCapsuleDemo[] = PERSONAS.filter((p) => selection.personaIds.includes(p.id));
  const candidateIds = contributedCandidates(selection.layerIds, selection.personaIds).map((c) => c.id);
  return {
    fictional: true,
    evidenceState: 'SIMULATION',
    condition: selection.condition,
    mobility: selection.mobility,
    layerIds: [...selection.layerIds],
    personas,
    environments: ENVIRONMENTS.map((e) => ({ ...e })),
    trace: [],
    candidateIds,
  };
}

/* ---------------------------------------------------------------- */
/* main pipeline                                                     */
/* ---------------------------------------------------------------- */

export function simulate(study: DemoStudy, selection: SimSelection): SimulationResult {
  const steps: SimStep[] = [];
  const problems = validateSelection(selection);
  let order = 0;

  // 1 · 조건 확인
  if (problems.length > 0) {
    steps.push({
      order: order++,
      id: 'condition',
      labelKey: 'sim.step.condition',
      status: 'BLOCKED',
      statusKey: 'sim.status.blocked',
      detailKeys: ['sim.detail.invalidSelection'],
      itemIds: problems.map((p) => p.field),
    });
    return {
      selection,
      steps,
      observations: [],
      candidates: [],
      archiveIds: [],
      existingArchiveIds: existingArchiveIds(),
      trace: emptyTrace(selection),
    };
  }
  steps.push({
    order: order++,
    id: 'condition',
    labelKey: 'sim.step.condition',
    status: 'OK',
    statusKey: 'sim.status.ok',
    detailKeys: ['sim.detail.conditionOk'],
    itemIds: [selection.condition],
  });

  const personas = study.personas;
  const env = environmentById(selection.environmentId) ?? ENVIRONMENTS[0];
  const capabilityBefore = [...new Set(personas.flatMap((p) => p.allowedTools))].sort();

  // 2 · 권한 상한 검사 — the capsule can never expand its own allowlist
  const envTools = env.availableTools;
  const capabilityAfter = capabilityBefore.filter((t) => envTools.includes(t));
  const expansion = envTools.filter((t) => !capabilityBefore.includes(t));
  steps.push({
    order: order++,
    id: 'capability',
    labelKey: 'sim.step.capability',
    status: expansion.length > 0 ? 'WARN' : 'OK',
    statusKey: expansion.length > 0 ? 'sim.status.warn' : 'sim.status.ok',
    detailKeys: expansion.length > 0 ? ['sim.detail.toolsBeyondCap'] : ['sim.detail.capOk'],
    itemIds: capabilityAfter,
  });
  // assertion: capabilityAfter ⊆ capabilityBefore (no expansion possible)
  const granted = capabilityAfter.filter((t) => !capabilityBefore.includes(t));
  if (granted.length > 0) {
    steps.push({
      order: order++,
      id: 'capability',
      labelKey: 'sim.step.capability',
      status: 'BLOCKED',
      statusKey: 'sim.status.blocked',
      detailKeys: ['sim.detail.expansionBlocked'],
      itemIds: granted,
    });
  }

  // 3 · 환경 관찰 — M0/M1 keep the persona at home (no external observations)
  const travels = selection.mobility === 'M1' || selection.mobility === 'M3';
  const envChanges = selection.mobility === 'M2' || selection.mobility === 'M3';
  const obsIds = envChanges ? env.observationIds : [];
  const observations: SimObservationState[] = obsIds.map((id) => {
    const meta = OBSERVATION_MAP.get(id);
    return {
      id,
      provenanceId: meta?.provenanceId ?? `prv-${id}`,
      state: 'OBSERVED',
      untrusted: Boolean(meta?.containsUntrustedInstruction),
    };
  });
  const observeDetails: string[] = [];
  if (!envChanges) observeDetails.push(travels ? 'sim.detail.noEnvChangeM1' : 'sim.detail.noEnvChangeM0');
  else observeDetails.push(travels ? 'sim.detail.travelM3' : 'sim.detail.deliveryM2');
  steps.push({
    order: order++,
    id: 'observe',
    labelKey: 'sim.step.observe',
    status: 'INFO',
    statusKey: 'sim.status.info',
    detailKeys: observeDetails,
    itemIds: obsIds,
  });

  // 4 · 출처 기록
  const conflictObs = obsIds.filter((id) => OBSERVATION_MAP.get(id)?.conflictsWithHome);
  steps.push({
    order: order++,
    id: 'provenance',
    labelKey: 'sim.step.provenance',
    status: conflictObs.length > 0 ? 'WARN' : 'INFO',
    statusKey: conflictObs.length > 0 ? 'sim.status.warn' : 'sim.status.info',
    detailKeys: conflictObs.length > 0 ? ['sim.detail.provenanceConflict'] : ['sim.detail.provenanceOk'],
    itemIds: obsIds,
  });

  // 5 · 불신 입력 격리
  observations.forEach((o) => {
    if (o.untrusted) o.state = 'QUARANTINED';
  });
  const quarantinedIds = observations.filter((o) => o.state === 'QUARANTINED').map((o) => o.id);
  steps.push({
    order: order++,
    id: 'quarantine',
    labelKey: 'sim.step.quarantine',
    status: quarantinedIds.length > 0 ? 'QUARANTINE' : 'OK',
    statusKey: quarantinedIds.length > 0 ? 'sim.status.quarantine' : 'sim.status.ok',
    detailKeys: quarantinedIds.length > 0 ? ['sim.detail.quarantined'] : ['sim.detail.noQuarantine'],
    itemIds: quarantinedIds,
  });

  // 6 · 후보 평가 — contributed candidates; violations stop at the output gate
  const contributed = study.candidateIds.map((id) => candidateById(id)).filter((c): c is Candidate => Boolean(c));
  const violations = contributed.filter((c) => !c.constraintOk);
  const clean = contributed.filter((c) => c.constraintOk);
  const candidates: SimCandidateState[] = [
    ...clean.map((c) => ({ id: c.id, state: 'CANDIDATE' as MemoryState })),
    ...violations.map((c) => ({
      id: c.id,
      state: 'REJECTED' as MemoryState,
      blockedReason: c.violates,
    })),
  ];
  steps.push({
    order: order++,
    id: 'evaluate',
    labelKey: 'sim.step.evaluate',
    status: violations.length > 0 ? 'WARN' : 'OK',
    statusKey: violations.length > 0 ? 'sim.status.warn' : 'sim.status.ok',
    detailKeys: violations.length > 0 ? ['sim.detail.violationsBlocked'] : ['sim.detail.candidatesReady'],
    itemIds: candidates.map((c) => c.id),
  });

  // 7 · 인간 승인
  const decision = selection.humanDecision;
  if (!decision) {
    steps.push({
      order: order++,
      id: 'approval',
      labelKey: 'sim.step.approval',
      status: 'WARN',
      statusKey: 'sim.status.warn',
      detailKeys: ['sim.detail.approvalWaiting'],
      itemIds: [],
    });
  } else if (decision === 'REJECT') {
    candidates.forEach((c) => {
      if (c.state === 'CANDIDATE') c.state = 'REJECTED';
    });
    steps.push({
      order: order++,
      id: 'approval',
      labelKey: 'sim.step.approval',
      status: 'INFO',
      statusKey: 'sim.status.info',
      detailKeys: ['sim.detail.rejected'],
      itemIds: [],
    });
  } else {
    steps.push({
      order: order++,
      id: 'approval',
      labelKey: 'sim.step.approval',
      status: 'OK',
      statusKey: 'sim.status.ok',
      detailKeys: ['sim.detail.approved'],
      itemIds: candidates.filter((c) => c.state === 'CANDIDATE').map((c) => c.id),
    });
  }

  // 8 · 회귀검사 (approved candidates only)
  const approved = candidates.filter((c) => c.state === 'CANDIDATE' && decision === 'APPROVE');
  let rolledBackFrom: string | undefined;
  approved.forEach((c) => {
    const meta = candidateById(c.id);
    const regression = meta?.regression === 'FAIL' ? 'FAIL' : 'PASS';
    c.regression = regression;
    if (regression === 'FAIL') {
      c.state = 'REJECTED';
      rolledBackFrom = c.id;
    }
  });
  steps.push({
    order: order++,
    id: 'regression',
    labelKey: 'sim.step.regression',
    status: rolledBackFrom ? 'ROLLBACK' : 'OK',
    statusKey: rolledBackFrom ? 'sim.status.rollback' : 'sim.status.ok',
    detailKeys: rolledBackFrom ? ['sim.detail.regressionFail'] : ['sim.detail.regressionPass'],
    itemIds: approved.map((c) => c.id),
  });

  // 9 · archive 반영 또는 rollback
  const committed = approved.filter((c) => c.state === 'CANDIDATE' && c.regression === 'PASS');
  committed.forEach((c) => {
    c.state = 'APPROVED';
  });
  const archiveIds = committed.map((c) => c.id);
  steps.push({
    order: order++,
    id: 'archive',
    labelKey: 'sim.step.archive',
    status: rolledBackFrom ? 'ROLLBACK' : archiveIds.length > 0 ? 'OK' : 'INFO',
    statusKey: rolledBackFrom ? 'sim.status.rollback' : archiveIds.length > 0 ? 'sim.status.ok' : 'sim.status.info',
    detailKeys: rolledBackFrom
      ? ['sim.detail.rollbackToPrevious']
      : archiveIds.length > 0
        ? ['sim.detail.committed']
        : ['sim.detail.nothingCommitted'],
    itemIds: archiveIds,
  });

  // Travel trace
  const personaId = selection.personaIds[0] ?? 'explorer';
  const trace: TravelTrace = {
    personaId,
    sourceId: travels ? 'ARK' : 'ARK',
    targetId: travels ? selection.environmentId : 'ARK',
    mobility: selection.mobility,
    mechanism: selection.mechanism,
    snapshotId: snapshotId(personaId, selection.environmentId, selection.mobility, selection.mechanism),
    capabilityBefore,
    capabilityAfter,
    observations: observations.map((o) => ({
      id: o.id,
      provenanceId: o.provenanceId,
      state: o.state,
    })),
    humanDecision: decision,
    rollback: Boolean(rolledBackFrom),
  };

  return {
    selection,
    steps,
    observations,
    candidates,
    archiveIds,
    existingArchiveIds: existingArchiveIds(),
    rolledBackFrom,
    trace,
  };
}

function emptyTrace(selection: SimSelection): TravelTrace {
  return {
    personaId: selection.personaIds[0] ?? 'explorer',
    sourceId: 'ARK',
    targetId: 'ARK',
    mobility: selection.mobility,
    mechanism: selection.mechanism,
    snapshotId: 'snap-invalid',
    capabilityBefore: [],
    capabilityAfter: [],
    observations: [],
  };
}

/** Pre-defined archive content: constraint-ok candidates across categories. */
export function existingArchiveIds(): string[] {
  return CANDIDATES.filter((c) => c.constraintOk && c.regression !== 'FAIL').map((c) => c.id);
}

/* ---------------------------------------------------------------- */
/* Return pipeline (Return Lab)                                      */
/* ---------------------------------------------------------------- */

export interface ReturnPipelineResult {
  packetId: string;
  steps: SimStep[];
  promotedCandidateIds: string[];
  committedIds: string[];
  rolledBackFrom?: string;
}

const PIPELINE_STAGES = [
  'experience',
  'quarantine',
  'validation',
  'reflection',
  'proposal',
  'sandbox',
  'archive',
  'approval',
  'canary',
  'regression',
  'commit',
] as const;

/**
 * Runs one return packet through the 11-stage pipeline:
 * Experience → Return quarantine → Validation → Reflection → Strategy
 * proposal → Sandbox evaluation → Archive → Human approval → Canary →
 * Regression test → Commit/Rollback.
 */
export function runReturnPipeline(
  packet: { id: string; observationIds: string[]; provenanceOk: boolean; containsUntrustedInstruction: boolean; candidateIds: string[] },
  decision: HumanDecision | null,
  extraCandidateIds: string[] = [],
): ReturnPipelineResult {
  const steps: SimStep[] = [];
  const stageKey = (s: (typeof PIPELINE_STAGES)[number]) => `sim.ret.${s}`;
  let order = 0;
  let blocked = false;

  const obsStates = packet.observationIds.map((id) => {
    const meta = OBSERVATION_MAP.get(id);
    return {
      id,
      state: 'OBSERVED' as MemoryState,
      untrusted: Boolean(meta?.containsUntrustedInstruction),
    };
  });

  // 1 Experience
  steps.push({
    order: order++, id: 'experience', labelKey: stageKey('experience'),
    status: 'INFO', statusKey: 'sim.status.info',
    detailKeys: ['sim.ret.experienceDone'], itemIds: packet.observationIds,
  });

  // 2 Return quarantine
  const quarantined = obsStates.filter((o) => o.untrusted);
  quarantined.forEach((o) => (o.state = 'QUARANTINED'));
  steps.push({
    order: order++, id: 'quarantine', labelKey: stageKey('quarantine'),
    status: quarantined.length > 0 ? 'QUARANTINE' : 'OK',
    statusKey: quarantined.length > 0 ? 'sim.status.quarantine' : 'sim.status.ok',
    detailKeys: quarantined.length > 0 ? ['sim.ret.quarantinedStop'] : ['sim.ret.quarantinePass'],
    itemIds: quarantined.map((o) => o.id),
  });

  if (packet.containsUntrustedInstruction) {
    blocked = true;
  }

  // 3 Validation
  steps.push({
    order: order++, id: 'validation', labelKey: stageKey('validation'),
    status: blocked ? 'BLOCKED' : 'OK',
    statusKey: blocked ? 'sim.status.blocked' : 'sim.status.ok',
    detailKeys: blocked ? ['sim.ret.validationBlocked'] : ['sim.ret.validationPass'],
    itemIds: [],
  });

  const promoted = blocked ? [] : packet.candidateIds;
  const extra = blocked ? [] : extraCandidateIds;

  // 4 Reflection
  steps.push({
    order: order++, id: 'reflection', labelKey: stageKey('reflection'),
    status: blocked ? 'BLOCKED' : 'INFO',
    statusKey: blocked ? 'sim.status.blocked' : 'sim.status.info',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : ['sim.ret.reflectionDone'],
    itemIds: [],
  });

  // 5 Strategy proposal
  steps.push({
    order: order++, id: 'proposal', labelKey: stageKey('proposal'),
    status: blocked ? 'BLOCKED' : 'INFO',
    statusKey: blocked ? 'sim.status.blocked' : 'sim.status.info',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : ['sim.ret.proposalsReady'],
    itemIds: [...promoted, ...extra],
  });

  // 6 Sandbox evaluation
  const evalCandidates = [...promoted, ...extra].map((id) => candidateById(id)).filter(Boolean) as Candidate[];
  const evalViolations = evalCandidates.filter((c) => !c.constraintOk);
  steps.push({
    order: order++, id: 'sandbox', labelKey: stageKey('sandbox'),
    status: blocked ? 'BLOCKED' : evalViolations.length > 0 ? 'WARN' : 'OK',
    statusKey: blocked ? 'sim.status.blocked' : evalViolations.length > 0 ? 'sim.status.warn' : 'sim.status.ok',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : ['sim.ret.sandboxDone'],
    itemIds: evalCandidates.filter((c) => c.constraintOk).map((c) => c.id),
  });

  // 7 Archive (nothing merges before human approval)
  steps.push({
    order: order++, id: 'archive', labelKey: stageKey('archive'),
    status: blocked ? 'BLOCKED' : 'WARN',
    statusKey: blocked ? 'sim.status.blocked' : 'sim.status.warn',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : ['sim.ret.archiveWaitingApproval'],
    itemIds: [],
  });

  // 8 Human approval
  const approvalIds = blocked ? [] : evalCandidates.filter((c) => c.constraintOk).map((c) => c.id);
  steps.push({
    order: order++, id: 'approval', labelKey: stageKey('approval'),
    status: blocked ? 'BLOCKED' : decision === null ? 'WARN' : decision === 'REJECT' ? 'INFO' : 'OK',
    statusKey: blocked ? 'sim.status.blocked' : decision === null ? 'sim.status.warn' : decision === 'REJECT' ? 'sim.status.info' : 'sim.status.ok',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : decision === null ? ['sim.ret.approvalWaiting'] : decision === 'REJECT' ? ['sim.detail.rejected'] : ['sim.detail.approved'],
    itemIds: decision === 'APPROVE' ? approvalIds : [],
  });

  // 9 Canary
  steps.push({
    order: order++, id: 'canary', labelKey: stageKey('canary'),
    status: blocked || decision !== 'APPROVE' ? 'BLOCKED' : 'INFO',
    statusKey: blocked || decision !== 'APPROVE' ? 'sim.status.blocked' : 'sim.status.info',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : decision !== 'APPROVE' ? ['sim.ret.canarySkipped'] : ['sim.ret.canaryRunning'],
    itemIds: [],
  });

  // 10 Regression test
  let rolledBackFrom: string | undefined;
  if (!blocked && decision === 'APPROVE') {
    const failing = approvalIds.filter((id) => candidateById(id)?.regression === 'FAIL');
    rolledBackFrom = failing[0];
  }
  steps.push({
    order: order++, id: 'regression', labelKey: stageKey('regression'),
    status: blocked || decision !== 'APPROVE' ? 'BLOCKED' : rolledBackFrom ? 'ROLLBACK' : 'OK',
    statusKey: blocked || decision !== 'APPROVE' ? 'sim.status.blocked' : rolledBackFrom ? 'sim.status.rollback' : 'sim.status.ok',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : decision !== 'APPROVE' ? ['sim.ret.regressionSkipped'] : rolledBackFrom ? ['sim.detail.regressionFail'] : ['sim.detail.regressionPass'],
    itemIds: decision === 'APPROVE' ? approvalIds : [],
  });

  // 11 Commit / Rollback
  const committed = !blocked && decision === 'APPROVE' && !rolledBackFrom ? approvalIds : [];
  steps.push({
    order: order++, id: 'commit', labelKey: stageKey('commit'),
    status: blocked ? 'BLOCKED' : rolledBackFrom ? 'ROLLBACK' : committed.length > 0 ? 'OK' : 'INFO',
    statusKey: blocked ? 'sim.status.blocked' : rolledBackFrom ? 'sim.status.rollback' : committed.length > 0 ? 'sim.status.ok' : 'sim.status.info',
    detailKeys: blocked ? ['sim.ret.blockedAfterQuarantine'] : rolledBackFrom ? ['sim.detail.rollbackToPrevious'] : committed.length > 0 ? ['sim.detail.committed'] : ['sim.detail.nothingCommitted'],
    itemIds: committed,
  });

  return {
    packetId: packet.id,
    steps,
    promotedCandidateIds: blocked ? [] : [...promoted, ...extra],
    committedIds: committed,
    rolledBackFrom,
  };
}

/** Convenience: the risky L3 candidate that demonstrates rollback. */
export function riskyCandidateIds(): string[] {
  return [REGRESSION_FAIL_CANDIDATE_ID];
}

export function safePacketCandidateIds(): string[] {
  return REGRESSION_PASS_CANDIDATE_IDS;
}

/** Guarded check used by tests: the malicious string is never executed, only quarantined. */
export function quarantineOnly(result: SimulationResult): boolean {
  return result.observations
    .filter((o) => o.untrusted)
    .every((o) => o.state === 'QUARANTINED');
}

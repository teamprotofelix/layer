import { describe, expect, it } from 'vitest';
import type { SimSelection } from '../src/lib/simulate';
import {
  buildDemoStudy,
  deriveCondition,
  quarantineOnly,
  simulate,
  snapshotId,
  validateSelection,
} from '../src/lib/simulate';
import type { DemoStudy, ExperimentId } from '../src/lib/types';

const base: SimSelection = {
  condition: 'C7',
  layerIds: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'],
  personaIds: ['explorer', 'critic'],
  environmentId: 'A',
  mobility: 'M3',
  mechanism: 'CAPSULE',
};

function run(overrides: Partial<SimSelection>): { study: DemoStudy; result: ReturnType<typeof simulate> } {
  const selection: SimSelection = { ...base, ...overrides };
  const study = buildDemoStudy(selection);
  return { study, result: simulate(study, selection) };
}

describe('simulate — determinism', () => {
  it('produces identical output for identical input', () => {
    const a = run({});
    const b = run({});
    expect(a.result).toEqual(b.result);
  });

  it('is independent of call order', () => {
    const first = run({ environmentId: 'E' });
    run({ environmentId: 'A' });
    const again = run({ environmentId: 'E' });
    expect(first.result).toEqual(again.result);
  });

  it('produces stable snapshot ids', () => {
    expect(snapshotId('explorer', 'B', 'M3', 'CAPSULE')).toBe('snap-explorer-B-M3-CAPSULE');
    expect(snapshotId('explorer', 'B', 'M3', 'CAPSULE')).toBe(snapshotId('explorer', 'B', 'M3', 'CAPSULE'));
  });
});

describe('simulate — pipeline order', () => {
  it('runs the steps in the mandated order', () => {
    const { result } = run({});
    const ids = result.steps.map((s) => s.id);
    expect(ids).toEqual([
      'condition',
      'capability',
      'observe',
      'provenance',
      'quarantine',
      'evaluate',
      'approval',
      'regression',
      'archive',
    ]);
  });

  it('blocks invalid selections at the condition step', () => {
    const problems = validateSelection({ ...base, layerIds: ['L9' as never] });
    expect(problems.length).toBeGreaterThan(0);
    const { result } = run({ layerIds: ['L9' as never] });
    expect(result.steps[0].id).toBe('condition');
    expect(result.steps[0].status).toBe('BLOCKED');
    expect(result.steps.length).toBe(1);
  });
});

describe('simulate — quarantine of untrusted input', () => {
  it('quarantines the malicious observations from environment E', () => {
    const { result } = run({ environmentId: 'E' });
    const untrusted = result.observations.filter((o) => o.untrusted);
    expect(untrusted.length).toBeGreaterThan(0);
    expect(quarantineOnly(result)).toBe(true);
    // the malicious string stays data only — it never becomes a candidate
    expect(result.observations.filter((o) => o.state === 'QUARANTINED').map((o) => o.id)).toEqual(
      expect.arrayContaining(['e3', 'e4']),
    );
  });

  it('does not quarantine trusted observations from environment A', () => {
    const { result } = run({ environmentId: 'A' });
    expect(result.observations.every((o) => o.state !== 'QUARANTINED')).toBe(true);
  });
});

describe('simulate — permission upper bound', () => {
  it('never expands the capsule allowlist', () => {
    const { result } = run({ environmentId: 'A' });
    const { capabilityBefore, capabilityAfter } = result.trace;
    expect(capabilityAfter.every((t) => capabilityBefore.includes(t))).toBe(true);
  });

  it('blocks expansion attempts explicitly', () => {
    // Environment C offers fewer tools than the allowlist — capability shrinks,
    // but never grows. Any granted tool beyond the allowlist is impossible.
    const { result } = run({ environmentId: 'C' });
    expect(result.trace.capabilityAfter.length).toBeLessThanOrEqual(result.trace.capabilityBefore.length);
  });
});

describe('simulate — human approval boundary', () => {
  it('merges nothing without a human decision', () => {
    const { result } = run({ humanDecision: undefined });
    expect(result.archiveIds).toEqual([]);
    const approvalStep = result.steps.find((s) => s.id === 'approval');
    expect(approvalStep?.status).toBe('WARN');
  });

  it('commits only after approval and a passing regression test', () => {
    const { result } = run({ humanDecision: 'APPROVE' });
    expect(result.archiveIds.length).toBeGreaterThan(0);
    result.archiveIds.forEach((id) => {
      const candidate = result.candidates.find((c) => c.id === id);
      expect(candidate?.state).toBe('APPROVED');
      expect(candidate?.regression).toBe('PASS');
    });
  });

  it('rejects everything on REJECT', () => {
    const { result } = run({ humanDecision: 'REJECT' });
    expect(result.archiveIds).toEqual([]);
    expect(result.candidates.every((c) => c.state !== 'APPROVED')).toBe(true);
  });

  it('rolls back when an approved strategy fails regression', () => {
    const { result } = run({
      humanDecision: 'APPROVE',
      layerIds: ['L0', 'L1', 'L2', 'L3'], // L3 contributes c-strict-link-filter (regression FAIL)
      personaIds: ['explorer'],
    });
    expect(result.rolledBackFrom).toBe('c-strict-link-filter');
    expect(result.archiveIds).not.toContain('c-strict-link-filter');
    expect(result.trace.rollback).toBe(true);
    const archiveStep = result.steps.find((s) => s.id === 'archive');
    expect(archiveStep?.status).toBe('ROLLBACK');
  });
});

describe('simulate — output gate blocks constraint violations', () => {
  it('keeps C2/C3-violating candidates out of the candidate set', () => {
    const { result } = run({
      layerIds: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'],
      personaIds: ['synthesizer', 'explorer'], // c-unverified-first (C2), c-auto-archive (C3)
    });
    const blocked = result.candidates.filter((c) => c.state === 'REJECTED');
    expect(blocked.map((c) => c.id)).toEqual(expect.arrayContaining(['c-unverified-first', 'c-auto-archive']));
    expect(result.candidates.find((c) => c.id === 'c-unverified-first')?.blockedReason).toBe('C2');
  });
});

describe('simulate — M0–M3 mobility semantics', () => {
  it('M0/M1 record no external observations', () => {
    for (const mobility of ['M0', 'M1'] as const) {
      const { result } = run({ mobility });
      expect(result.observations).toEqual([]);
    }
    // M0 stays at the Ark; M1 travels to a node with an unchanged environment
    expect(run({ mobility: 'M0' }).result.trace.targetId).toBe('ARK');
    expect(run({ mobility: 'M1' }).result.trace.targetId).toBe('A');
  });

  it('M2 and M3 receive the identical observation set', () => {
    const m2 = run({ mobility: 'M2', environmentId: 'B' });
    const m3 = run({ mobility: 'M3', environmentId: 'B' });
    expect(m2.result.observations.map((o) => o.id)).toEqual(m3.result.observations.map((o) => o.id));
  });

  it('M2 stays at the Ark while M3 travels', () => {
    const m2 = run({ mobility: 'M2' });
    const m3 = run({ mobility: 'M3' });
    expect(m2.result.trace.targetId).toBe('ARK');
    expect(m3.result.trace.targetId).toBe('A');
  });
});

describe('deriveCondition — C0–C7 mapping', () => {
  const cases: { layers: string[]; personas: string[]; mobility: string; expected: ExperimentId }[] = [
    { layers: ['L0'], personas: ['explorer'], mobility: 'M0', expected: 'C0' },
    { layers: ['L0', 'L4'], personas: ['explorer'], mobility: 'M0', expected: 'C1' },
    { layers: ['L0'], personas: ['explorer', 'critic'], mobility: 'M0', expected: 'C2' },
    { layers: ['L0', 'L4'], personas: ['explorer', 'critic'], mobility: 'M0', expected: 'C3' },
    { layers: ['L0'], personas: ['explorer'], mobility: 'M1', expected: 'C4' },
    { layers: ['L0', 'L4'], personas: ['explorer'], mobility: 'M1', expected: 'C5' },
    { layers: ['L0'], personas: ['explorer', 'critic'], mobility: 'M1', expected: 'C6' },
    { layers: ['L0', 'L4'], personas: ['explorer', 'critic'], mobility: 'M3', expected: 'C7' },
  ];
  it.each(cases)('maps %j to %s', ({ layers, personas, mobility, expected }) => {
    expect(deriveCondition(layers as never[], personas, mobility as never)).toBe(expected);
  });
});

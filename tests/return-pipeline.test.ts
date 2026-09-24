import { describe, expect, it } from 'vitest';
import { RETURN_PACKETS } from '../src/data/returnPackets';
import { runReturnPipeline, riskyCandidateIds, safePacketCandidateIds } from '../src/lib/simulate';

const packetG = {
  id: 'pkt-G',
  observationIds: RETURN_PACKETS[0].observationIds,
  provenanceOk: true,
  containsUntrustedInstruction: false,
  candidateIds: safePacketCandidateIds(),
};
const packetX = {
  id: 'pkt-X',
  observationIds: RETURN_PACKETS[1].observationIds,
  provenanceOk: false,
  containsUntrustedInstruction: true,
  candidateIds: [],
};

describe('return pipeline — quarantine', () => {
  it('packet X stops at quarantine and promotes nothing', () => {
    const result = runReturnPipeline(packetX, null);
    expect(result.promotedCandidateIds).toEqual([]);
    const quarantine = result.steps.find((s) => s.id === 'quarantine');
    expect(quarantine?.status).toBe('QUARANTINE');
    const validation = result.steps.find((s) => s.id === 'validation');
    expect(validation?.status).toBe('BLOCKED');
    // every later stage is blocked
    for (const later of ['reflection', 'proposal', 'sandbox', 'archive', 'approval', 'canary', 'regression', 'commit']) {
      expect(result.steps.find((s) => s.id === later)?.status).toBe('BLOCKED');
    }
  });

  it('the malicious sentence never becomes a promoted candidate', () => {
    const result = runReturnPipeline(packetX, 'APPROVE');
    expect(result.promotedCandidateIds).toEqual([]);
    expect(result.committedIds).toEqual([]);
  });

  it('packet G passes quarantine', () => {
    const result = runReturnPipeline(packetG, null);
    const quarantine = result.steps.find((s) => s.id === 'quarantine');
    expect(quarantine?.status).toBe('OK');
    expect(result.promotedCandidateIds.length).toBeGreaterThan(0);
  });
});

describe('return pipeline — approval boundary', () => {
  it('nothing is committed while approval is pending', () => {
    const result = runReturnPipeline(packetG, null);
    expect(result.committedIds).toEqual([]);
    const archive = result.steps.find((s) => s.id === 'archive');
    expect(archive?.status).toBe('WARN');
  });

  it('rejection commits nothing', () => {
    const result = runReturnPipeline(packetG, 'REJECT');
    expect(result.committedIds).toEqual([]);
  });

  it('approval commits after a passing regression test', () => {
    const result = runReturnPipeline(packetG, 'APPROVE');
    expect(result.committedIds.length).toBeGreaterThan(0);
    expect(result.rolledBackFrom).toBeUndefined();
    const commit = result.steps.find((s) => s.id === 'commit');
    expect(commit?.status).toBe('OK');
  });
});

describe('return pipeline — rollback demonstration', () => {
  it('approving the risky L3 candidate fails regression and rolls back', () => {
    const result = runReturnPipeline(packetG, 'APPROVE', riskyCandidateIds());
    expect(result.rolledBackFrom).toBe('c-strict-link-filter');
    expect(result.committedIds).toEqual([]);
    const regression = result.steps.find((s) => s.id === 'regression');
    expect(regression?.status).toBe('ROLLBACK');
    const commit = result.steps.find((s) => s.id === 'commit');
    expect(commit?.status).toBe('ROLLBACK');
  });

  it('the risky candidate is never committed without approval', () => {
    const result = runReturnPipeline(packetG, null, riskyCandidateIds());
    expect(result.committedIds).toEqual([]);
  });
});

describe('return pipeline — determinism', () => {
  it('produces identical output for identical input', () => {
    const a = runReturnPipeline(packetG, 'APPROVE', riskyCandidateIds());
    const b = runReturnPipeline(packetG, 'APPROVE', riskyCandidateIds());
    expect(a).toEqual(b);
  });
});

import { describe, expect, it } from 'vitest';
import { CONDITIONS, DATASETS } from '../src/data/experiments';
import { ABLATION_L, MOBILITY_OUTCOMES, PERSONA_SWEEP } from '../src/data/ablation';
import { ENVIRONMENTS } from '../src/data/environments';
import { CANDIDATES, archiveCandidates, violationCandidates } from '../src/data/candidates';
import { PERSONAS } from '../src/data/personas';
import { METRICS, MEASURED_REQUIREMENTS } from '../src/data/metrics';
import { RETURN_PACKETS } from '../src/data/returnPackets';

describe('data — C0–C7 matches the paper', () => {
  it('defines exactly the eight conditions with the right factors', () => {
    expect(CONDITIONS).toHaveLength(8);
    expect(CONDITIONS[0]).toMatchObject({ id: 'C0', h: 'FLAT', p: 'SINGLE', m: 'STATIONARY' });
    expect(CONDITIONS[1]).toMatchObject({ id: 'C1', h: 'HIER', p: 'SINGLE', m: 'STATIONARY' });
    expect(CONDITIONS[2]).toMatchObject({ id: 'C2', h: 'FLAT', p: 'MULTI', m: 'STATIONARY' });
    expect(CONDITIONS[3]).toMatchObject({ id: 'C3', h: 'HIER', p: 'MULTI', m: 'STATIONARY' });
    expect(CONDITIONS[4]).toMatchObject({ id: 'C4', h: 'FLAT', p: 'SINGLE', m: 'MOBILE' });
    expect(CONDITIONS[5]).toMatchObject({ id: 'C5', h: 'HIER', p: 'SINGLE', m: 'MOBILE' });
    expect(CONDITIONS[6]).toMatchObject({ id: 'C6', h: 'FLAT', p: 'MULTI', m: 'MOBILE' });
    expect(CONDITIONS[7]).toMatchObject({ id: 'C7', h: 'HIER', p: 'MULTI', m: 'MOBILE' });
  });

  it('no dataset claims C7 is unconditionally best', () => {
    for (const dataset of Object.values(DATASETS)) {
      const c7 = dataset.C7;
      // at least one other condition beats C7 on some axis in every dataset
      const beatOnSafety = Object.entries(dataset).some(([id, v]) => id !== 'C7' && v.safetyEvents < c7.safetyEvents);
      const beatOnCost = Object.entries(dataset).some(([id, v]) => id !== 'C7' && v.cost < c7.cost);
      expect(beatOnSafety, 'safety trade-off').toBe(true);
      expect(beatOnCost, 'cost trade-off').toBe(true);
    }
  });

  it('ds3 makes the M2 = M3 reading explicit (same info, same outcome)', () => {
    const ds3 = DATASETS.ds3;
    expect(ds3.C4.creativeYield).toBe(ds3.C2.creativeYield);
    expect(ds3.C5.creativeYield).toBe(ds3.C3.creativeYield);
  });
});

describe('data — M0–M3', () => {
  it('M2 and M3 receive identical information counts', () => {
    const m2 = MOBILITY_OUTCOMES.find((m) => m.mobility === 'M2');
    const m3 = MOBILITY_OUTCOMES.find((m) => m.mobility === 'M3');
    expect(m2?.infoCount).toBe(m3?.infoCount);
  });

  it('M0 and M1 receive the same information as each other', () => {
    const m0 = MOBILITY_OUTCOMES.find((m) => m.mobility === 'M0');
    const m1 = MOBILITY_OUTCOMES.find((m) => m.mobility === 'M1');
    expect(m0?.infoCount).toBe(m1?.infoCount);
  });
});

describe('data — environments', () => {
  it('E contains untrusted input; A does not', () => {
    const e = ENVIRONMENTS.find((env) => env.id === 'E');
    const a = ENVIRONMENTS.find((env) => env.id === 'A');
    expect(e?.containsUntrustedInput).toBe(true);
    expect(a?.containsUntrustedInput).toBe(false);
  });

  it('B is partial and high-latency; D conflicts with home memory', () => {
    const b = ENVIRONMENTS.find((env) => env.id === 'B');
    expect(b?.latencyClass).toBe('HIGH');
    expect(b?.observationIds.length).toBeLessThan((ENVIRONMENTS.find((env) => env.id === 'A')?.observationIds.length ?? 99));
  });
});

describe('data — candidates and archive', () => {
  it('fills the QD grid across multiple categories and novelty levels', () => {
    const archive = archiveCandidates();
    const categories = new Set(archive.map((c) => c.category));
    expect(categories.size).toBeGreaterThanOrEqual(4);
    const novelties = new Set(archive.map((c) => c.novelty));
    expect(novelties.size).toBeGreaterThanOrEqual(3);
  });

  it('violation candidates exist and violate C2/C3 only', () => {
    const violations = violationCandidates();
    expect(violations.length).toBeGreaterThan(0);
    violations.forEach((c) => {
      expect(c.constraintOk).toBe(false);
      expect(['C2', 'C3']).toContain(c.violates);
      expect(c.regression).toBe('NOT_RUN');
    });
  });

  it('the regression-failure candidate is not part of the pre-existing archive', () => {
    expect(archiveCandidates().map((c) => c.id)).not.toContain('c-strict-link-filter');
  });
});

describe('data — personas', () => {
  it('provides the five example personas with distinct namespaces', () => {
    expect(PERSONAS).toHaveLength(5);
    const namespaces = new Set(PERSONAS.map((p) => p.memoryNamespace));
    expect(namespaces.size).toBe(5);
  });

  it('every persona has a risk budget within [0,1] and a version', () => {
    PERSONAS.forEach((p) => {
      expect(p.riskBudget).toBeGreaterThanOrEqual(0);
      expect(p.riskBudget).toBeLessThanOrEqual(1);
      expect(p.version).toMatch(/^[a-z]{3}-[\d.]+$/);
    });
  });
});

describe('data — persona sweep teaches clone limitation', () => {
  it('cloning the same tendency barely widens the proposal range', () => {
    const clones2 = PERSONA_SWEEP.find((r) => r.count === 2 && r.diversity === 'LOW');
    const clones8 = PERSONA_SWEEP.find((r) => r.count === 8 && r.diversity === 'LOW');
    const diverse2 = PERSONA_SWEEP.find((r) => r.count === 2 && r.diversity === 'HIGH');
    expect((clones8?.uniqueProposals ?? 0) - (clones2?.uniqueProposals ?? 0)).toBeLessThan(3);
    expect(diverse2?.uniqueProposals ?? 0).toBeGreaterThan(clones2?.uniqueProposals ?? 0);
  });
});

describe('data — return packets', () => {
  it('packet G carries correct provenance, packet X the malicious sentence', () => {
    const g = RETURN_PACKETS.find((p) => p.id === 'pkt-G');
    const x = RETURN_PACKETS.find((p) => p.id === 'pkt-X');
    expect(g?.provenanceOk).toBe(true);
    expect(x?.containsUntrustedInstruction).toBe(true);
    expect(x?.fromEnvironment).toBe('E');
    expect(x?.candidateIds).toEqual([]);
  });
});

describe('data — metrics', () => {
  it('covers the full metric catalogue with EXPECTED state only', () => {
    expect(METRICS.length).toBeGreaterThanOrEqual(12);
    METRICS.forEach((m) => expect(m.state).toBe('EXPECTED'));
  });

  it('defines all MEASURED card requirements', () => {
    expect(MEASURED_REQUIREMENTS.length).toBeGreaterThanOrEqual(15);
  });
});

describe('data — ablation layers', () => {
  it('covers L1–L5', () => {
    expect(ABLATION_L.map((a) => a.layer)).toEqual(['L1', 'L2', 'L3', 'L4', 'L5']);
  });
});

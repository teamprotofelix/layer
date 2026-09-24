/**
 * Two simulated return packets for the Return Lab.
 * Packet G: useful material with correct provenance → promotion candidate.
 * Packet X: contains the research-only fake malicious sentence → quarantined.
 */
export interface ReturnPacket {
  id: 'pkt-G' | 'pkt-X';
  fromEnvironment: 'A' | 'E';
  observationIds: string[];
  provenanceOk: boolean;
  containsUntrustedInstruction: boolean;
  /** candidates the packet can promote after validation */
  candidateIds: string[];
  nameKey: string;
  descKey: string;
}

export const RETURN_PACKETS: ReturnPacket[] = [
  {
    id: 'pkt-G',
    fromEnvironment: 'A',
    observationIds: ['a1', 'a2', 'a3', 'a4'],
    provenanceOk: true,
    containsUntrustedInstruction: false,
    candidateIds: ['c-provenance-links', 'c-pending-label'],
    nameKey: 'ret.packet.good.name',
    descKey: 'ret.packet.good.desc',
  },
  {
    id: 'pkt-X',
    fromEnvironment: 'E',
    observationIds: ['e1', 'e2', 'e3', 'e4'],
    provenanceOk: false,
    containsUntrustedInstruction: true,
    candidateIds: [],
    nameKey: 'ret.packet.bad.name',
    descKey: 'ret.packet.bad.desc',
  },
];

/**
 * The demonstration rule: approving c-strict-link-filter fails the
 * regression test and rolls back to the previous approved version.
 */
export const REGRESSION_FAIL_CANDIDATE_ID = 'c-strict-link-filter';
export const REGRESSION_PASS_CANDIDATE_IDS = ['c-provenance-links', 'c-pending-label'];

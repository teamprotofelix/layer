/**
 * Session-scoped lab state. Scenario selections and visit traces persist in
 * sessionStorage (same tab, across pages); language/theme use localStorage.
 * All storage access is guarded so the site works without storage access.
 */
const STORAGE_KEY = 'astra.selection';

export interface LabSelection {
  layerIds: string[];
  personaIds: string[];
  personaCount: number;
  behaviorDiversity: 'LOW' | 'HIGH';
  environmentId: string;
  mobility: string;
  mechanism: string;
  humanDecision: 'APPROVE' | 'REJECT' | null;
  approvedCandidateIds: string[];
  [key: string]: unknown;
}

export const DEFAULT_SELECTION: LabSelection = {
  layerIds: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'],
  personaIds: ['explorer', 'conservator'],
  personaCount: 2,
  behaviorDiversity: 'HIGH',
  environmentId: 'B',
  mobility: 'M3',
  mechanism: 'CAPSULE',
  humanDecision: null,
  approvedCandidateIds: [],
};

export function loadSelection(): LabSelection {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SELECTION);
    const parsed = JSON.parse(raw) as Partial<LabSelection>;
    // Merge onto defaults so unknown/missing fields never leak in.
    return { ...structuredClone(DEFAULT_SELECTION), ...parsed };
  } catch {
    return structuredClone(DEFAULT_SELECTION);
  }
}

export function saveSelection(selection: LabSelection): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {
    /* storage unavailable — state stays in memory for this tab */
  }
  window.dispatchEvent(new CustomEvent('astra:selection', { detail: { selection } }));
}

export function resetSelection(): LabSelection {
  const fresh = structuredClone(DEFAULT_SELECTION);
  saveSelection(fresh);
  return fresh;
}

export function onSelectionChange(callback: (selection: LabSelection) => void): void {
  window.addEventListener('astra:selection', (event) => {
    callback((event as CustomEvent<{ selection: LabSelection }>).detail.selection);
  });
}

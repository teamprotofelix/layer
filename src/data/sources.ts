/**
 * Source metadata: the reference paper, the supporting society, and the
 * related sites. Roles use the i18n keys src.paperRole / src.caipexRole /
 * src.astrahoRole / src.protofelixRole. The paper file itself is not
 * redistributed (no distribution permission) — bibliography only.
 */
import type { EvidenceState } from '../lib/types';

export interface SourceMeta {
  id: 'paper' | 'caipex' | 'astraho' | 'protofelix';
  href: string;
  external?: boolean;
  roleKey: string;
  state: EvidenceState;
}

export const SOURCES: SourceMeta[] = [
  { id: 'paper', href: '', roleKey: 'src.paperRole', state: 'CONCEPT' },
  { id: 'caipex', href: 'https://caipex.site/', external: true, roleKey: 'src.caipexRole', state: 'NARRATIVE' },
  { id: 'astraho', href: 'https://protofelix.moip.ai.kr/astra/', external: true, roleKey: 'src.astrahoRole', state: 'NARRATIVE' },
  { id: 'protofelix', href: 'https://protofelix.moip.ai.kr/', external: true, roleKey: 'src.protofelixRole', state: 'NARRATIVE' },
];

export const PAPER_CITATION = {
  authorKey: 'common.paperAuthor',
  titleKey: 'common.paperTitle',
  venueKey: 'common.paperVenue',
  dateKey: 'common.paperDate',
};

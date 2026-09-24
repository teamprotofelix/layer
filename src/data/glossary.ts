/**
 * Glossary for /sources/. Term names are localized; descriptions use the
 * i18n keys src.glossary.<id>.desc.
 */
import type { LocalizedString } from '../lib/types';

export interface GlossaryTerm {
  id: string;
  name: LocalizedString;
  descKey: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'ahmma',
    name: { ko: 'A-HMMA', en: 'A-HMMA', ja: 'A-HMMA' },
    descKey: 'src.glossary.ahmma.desc',
  },
  {
    id: 'ark',
    name: { ko: 'Ark Control Plane', en: 'Ark Control Plane', ja: 'Ark Control Plane' },
    descKey: 'src.glossary.ark.desc',
  },
  {
    id: 'capsule',
    name: { ko: 'Persona Capsule', en: 'Persona Capsule', ja: 'Persona Capsule' },
    descKey: 'src.glossary.capsule.desc',
  },
  {
    id: 'layer',
    name: { ko: 'L0–L5', en: 'L0–L5', ja: 'L0–L5' },
    descKey: 'src.glossary.layer.desc',
  },
  {
    id: 'mobility',
    name: { ko: 'M0–M3', en: 'M0–M3', ja: 'M0–M3' },
    descKey: 'src.glossary.mobility.desc',
  },
  {
    id: 'experiment',
    name: { ko: 'C0–C7', en: 'C0–C7', ja: 'C0–C7' },
    descKey: 'src.glossary.experiment.desc',
  },
  {
    id: 'quarantine',
    name: { ko: '격리(quarantine)', en: 'Quarantine', ja: '隔離（quarantine）' },
    descKey: 'src.glossary.quarantine.desc',
  },
  {
    id: 'provenance',
    name: { ko: '출처 기록(provenance)', en: 'Provenance', ja: '来歴記録（provenance）' },
    descKey: 'src.glossary.provenance.desc',
  },
  {
    id: 'qdArchive',
    name: { ko: 'Quality-diversity archive', en: 'Quality-diversity archive', ja: 'Quality-diversityアーカイブ' },
    descKey: 'src.glossary.qdArchive.desc',
  },
  {
    id: 'creativeYield',
    name: { ko: 'Creative Yield', en: 'Creative Yield', ja: 'Creative Yield' },
    descKey: 'src.glossary.creativeYield.desc',
  },
  {
    id: 'canary',
    name: { ko: 'Canary', en: 'Canary', ja: 'Canary' },
    descKey: 'src.glossary.canary.desc',
  },
  {
    id: 'rollback',
    name: { ko: 'Rollback', en: 'Rollback', ja: 'Rollback' },
    descKey: 'src.glossary.rollback.desc',
  },
  {
    id: 'selfEvo',
    name: { ko: 'self-evolution', en: 'self-evolution', ja: 'self-evolution' },
    descKey: 'src.glossary.selfEvo.desc',
  },
];

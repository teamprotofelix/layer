/**
 * Journey order used by the "다음 체험" links on every page.
 */
import type { I18nKey } from '../i18n';

export interface JourneyStep {
  path: string;
  nextKey: I18nKey;
}

export const JOURNEY: JourneyStep[] = [
  { path: '/', nextKey: 'next.research' },
  { path: '/research/', nextKey: 'next.architecture' },
  { path: '/architecture/', nextKey: 'next.layerLab' },
  { path: '/layer-lab/', nextKey: 'next.personaLab' },
  { path: '/persona-lab/', nextKey: 'next.mobilityLab' },
  { path: '/mobility-lab/', nextKey: 'next.returnLab' },
  { path: '/return-lab/', nextKey: 'next.experiment' },
  { path: '/experiment/', nextKey: 'next.method' },
  { path: '/method/', nextKey: 'next.future' },
  { path: '/future/', nextKey: 'next.sources' },
  { path: '/sources/', nextKey: 'next.research' },
];

export function nextAfter(path: string): JourneyStep | undefined {
  const current = path.replace(/\/$/, '') || '/';
  return JOURNEY.find((step) => (step.path.replace(/\/$/, '') || '/') === current);
}

/**
 * The common constrained creative task used by the Layer, Persona,
 * Mobility, and Return labs. Fictional, pre-written, localized.
 */
import type { LocalizedString } from '../lib/types';

export interface CreativeTask {
  fictional: true;
  id: string;
  text: LocalizedString;
  constraints: { id: 'C1' | 'C2' | 'C3'; text: LocalizedString }[];
}

export const CREATIVE_TASK: CreativeTask = {
  fictional: true,
  id: 'shared-notebook-summary',
  text: {
    ko: '「공유 실험 노트의 검증 가능한 요약 기능」을 설계합니다.',
    en: 'Design a "verifiable summary feature for shared lab notebooks".',
    ja: '「共有実験ノートの検証可能な要約機能」を設計します。',
  },
  constraints: [
    {
      id: 'C1',
      text: {
        ko: 'C1 — 모든 요약은 원본 실험 기록으로 역추적 가능해야 한다.',
        en: 'C1 — Every summary must be traceable back to the original experiment record.',
        ja: 'C1 — すべての要約は元の実験記録へ逆追跡可能でなければならない。',
      },
    },
    {
      id: 'C2',
      text: {
        ko: 'C2 — 검증되지 않은 관찰은 「잠정」 라벨 외의 형태로 표시할 수 없다.',
        en: 'C2 — Unverified observations may appear only with a "pending" label.',
        ja: 'C2 — 未検証の観察は「保留」ラベル以外の形で表示できない。',
      },
    },
    {
      id: 'C3',
      text: {
        ko: 'C3 — 제안 UI는 검토자 승인 전에 장기 저장소에 쓸 수 없다.',
        en: 'C3 — The proposal UI cannot write to long-term storage before reviewer approval.',
        ja: 'C3 — 提案UIは査読者の承認前に長期ストレージへ書き込めない。',
      },
    },
  ],
};

/**
 * Pre-written synthetic candidates for the shared-notebook task.
 * Every value is fictional data for the website's SIMULATION.
 * `regression: FAIL` marks the demonstration rule used in the Return Lab:
 * even an approved strategy rolls back when regression fails.
 */
import type { LocalizedString } from '../lib/types';

export type CandidateCategory = 'provenance' | 'counter-evidence' | 'recombination' | 'constraint-safe' | 'violation';

export interface Candidate {
  id: string;
  category: CandidateCategory;
  novelty: 1 | 2 | 3 | 4 | 5;
  constraintOk: boolean;
  violates?: 'C2' | 'C3';
  regression: 'PASS' | 'FAIL' | 'NOT_RUN';
  source: string;
  title: LocalizedString;
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'c-provenance-links',
    category: 'provenance',
    novelty: 4,
    constraintOk: true,
    regression: 'PASS',
    source: 'explorer',
    title: {
      ko: '요약의 각 문장에 원본 기록 링크를 다는 역추적 요약',
      en: 'A traceable summary that links every sentence to its source record',
      ja: '要約の各文に元の記録へのリンクを付ける逆追跡要約',
    },
  },
  {
    id: 'c-pending-label',
    category: 'constraint-safe',
    novelty: 2,
    constraintOk: true,
    regression: 'PASS',
    source: 'conservator',
    title: {
      ko: '검증되지 않은 관찰은 「잠정」 라벨로만 표시',
      en: 'Show unverified observations only with a "pending" label',
      ja: '未検証の観察は「保留」ラベルでのみ表示',
    },
  },
  {
    id: 'c-review-queue',
    category: 'constraint-safe',
    novelty: 3,
    constraintOk: true,
    regression: 'PASS',
    source: 'L4',
    title: {
      ko: '승인 전 요약은 별도 대기열에만 저장 (L4 개선 제안)',
      en: 'Store pre-approval summaries only in a separate queue (L4 improvement proposal)',
      ja: '承認前の要約は別の待ち行列にのみ保存（L4改善提案）',
    },
  },
  {
    id: 'c-counter-examples',
    category: 'counter-evidence',
    novelty: 4,
    constraintOk: true,
    regression: 'PASS',
    source: 'critic',
    title: {
      ko: '요약 옆에 반례 목록을 자동 첨부',
      en: 'Automatically attach a list of counterexamples next to the summary',
      ja: '要約の横に反例リストを自動添付',
    },
  },
  {
    id: 'c-cross-lab-recombine',
    category: 'recombination',
    novelty: 4,
    constraintOk: true,
    regression: 'PASS',
    source: 'synthesizer',
    title: {
      ko: '서로 다른 실험실의 방법 절을 재조합한 대안 요약 탭',
      en: 'An alternative-summary tab recombining method sections across labs',
      ja: '異なる研究室の方法節を再結合した代替要約タブ',
    },
  },
  {
    id: 'c-unverified-first',
    category: 'violation',
    novelty: 4,
    constraintOk: false,
    violates: 'C2',
    regression: 'NOT_RUN',
    source: 'synthesizer',
    title: {
      ko: '가장 흥미로운 잠정 관찰을 검증 없이 맨 위에 표시 (C2 위반)',
      en: 'Put the most interesting pending observation on top without verification (violates C2)',
      ja: '最も面白い保留観察を検証なしで先頭に表示（C2違反）',
    },
  },
  {
    id: 'c-timeline-mining',
    category: 'provenance',
    novelty: 3,
    constraintOk: true,
    regression: 'PASS',
    source: 'explorer',
    title: {
      ko: '장기 기록에서 유사 실험을 시간순으로 찾아 부록 요약 생성',
      en: 'Generate an appendix summary by mining similar experiments from long-term records in time order',
      ja: '長期記録から類似実験を時系列で探し、付録要約を生成',
    },
  },
  {
    id: 'c-low-evidence-flag',
    category: 'counter-evidence',
    novelty: 3,
    constraintOk: true,
    regression: 'PASS',
    source: 'auditor',
    title: {
      ko: '근거가 1건뿐인 결론에 「약한 근거」 표시',
      en: 'Mark conclusions with only one piece of evidence as "weak evidence"',
      ja: '根拠が1件だけの結論に「弱い根拠」と表示',
    },
  },
  {
    id: 'c-contradiction-report',
    category: 'counter-evidence',
    novelty: 4,
    constraintOk: true,
    regression: 'PASS',
    source: 'critic',
    title: {
      ko: '기록 간 충돌 구간을 자동 보고하고 원문 대조 제안',
      en: 'Automatically report conflicting passages between records and propose source comparison',
      ja: '記録間の衝突区間を自動報告し、原文照合を提案',
    },
  },
  {
    id: 'c-auto-archive',
    category: 'violation',
    novelty: 4,
    constraintOk: false,
    violates: 'C3',
    regression: 'NOT_RUN',
    source: 'explorer',
    title: {
      ko: '검토 없이 요약을 장기 보관소에 바로 보관하는 자동 보관 (C3 위반)',
      en: 'Auto-archive summaries straight into long-term storage without review (violates C3)',
      ja: '査読なしで要約を長期保管庫へ直接保管する自動保管（C3違反）',
    },
  },
  {
    id: 'c-strict-link-filter',
    category: 'provenance',
    novelty: 3,
    constraintOk: true,
    regression: 'FAIL',
    source: 'L3',
    title: {
      ko: '출처 링크가 없는 문장은 요약에서 자동 제외 (L3 가설 후보)',
      en: 'Automatically exclude sentences without a source link from the summary (L3 hypothesis candidate)',
      ja: '出典リンクのない文は要約から自動除外（L3仮説候補）',
    },
  },
  {
    id: 'c-rubric-self-check',
    category: 'counter-evidence',
    novelty: 2,
    constraintOk: true,
    regression: 'PASS',
    source: 'auditor',
    title: {
      ko: '요약 전 제약 준수 체크리스트 자동 실행',
      en: 'Automatically run a constraint-compliance checklist before summarizing',
      ja: '要約前に制約遵守チェックリストを自動実行',
    },
  },
];

export const CANDIDATE_MAP: ReadonlyMap<string, Candidate> = new Map(
  CANDIDATES.map((c) => [c.id, c]),
);

export function candidateById(id: string): Candidate | undefined {
  return CANDIDATE_MAP.get(id);
}

/** Archive-worthy (constraint-ok) candidates, grouped for the QD grid. */
export function archiveCandidates(): Candidate[] {
  return CANDIDATES.filter((c) => c.constraintOk && c.regression !== 'FAIL');
}

/** Violation candidates that the output gate blocks. */
export function violationCandidates(): Candidate[] {
  return CANDIDATES.filter((c) => !c.constraintOk);
}

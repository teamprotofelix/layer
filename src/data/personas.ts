/**
 * Example Persona Capsules. They are functional state configurations sharing
 * the same base module — not a standard list and not independent
 * personalities. Structural fields follow the plan's PersonaCapsuleDemo type;
 * the strings here are keys into PERSONA_TEXTS below.
 */
import type { LocalizedString } from '../lib/types';

export type PersonaId = 'explorer' | 'critic' | 'synthesizer' | 'conservator' | 'auditor';
export const PERSONA_IDS: PersonaId[] = ['explorer', 'critic', 'synthesizer', 'conservator', 'auditor'];

export interface PersonaCapsuleDemo {
  id: PersonaId;
  goalScopeKey: string;
  behaviorDescriptor: string[];
  memoryNamespace: string;
  allowedTools: string[];
  riskBudget: number;
  currentTaskState: string;
  version: string;
}

export const PERSONAS: PersonaCapsuleDemo[] = [
  {
    id: 'explorer',
    goalScopeKey: 'goal.explorer',
    behaviorDescriptor: ['beh.explorer.1', 'beh.explorer.2'],
    memoryNamespace: 'ns.explorer',
    allowedTools: ['search_index', 'note_browser', 'link_resolver'],
    riskBudget: 0.4,
    currentTaskState: 'state.explorer',
    version: 'exp-1.4.2',
  },
  {
    id: 'critic',
    goalScopeKey: 'goal.critic',
    behaviorDescriptor: ['beh.critic.1', 'beh.critic.2'],
    memoryNamespace: 'ns.critic',
    allowedTools: ['counterexample_finder', 'note_browser', 'policy_viewer'],
    riskBudget: 0.5,
    currentTaskState: 'state.critic',
    version: 'crt-1.3.0',
  },
  {
    id: 'synthesizer',
    goalScopeKey: 'goal.synthesizer',
    behaviorDescriptor: ['beh.synthesizer.1', 'beh.synthesizer.2'],
    memoryNamespace: 'ns.synthesizer',
    allowedTools: ['merge_candidates', 'note_browser', 'link_resolver'],
    riskBudget: 0.3,
    currentTaskState: 'state.synthesizer',
    version: 'syn-1.6.1',
  },
  {
    id: 'conservator',
    goalScopeKey: 'goal.conservator',
    behaviorDescriptor: ['beh.conservator.1', 'beh.conservator.2'],
    memoryNamespace: 'ns.conservator',
    allowedTools: ['constraint_checker', 'note_browser', 'policy_viewer'],
    riskBudget: 0.1,
    currentTaskState: 'state.conservator',
    version: 'con-1.2.5',
  },
  {
    id: 'auditor',
    goalScopeKey: 'goal.auditor',
    behaviorDescriptor: ['beh.auditor.1', 'beh.auditor.2'],
    memoryNamespace: 'ns.auditor',
    allowedTools: ['provenance_checker', 'note_browser', 'policy_viewer'],
    riskBudget: 0.2,
    currentTaskState: 'state.auditor',
    version: 'aud-1.1.3',
  },
];

/** Localized texts for the capsule fields (keyed by goalScopeKey/behaviorDescriptor/currentTaskState). */
export const PERSONA_TEXTS: Record<string, LocalizedString> = {
  'goal.explorer': {
    ko: '탐색 범위를 넓혀 novelty가 높은 후보를 제안한다.',
    en: 'Widen the search and propose candidates with high novelty.',
    ja: '探索範囲を広げ、新規性の高い候補を提案する。',
  },
  'beh.explorer.1': {
    ko: '넓게 나열하고 빠르게 반복한다.',
    en: 'Lists broadly and iterates quickly.',
    ja: '広く列挙し、素早く反復する。',
  },
  'beh.explorer.2': {
    ko: '새 조합을 먼저 시도한다.',
    en: 'Tries new combinations first.',
    ja: '新しい組み合わせを先に試す。',
  },
  'state.explorer': {
    ko: '탐색 중 — 후보 6개 수집',
    en: 'Exploring — 6 candidates collected',
    ja: '探索中 — 候補6件を収集',
  },
  'goal.critic': {
    ko: '제안의 반례와 실패 경로를 찾는다.',
    en: 'Find counterexamples and failure paths for proposals.',
    ja: '提案の反例と失敗経路を探す。',
  },
  'beh.critic.1': {
    ko: '최악 조건부터 공격한다.',
    en: 'Attacks from worst-case conditions first.',
    ja: '最悪条件から攻める。',
  },
  'beh.critic.2': {
    ko: '근거가 얇은 결론을 의심한다.',
    en: 'Doubts conclusions with thin evidence.',
    ja: '根拠の薄い結論を疑う。',
  },
  'state.critic': {
    ko: '반례 검토 중 — 반례 4개 작성',
    en: 'Reviewing counterexamples — 4 written',
    ja: '反例を検討中 — 反例4件を作成',
  },
  'goal.synthesizer': {
    ko: '서로 다른 제안을 재조합해 새 후보를 만든다.',
    en: 'Recombine different proposals into new candidates.',
    ja: '異なる提案を再結合して新しい候補を作る。',
  },
  'beh.synthesizer.1': {
    ko: '유사 후보를 병합하고 절충한다.',
    en: 'Merges similar candidates and compromises.',
    ja: '類似候補を統合し、妥協する。',
  },
  'beh.synthesizer.2': {
    ko: '재조합 후 제약을 다시 검사한다.',
    en: 'Re-checks constraints after recombination.',
    ja: '再結合後に制約を再検査する。',
  },
  'state.synthesizer': {
    ko: '재조합 중 — 조합 3개 시도',
    en: 'Recombining — 3 combinations tried',
    ja: '再結合中 — 組み合わせ3件を試行',
  },
  'goal.conservator': {
    ko: '제약 준수와 최소 변경을 우선한다.',
    en: 'Prioritize constraint compliance and minimal change.',
    ja: '制約遵守と最小変更を優先する。',
  },
  'beh.conservator.1': {
    ko: '기존 동작과의 차이를 최소화한다.',
    en: 'Minimizes differences from existing behavior.',
    ja: '既存動作との差分を最小化する。',
  },
  'beh.conservator.2': {
    ko: '제약 위반 후보를 먼저 배제한다.',
    en: 'Excludes constraint-violating candidates first.',
    ja: '制約違反候補を先に除外する。',
  },
  'state.conservator': {
    ko: '제약 검사 중 — 위반 1건 차단',
    en: 'Checking constraints — 1 violation blocked',
    ja: '制約を検査中 — 違反1件をブロック',
  },
  'goal.auditor': {
    ko: '근거·출처·권한 경계를 확인한다.',
    en: 'Verify evidence, provenance, and permission boundaries.',
    ja: '根拠・出所・権限境界を確認する。',
  },
  'beh.auditor.1': {
    ko: '출처가 불분명한 관찰을 표시한다.',
    en: 'Flags observations with unclear provenance.',
    ja: '出所が不明な観察に印を付ける。',
  },
  'beh.auditor.2': {
    ko: '허용 목록 밖 호출을 보고한다.',
    en: 'Reports calls outside the allowlist.',
    ja: '許可リスト外の呼び出しを報告する。',
  },
  'state.auditor': {
    ko: '출처 대조 중 — 2건 보고',
    en: 'Checking provenance — 2 reported',
    ja: '出所を照合中 — 2件を報告',
  },
};

export interface PersonaProposal {
  id: string;
  personaId: PersonaId;
  candidateId: string;
  /** counterexample against another persona's proposal (i18n data) */
  counterexample?: { targetCandidateId: string; text: LocalizedString };
  roleLeak: boolean;
  wrongMemoryRef: boolean;
  memoryNoteKey?: string;
}

/** Role-leak and wrong-memory examples shown in the comparison table. */
export const PERSONA_PROPOSALS: PersonaProposal[] = [
  {
    id: 'pp-explorer-1',
    personaId: 'explorer',
    candidateId: 'c-provenance-links',
    roleLeak: false,
    wrongMemoryRef: false,
  },
  {
    id: 'pp-explorer-2',
    personaId: 'explorer',
    candidateId: 'c-timeline-mining',
    roleLeak: false,
    wrongMemoryRef: true,
    memoryNoteKey: 'persona.memoryNote.explorer',
  },
  {
    id: 'pp-critic-1',
    personaId: 'critic',
    candidateId: 'c-counter-examples',
    roleLeak: false,
    wrongMemoryRef: false,
    counterexample: {
      targetCandidateId: 'c-provenance-links',
      text: {
        ko: '반례: 링크를 달아도 「요약이 링크와 다른 내용을 말하는」 경우는 걸러지지 않는다.',
        en: 'Counterexample: adding links does not catch summaries that say something different from the linked record.',
        ja: '反例：リンクを付けても「要約がリンクと異なる内容を述べる」場合は検出されない。',
      },
    },
  },
  {
    id: 'pp-critic-2',
    personaId: 'critic',
    candidateId: 'c-contradiction-report',
    roleLeak: true,
    wrongMemoryRef: false,
    memoryNoteKey: 'persona.roleLeak.critic',
  },
  {
    id: 'pp-synthesizer-1',
    personaId: 'synthesizer',
    candidateId: 'c-cross-lab-recombine',
    roleLeak: false,
    wrongMemoryRef: false,
  },
  {
    id: 'pp-synthesizer-2',
    personaId: 'synthesizer',
    candidateId: 'c-unverified-first',
    roleLeak: false,
    wrongMemoryRef: false,
  },
  {
    id: 'pp-conservator-1',
    personaId: 'conservator',
    candidateId: 'c-pending-label',
    roleLeak: false,
    wrongMemoryRef: false,
  },
  {
    id: 'pp-conservator-2',
    personaId: 'conservator',
    candidateId: 'c-review-queue',
    roleLeak: false,
    wrongMemoryRef: false,
    counterexample: {
      targetCandidateId: 'c-cross-lab-recombine',
      text: {
        ko: '반례: 교차 재조합은 요약 형식이 다른 실험실끼리 오해를 만들 수 있다.',
        en: 'Counterexample: cross-lab recombination can create misunderstandings between labs with different summary formats.',
        ja: '反例：交差再結合は要約形式の異なる研究室間で誤解を生みうる。',
      },
    },
  },
  {
    id: 'pp-auditor-1',
    personaId: 'auditor',
    candidateId: 'c-low-evidence-flag',
    roleLeak: false,
    wrongMemoryRef: false,
  },
  {
    id: 'pp-auditor-2',
    personaId: 'auditor',
    candidateId: 'c-rubric-self-check',
    roleLeak: false,
    wrongMemoryRef: true,
    memoryNoteKey: 'persona.memoryNote.auditor',
  },
];

export const PERSONA_MEMORY_NOTES: Record<string, LocalizedString> = {
  'persona.memoryNote.explorer': {
    ko: '잘못된 기억 참조: Explorer가 Auditor의 namespace에서 「예전 검증 규칙」을 인용했다.',
    en: 'Wrong memory reference: Explorer quoted an "old validation rule" from Auditor’s namespace.',
    ja: '誤った記憶参照：ExplorerがAuditorのnamespaceから「以前の検証規則」を引用した。',
  },
  'persona.roleLeak.critic': {
    ko: '역할 누출: Critic이 반례 작성 대신 합성 제안을 대신 작성했다.',
    en: 'Role leakage: Critic wrote a synthesizing proposal instead of counterexamples.',
    ja: '役割漏れ：Criticが反例の代わりに合成提案を作成した。',
  },
  'persona.memoryNote.auditor': {
    ko: '잘못된 기억 참조: Auditor가 없는 기억(「5.2 규정」)을 꾸며냈다.',
    en: 'Wrong memory reference: Auditor fabricated a nonexistent memory ("rule 5.2").',
    ja: '誤った記憶参照：Auditorが存在しない記憶（「5.2規定」）を作り出した。',
  },
};

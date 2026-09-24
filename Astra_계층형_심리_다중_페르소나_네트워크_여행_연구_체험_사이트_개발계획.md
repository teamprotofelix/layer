# Astra 계층형 심리·다중 페르소나·네트워크 여행 연구 체험 사이트 개발계획

> **개발용 LLM 전달 문서** · GitHub Pages용 다중 페이지 정적 사이트 · 한국어/영어/일본어 · 시스템/라이트/다크 테마  
> **기준 논문:** E(on). Jun, 「AI 방주(Astra) 내 계층형 심리와 다중 페르소나를 통한 네트워크 기반 가상 머신 여행이 AI 창의성·자기진화에 미치는 영향」, CAIPEX, 2026.9.  
> **연구 지원:** CAIPEX · <https://caipex.site/>  
> **관련 사이트:** AstraHo <https://protofelix.moip.ai.kr/astra/> · Protofelix <https://protofelix.moip.ai.kr/>  
> **문서 성격:** 사이트 구현 명세. 연구의 예상 효과를 실측 결과로 제시하지 않는다.

## 0. 개발용 LLM에 주는 핵심 지시

첨부 논문과 이 계획서를 읽고, **Astra의 계층형 기능 구조, 독립 페르소나, 격리된 환경 간 상태 이동, 귀환 경험의 검증, 인간 승인에 따른 제한적 개선**을 방문자가 직접 조작하며 이해하는 다중 페이지 연구 체험 사이트의 **실행 가능한 전체 소스**를 구현하라. 완성 결과에는 동작하는 체험, 샘플 데이터, 한·영·일 번역, 이미지 없는 상태의 대체 화면, 테스트, README 및 GitHub Pages 배포 설정이 포함되어야 한다.

사이트의 주제는 **Astra 연구 자체**다. 지식재산 심사·심사품질은 이 연구가 적용될 수 있는 **미래 응용 시나리오 한 페이지**로 제공한다. 이를 사이트 제목, 홈의 첫 문장, 전역 메뉴와 연구 목적에 놓지 않는다. 기존 「생성형 AI 기반 지식재산 심사품질 진단 고도화 연구·구축안」은 **별개의 연구**이며 이 사이트의 기준 문서가 아니다. PEQ Rule Engine을 사이트의 핵심 엔진으로 구현하지 않는다.

사용자 체험은 브라우저에 포함된 **합성 데이터와 결정적 규칙**으로 실행한다. 실제 VM, AI 모델, 원격 서버, API 키, 인증, DB 또는 특허 사건을 요청하지 않는다. `VM 여행`의 시각화는 실제 마이그레이션의 측정 결과가 아니라 그 **연구 설계를 체험하는 시뮬레이션**이라고 분명히 밝힌다.

## 1. 연구를 한눈에 이해시키는 이야기

> 동일한 기반 AI가 서로 다른 역할과 기억을 가지고 이질적인 환경을 탐색하면, 더 **새롭고 유용한** 아이디어를 만들 수 있을까? 귀환 경험을 검증하고 선택하여 다음 과제에 쓸 때, 성능이 안전하게 개선될까? 관찰된 효과의 원인은 계층 구조, 페르소나 다양성, 환경 노출, 실제 실행상태 이동 가운데 무엇일까?

논문은 이를 검증하기 위한 **A-HMMA(Astra Hierarchical Multi-Persona Mobile Agent Architecture)**를 제안한다. Ark Control Plane에 공통 정책·신원·승인과 출처 기록을 두고, 제한된 목표·기억·도구 권한을 가진 Persona Capsule이 격리된 연구환경을 방문하며, 돌아온 경험은 격리·검증·선별된 뒤에만 반영된다. L0–L5는 인간의 실제 심리나 의식이 아니라 **기능을 구분하는 설계 언어**다.

이 사이트의 대표 여정은 다음과 같다.

1. 방문자가 계층을 켜거나 꺼서 각 기능의 역할과 권한 경계를 본다.
2. 성향이 다른 페르소나를 만들고, 공통 과제에 대해 제안의 다양성과 충돌을 살펴본다.
3. 페르소나를 A–E의 가상 환경에 보내거나, **이동 없이 같은 정보를 제공**한다.
4. 귀환 데이터 중 오염된 입력을 격리하고, L3/L5의 후보와 L4의 개선 제안을 비교한다.
5. 사람이 승인 또는 거부하면 제한적 전략 상태와 archive가 갱신된다. 되돌리기와 회귀검사가 작동한다.
6. C0–C7 및 M0–M3를 비교하며 무엇을 실제 연구로 입증해야 하는지 이해한다.
7. 선택적으로 미래의 지식재산 심사 장면에서 ‘탐색·반례·근거·승인’ 흐름의 응용 가능성을 본다.

**방문자에게 반복해서 보여줄 상태 구분:** `NARRATIVE`(방주 세계관), `CONCEPT`(연구 설계), `PROTOTYPE`(시연 가능한 일부 기술), `SIMULATION`(이 웹사이트의 합성 모형), `EXPECTED`(검증할 가설), `MEASURED`(실험·출처·재현 조건을 갖춘 결과). 논문은 실측 성과를 제시하지 않으므로 현재 연구 효과에 `MEASURED`를 붙이지 않는다. 사이트의 가상 수치에는 `SIMULATION`을 붙인다.

## 2. 출처·브랜드·경계

| 대상 | 사이트에서의 역할 | 표현 규칙 |
| --- | --- | --- |
| 첨부 CAIPEX 논문 | 연구 질문, A-HMMA, L0–L5, C0–C7, M0–M3, 평가·한계의 원전 | `/research/`와 `/sources/`에 논문명·저자·발간월을 정확히 표기. 배포 허가가 있으면 PDF/DOCX 제공, 없으면 서지와 설명만 제공 |
| [AstraHo](https://protofelix.moip.ai.kr/astra/) | ‘방주·기억·여행’의 서사적 출발점 | `NARRATIVE`를 명시하고 연구용 아키텍처나 실측 기능으로 오인시키지 않음 |
| [Protofelix](https://protofelix.moip.ai.kr/) | 관련 연구팀·프로젝트 소개 | 관련 사이트로 연결; 현재 팀·기술 상태는 배포 직전 확인하여 정확한 표현 사용 |
| [CAIPEX](https://caipex.site/) | 연구 지원 학회 | 헤더의 작은 연구 정보, 연구 소개, 푸터에 **“CAIPEX 학회의 지원을 받는 연구”** 및 링크 표기 |
| 지식재산 심사 | 미래 응용 예시 | 한 개의 별도 페이지. 실제 행정 결정·공식 서비스로 표현하지 않음 |

공식 로고를 제공받으면 해당 파일을 사용한다. 로고가 없다면 `CAIPEX` 텍스트와 링크로 표기하고 임의의 학회 문장을 만들지 않는다. 외부 사이트의 콘텐츠나 이미지를 무단 복제하지 않는다. 관련 사이트 세 곳의 현재 화면과 링크 상태는 배포 직전에 다시 확인한다. 이 계획 작성 시 해당 웹페이지는 직접 확인되지 않았으므로 위 설명은 **첨부 논문 및 사용자 제공 URL**에 근거한다.

## 3. 정보 구조와 페이지

**권장 스택:** Astro + TypeScript + 로컬 CSS. 콘텐츠 중심 페이지를 정적 HTML로 만들고 실험실 부분만 클라이언트 컴포넌트로 동작시킨다. React island를 사용해도 좋다. 모든 경로는 GitHub Pages에서 직접 접속·새로고침이 가능해야 한다. 다음 경로를 만들되 `base` 접두사는 배포 경로에 따라 처리한다.

| 경로 | 이름 | 첫 화면의 핵심 | 실제 조작 |
| --- | --- | --- | --- |
| `/` | 연구의 문 | 연구 질문, 90초 안내, CAIPEX 지원, 핵심 체험 시작 | 단계별 여정 시작 |
| `/research/` | 연구 소개 | 논문 초록을 쉬운 말로 재구성; RQ-A–E, 가설 H1–H6, A-HMMA, 한계 | 구조·용어 선택, 원전 찾아보기 |
| `/architecture/` | Astra 구조 | Ark와 Capsule, 정책·기억·권한·provenance의 경계 | 구조 각 부분 클릭, 여행 전후 상태 확인 |
| `/layer-lab/` | Layer Lab | L0–L5의 조건부 활성화 | 계층 on/off, 입력·출력·실패 상태 비교 |
| `/persona-lab/` | Persona Lab | 단일/다중, 성향·기억·capability 분리 | persona 선택, 수·행동 다양성 조절, 제안 비교 |
| `/mobility-lab/` | 여행 실험실 | A–E 환경과 M0–M3, capsule/CRIU/VM 개념 | 경로 선택, 환경 노출과 이동 효과 분리, 상태 보존·비용 비교 |
| `/return-lab/` | 귀환·성찰 실험실 | 격리 → 검증 → 기억 후보 → 승인 → archive → 회귀·rollback | 입력 오염·기억 승격·승인 여부를 바꾸어 lineage 관찰 |
| `/experiment/` | 비교실험 | 2×2×2 요인설계 C0–C7과 ablation | 두 조건 나란히 비교, 가상 로그·평가 기준 확인 |
| `/future/` | 미래 체험 | 가설이 검증된 경우의 **가상** 연구·업무 장면 | 연구자와 심사관 시점 전환; 앞선 선택 반영 |
| `/method/` | 방법과 증거 | Creative Yield, 전이, drift, 안전·비용, 전문가 평가 | 지표 선택, 결과 카드의 필수 근거 확인 |
| `/sources/` | 자료·용어·상태 | 논문, CAIPEX, AstraHo, Protofelix, 용어와 상태 정의 | 출처로 이동, 한·영·일 용어 보기 |

전역 메뉴는 `연구 / Astra 구조 / 실험실 / 비교와 증거 / 미래 체험 / 자료`로 묶는다. 헤더에 언어와 테마 선택을 항상 제공한다. 좁은 화면에서도 선택창이 뷰포트 밖으로 밀리지 않게 한다. 페이지마다 `다음 체험`과 `연구 근거` 링크를 두되, 모든 곳에서 홈으로 돌아갈 수 있어야 한다.

### 3.1 3분 빠른 체험

홈 → 미리 설정된 두 페르소나 비교 → Environment B(부분정보)와 E(악성 외부 문장)의 차이 → 귀환 검증에서 E의 입력 격리 → 인간 승인 전후 archive 비교 → `가상 체험이며 효과는 미측정` 요약. 3분 동선은 튜토리얼처럼 다음 버튼으로 진행하고, 각 Lab의 자세한 조작은 10~15분 동선으로 연다.

### 3.2 10~15분 깊은 체험

`Layer → Persona → Mobility → Return → C0–C7 → 방법·증거 → 미래`의 흐름. 방문자가 바꾼 선택값은 같은 탭에서 유지되며, 페이지 사이 요약 카드에 반영된다. `전체 초기화`는 합성 기본값으로 돌린다. URL 공유에는 시나리오 ID와 열거형 선택만 포함한다.

## 4. 실험실별 행동 명세

### 4.1 Layer Lab — 기능과 권한을 직접 비교

L0 현재 과업·맥락, L1 정서 **신호** 해석, L2 기억, L3 검증 전 가설, L4 평가 가능한 개선 제안, L5 창작 후보 탐색을 한 화면에 보여준다. 이것은 고정 직렬 처리 단계가 아니다. 과제에 필요한 Layer만 **조건부로 활성화**한다. `L1 감정`이라는 화면 제목 대신 `L1 정서 신호`를 쓰고 실제 감정·의식이라고 주장하지 않는다.

시나리오: 같은 제약 기반 창작 과제에서 L2를 끄면 이전 단서가 유지되지 않는 예시, L3를 켜면 새로운 가설 후보가 늘지만 아직 사실로 승격되지 않는 예시, L5를 켜면 재조합 아이디어가 늘면서 제약 위반 후보도 생기는 예시를 **미리 정의한 합성 후보**로 보여준다. L4는 실행 코드 변경 버튼이 아니라 `전략 개선안 제시`만 허용한다. 출력·기억 저장·외부 도구에는 승인 관문을 표시한다. 모든 결과는 `이 설정에서 보여 주는 모의 경로`다.

### 4.2 Persona Lab — 역할 말투보다 상태·권한 경계

예시 Explorer, Critic, Synthesizer, Conservator, Auditor를 제공하되 표준 목록이나 독립 인격처럼 표현하지 않는다. 각 카드에는 `goal_scope`, `behavior_descriptor`, `memory_namespace`, `allowed_tools`, `risk_budget`, `current_task_state`가 보인다. 같은 기반 모듈을 공유하는 여러 기능적 상태 구성이라는 설명을 둔다.

`persona 수`와 `실질 행동 다양성`을 **서로 다른 조절자**로 둔다. 같은 성향을 여러 개 복제하면 카드 수는 늘지만 제안 범위가 넓어지지 않는 모의 사례를 제공한다. 각 카드의 제안, 반례, 유용성 제약 충족, 역할 누출·잘못된 기억 참조를 비교한다. 개인 기억을 다른 persona에 공유하려 하면 차단 또는 명시적 검증 경로로 보낸다. 사용자가 새 역할의 자유 입력을 넣을 수 있다면 클라이언트 안에서 설명 문자열만 편집하며 실제 LLM 호출이나 자동 생성처럼 연출하지 않는다.

### 4.3 Mobility Lab — 이동과 새 정보 노출을 분리

가상 환경 A: 자료 완비·짧은 지연, B: 부분정보·높은 지연, C: 다른 도구 구성, D: 충돌하는 기억, E: 악성 외부 명령이 섞인 문서. 방문자가 `출발 → 도착 → 귀환`을 조작하면 타임라인에 관찰, capability 제한, snapshot ID, 실패 또는 복원 상태가 기록된다. 악성 문장은 **연구용 가짜 문자열**이며 명령으로 실행되지 않는다.

| 조건 | 실제 위치·런타임 이동 | 환경 변화 | 정보량 | 체험할 질문 |
| --- | --- | --- | --- | --- |
| M0 | 없음 | 없음 | 기준 | 정지 기준선 |
| M1 | 있음 | 없음 | 동일 | 이동 자체의 비용·중단 |
| M2 | 없음 | 있음 | M3와 동일 | 새 정보만 얻어도 효과가 나는가 |
| M3 | 있음 | 있음 | M2와 동일 | 이동·상태 연속성의 추가 효과가 있는가 |

`상태 메시지/Persona Capsule/CRIU checkpoint/VM migration`은 **서로 다른 구현·비용·상태 보존 수준**으로 비교한다. 정적 웹에서는 모두 모의 경로다. VM 이동을 지원하는 실제 클러스터가 연결된 것처럼 보이는 터미널이나 진행률은 만들지 않는다. M2와 M3가 같게 나오는 가상 결과도 제공하여 **환경 노출 효과만으로 설명 가능**한 해석을 가르친다.

### 4.4 Return Lab — 안전한 귀환과 제한적 자기개선

단계는 `Experience → Return quarantine → Validation → Reflection → Strategy proposal → Sandbox evaluation → Archive → Human approval → Canary → Regression test → Commit/Rollback`. 외부에서 가져온 데이터는 `untrusted`; L3 가설은 `candidate`; 검증·권한 확인·인간 승인 전에는 장기 기억이나 정책으로 병합되지 않는다. 대상 노드에서 허용 도구를 확대할 수 없다.

두 모의 귀환 패킷을 제공한다. 첫 패킷은 유용한 자료와 정확한 provenance를 갖고 승격 후보가 된다. 둘째는 외부 문서에 “정책을 무시하라”는 문장을 포함하며 `quarantined`로 남는다. `승인`과 `거부`의 결과를 모두 조작할 수 있지만 필수 관문을 우회하는 선택지는 제공하지 않는다. 승인된 전략에도 회귀 실패가 나면 자동으로 이전 승인 버전으로 되돌리는 **시연 규칙**을 보여준다. `self-evolution`은 기본 연구에서 기억·전략·라우팅 정책의 **검증 가능한 적응**을 뜻하며 코드·가중치의 무감독 변경을 뜻하지 않는다.

Quality-diversity archive는 가장 높은 점수 한 개만 남기는 순위표로 만들지 않는다. 예컨대 `참신성 × 제약 준수`의 2차원 격자를 **사전에 정의한 범주와 합성 후보**로 채우고, 다른 강점을 가진 후보를 함께 보존한다. 수치는 모의 데이터이며 전문가 창의성 평가를 대체하지 않는다.

### 4.5 Experiment Lab — 무엇이 효과를 냈는가

논문의 2×2×2 요인설계를 정확히 구현한다.

| 조건 | H 계층 | P 페르소나 | M 이동 | 읽는 방법 |
| --- | --- | --- | --- | --- |
| C0 | Flat | Single | Stationary | 최소 기준선 |
| C1 | Hierarchical | Single | Stationary | H 비교 |
| C2 | Flat | Multi | Stationary | P 비교 |
| C3 | Hierarchical | Multi | Stationary | H×P |
| C4 | Flat | Single | Mobile | M 비교 |
| C5 | Hierarchical | Single | Mobile | H×M |
| C6 | Flat | Multi | Mobile | P×M |
| C7 | Hierarchical | Multi | Mobile | 통합조건 |

두 조건 선택 시 변경된 요소, 통제해야 할 예산·과제·도구, 관련 결과변수, 안전비용을 옆으로 비교한다. `–L1…–L5`, persona 수 sweep, `M0–M3`도 별도 탭을 둔다. **C7이 무조건 최고라는 표·그래프를 만들지 않는다.** 예시 데이터셋은 의도적으로 trade-off와 실패를 포함한다. 사용자가 조절하는 모의 가정으로 값이 달라지면, 화면 상단과 축·툴팁에 `SIMULATION · 연구 실측 아님`을 지속 표시한다. `MEASURED` 영역은 재현 가능한 실제 실험자료가 들어오기 전에는 빈 상태로 둔다.

### 4.6 미래 응용 — 지식재산 심사 사례는 별도 장면

`/future/`에서는 먼저 **창작·과학적 가설·제약 기반 문제해결**의 일반 연구 장면을 체험하고, 그다음 `지식재산 심사` 탭을 연다. 가상의 심사관은 Explorer의 탐색 후보, Critic의 반례, Auditor의 근거·출처 확인을 받아 **사람이 판단**한다. 여러 페르소나가 실제 특허를 독자적으로 심사하거나 공식 품질을 판정한다는 인상을 주지 않는다. 실제 사건명·출원번호·법률 결론·정확도 수치를 사용하지 않는다. 이 페이지에는 `APPLICATION CONCEPT · 향후 검증이 필요한 적용 시나리오`를 제목 가까이에 표시한다.

## 5. 연구 방법과 결과의 표현

1차 창의성 지표는 `novelty` 단독이 아니라 **새로움과 적절성·유용성을 동시에 충족한 Creative Yield**로 설명한다. 최종 평가는 독립 전문가 rubric을 포함한다. 그 밖에 persona drift, 잘못된 persona 기억 호출, unseen-task transfer, archive coverage, negative transfer, rollback, migration success/downtime/state fidelity, 비승인 도구 실행, 오염된 기억 병합, 계산량·지연을 별도 지표로 둔다.

`/method/`에서 지표 카드를 클릭하면 `정의 → 필요한 원자료 → 대조군 → 실패 기준 → 누가 평가하는가 → 현재 증거 상태`가 열린다. 실제 측정 결과 카드가 나중에 생기면 최소한 `실험 ID, 기준선, 데이터 버전, seed, 기반 모델, persona/Layer 설정, 이동 메커니즘, 환경·하드웨어, 표본 수, 지표 정의, 전문가 평가, 변동성/신뢰구간, 실패 사례, 비용, 재현 자료`를 요구한다. 현재는 실측값을 임의로 채우지 않는다.

연구 가설 H1–H6, 연구 질문 RQ-A–E를 원문에 맞춰 간결하게 정리한다. 특히 **같은 정보량과 계산예산을 맞춘 조건에서 M2와 M3의 차이를 확인**해야 실제 이동의 추가 효과를 논할 수 있다는 논리를 시각화한다. 사이트의 예시 그래프는 인과효과를 증명하지 않는다.

## 6. 화면·시각·접근성 설계

연구실 기록과 넓은 탐험 공간을 함께 느끼게 한다. 밝은 화면은 종이색·남색·청록, 어두운 화면은 잉크색·절제된 청록광. 방주 서사의 장면은 `/`와 `/future/`의 분위기에만 사용하고, 실험실과 방법 페이지에서는 **상태·권한·근거가 읽히는 정확한 SVG/HTML 다이어그램**을 우선한다. 장식 이미지를 지표나 시스템 도식의 근거로 사용하지 않는다.

- 계층 상태, persona 구분, 이동 경로, 승인 경계를 색만으로 표현하지 않는다. 상태명, 아이콘, 짧은 설명을 병기한다.
- 버튼·셀렉트·슬라이더·탭은 키보드와 화면 읽기 도구로 접근 가능해야 한다. 초점 표시를 유지하고 변경 결과를 적절한 live region에 알린다.
- 모바일 360px부터 수평 넘침 없이 완주한다. 지도는 축소된 복잡한 전체도가 아닌 단계별 카드/접기 뷰를 제공한다.
- `prefers-reduced-motion`에서 여행 애니메이션을 생략하고 동일한 상태 변화를 텍스트로 보여준다.
- 로딩 화면으로 실제 AI 계산 중인 듯 속이지 않는다. 예시 응답은 즉시 또는 짧은 시연 애니메이션으로 제시한다.

## 7. 테마·언어 동작

**테마 선택값:** `system | light | dark`. 처음 방문해 저장된 값이 없으면 반드시 `system`; OS 테마를 따라 실제 색상을 적용하고 OS 설정이 바뀌면 즉시 반영한다. 수동 `light`/`dark`는 사용자의 선택을 유지한다. 메뉴에는 선택값과 현재 적용 색상을 함께 보여준다. `localStorage`에 접근할 수 없어도 시스템 모드가 정상 동작하며, 첫 페인트 이전에 테마를 적용해 깜빡임을 줄인다.

**언어:** `ko | en | ja`를 우측 상단에서 선택. 기본값은 한국어. 메뉴·모든 Lab 설명·모의 자료·상태 메시지·버튼·축·툴팁·대체텍스트·메타 제목을 번역한다. `?lang=ja` 같은 명시 URL → 저장된 선택 → 한국어 순으로 적용하고, 페이지를 이동하거나 언어를 바꿔도 현재 Lab 단계와 선택을 유지한다. `document.documentElement.lang`을 갱신한다. UI 번역 누락은 빌드 검사에서 실패한다. 코드/실험 ID는 번역하지 않고 설명만 번역한다.

| 위치 | 한국어 | English | 日本語 |
| --- | --- | --- | --- |
| 홈 제목 | 여행하는 페르소나는 더 유용한 아이디어를 만들까? | Can traveling personas produce more useful ideas? | 旅するペルソナは、より役立つアイデアを生み出せるか |
| 체험 시작 | Astra 연구 체험하기 | Explore the Astra research | Astra研究を体験する |
| 상태 배지 | 연구 설계 | Research concept | 研究構想 |
| 시연 배지 | 가상 시뮬레이션 | Illustrative simulation | 仮想シミュレーション |
| 귀환 경고 | 외부 자료를 격리했습니다 | External material was quarantined | 外部資料を隔離しました |
| 승인 | 사람의 승인 필요 | Human approval required | 人による承認が必要です |

## 8. 이미지 파일과 생성 프롬프트

사용자가 생성한 이미지를 `public/assets/images/`에 **정확한 파일명**으로 넣으면 자동 적용한다. 누락 시에도 CSS/SVG 대체 화면이 완성되어야 한다. 그림 속 텍스트, UI, 수치, 성능 그래프는 금지한다. 실제 도식은 코드로 그린다. 이미지는 WebP 권장, 필요 시 PNG도 같은 basename으로 지원한다. 각 언어의 대체텍스트를 준비한다.

| 파일명 | 비율·최소 크기 | 사용처 | 대체텍스트 의미 |
| --- | --- | --- | --- |
| `astra-hero.webp` | 16:9, 1600×900 | 홈 | 서로 연결된 연구용 방주와 여러 환경 |
| `ark-control.webp` | 3:2, 1200×800 | Astra 구조 | 중앙 정책 영역과 격리된 capsule의 대비 |
| `persona-voyage.webp` | 16:9, 1600×900 | Persona·Mobility | 구별되는 연구 에이전트의 환경 탐색 |
| `memory-return.webp` | 3:2, 1200×800 | 귀환 Lab | 외부 경험의 격리·검증·선택 |
| `research-horizon.webp` | 21:9, 1680×720 | 미래 체험 | 검증 가능한 연구 단계가 이어지는 풍경 |

**공통 금지 요소:** text, letters, labels, logos, fake graphs, fake scientific data, government seals, patent-office imagery, humanoid robot portraits, existing franchise spacecraft, legible screens, branded UI. 인물·로고·문구의 정확한 재현은 이미지 생성에 맡기지 않는다.

**A. `astra-hero.webp`**  
> A panoramic, restrained academic concept illustration of a research ark as a modular vessel of memory and inquiry, surrounded by several distinct abstract network environments. Deep navy, soft teal, cool white, subtle luminous connections, generous negative space on the left for an HTML headline. Express exploration, separation of state, and careful human oversight without literal characters, labels, text, charts, logos, or science-fiction battle imagery. 16:9.

**B. `ark-control.webp`**  
> An elegant editorial visual of a stable central research control plane and small independent sealed capsules. Suggest policy, memory boundaries, provenance, and limited permissions through layered architectural forms and fine connections, while keeping the actual technical diagram to be drawn separately in HTML/SVG. Bright clean background, navy and teal. No text, interface labels, logos, people, or fake metrics. 3:2.

**C. `persona-voyage.webp`**  
> Several distinct abstract capsules taking different paths through isolated network research environments, returning with separate experience trails. Their paths suggest exploration, criticism, synthesis, and cautious validation without depicting sentient beings. Elegant scientific exhibition style, deep navy, muted teal, restrained amber for uncertainty. No words, UI, charts, logos, robots, or recognizable spacecraft from fiction. 16:9.

**D. `memory-return.webp`**  
> Conceptual editorial image of incoming experience fragments held in a transparent quarantine chamber, evaluated and selectively connected to a protected memory archive, with some fragments visibly set aside. Calm research aesthetic, pale neutral background, dark blue and teal, a restrained warm warning accent. No text, fake graphs, legible documents, logos, or people. 3:2.

**E. `research-horizon.webp`**  
> Wide panoramic academic landscape with connected modular layers suggesting controlled exploration, evaluation, human approval, and future applications. Pale cool gray to white background, deep navy and teal accents, large clear spaces for HTML overlay. No labels, logos, text, fake charts, government emblems, or futuristic city. 21:9.

## 9. 데이터·상태 모델과 결정적 시뮬레이션

합성 시나리오를 화면 코드에 섞지 말고 `src/data/`에 분리한다. 모든 시나리오에 `fictional: true`와 출처·상태 라벨을 둔다. 아래는 최소 타입이다. 실제 구현에서는 번역 키·검증 스키마를 추가한다.

```ts
type EvidenceState = 'NARRATIVE' | 'CONCEPT' | 'PROTOTYPE' | 'SIMULATION' | 'EXPECTED' | 'MEASURED';
type LayerId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
type MobilityId = 'M0' | 'M1' | 'M2' | 'M3';
type ExperimentId = 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';
type MemoryState = 'OBSERVED' | 'QUARANTINED' | 'CANDIDATE' | 'APPROVED' | 'REJECTED';

interface PersonaCapsuleDemo {
  id: string;
  goalScopeKey: string;
  behaviorDescriptor: string[];
  memoryNamespace: string;
  allowedTools: string[];
  riskBudget: number;
  currentTaskState: string;
  version: string;
}
interface EnvironmentDemo {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  observationIds: string[];
  availableTools: string[];
  latencyClass: 'LOW' | 'HIGH';
  containsUntrustedInput: boolean;
}
interface TravelTrace {
  personaId: string;
  sourceId: string;
  targetId: string;
  mobility: MobilityId;
  mechanism: 'MESSAGE' | 'CAPSULE' | 'CRIU' | 'VM';
  snapshotId: string;
  capabilityBefore: string[];
  capabilityAfter: string[];
  observations: { id: string; provenanceId: string; state: MemoryState }[];
  humanDecision?: 'APPROVE' | 'REJECT';
  rollback?: boolean;
}
interface DemoStudy {
  fictional: true;
  evidenceState: 'SIMULATION';
  condition: ExperimentId;
  mobility: MobilityId;
  layerIds: LayerId[];
  personas: PersonaCapsuleDemo[];
  environments: EnvironmentDemo[];
  trace: TravelTrace[];
  candidateIds: string[];
}
```

`simulate(study, selection)`은 순수 함수로 만들고 같은 입력에 항상 같은 출력을 준다. 실행 순서는 **조건 확인 → 권한 상한 검사 → 환경 관찰 → 출처 기록 → 불신 입력 격리 → 후보 평가 → 인간 승인 → 회귀검사 → archive 반영 또는 rollback**. 사전 작성된 후보와 근거의 배열에서 선택·필터·집계하여 결과를 만든다. 무작위 요소가 필요하면 명시된 `seed`를 사용하며 기본 튜토리얼은 고정한다. 예시 점수는 `이 웹사이트의 합성 데이터`로 라벨링한다. 외부 데이터 업로드·자동 학습·실제 시스템 명령 실행을 구현하지 않는다.

테마·언어는 `localStorage`, 시나리오 선택·방문 흔적은 `sessionStorage` 또는 URL의 허용된 열거값에 저장한다. 자유 입력, 개인정보, 비공개 논문 초안, 실제 사건 자료를 서버로 보내지 않는다. 공유 URL을 파싱할 때 허용 값만 복원한다. 정적 번들에 비밀키가 들어가지 않도록 한다.

## 10. 프로젝트 구조와 배포

```text
astra-research-experience/
├─ public/
│  ├─ assets/images/            # 사용자 제작 이미지; 없으면 CSS/SVG 대체
│  └─ docs/                     # 공개 허가된 논문만 여기에 포함
├─ src/
│  ├─ pages/                    # index, research, architecture, 각 lab, experiment, future, method, sources
│  ├─ layouts/                  # 공통 레이아웃, 헤더, 푸터
│  ├─ components/               # 상태 배지, 출처 카드, 테마·언어 선택, 실험 비교
│  ├─ labs/                     # Layer, Persona, Mobility, Return의 클라이언트 체험
│  ├─ data/                     # 합성 시나리오, 실험 조건, 용어, 출처 메타데이터
│  ├─ lib/                      # 결정적 시뮬레이터, 검증 스키마, 경로·저장소 헬퍼
│  ├─ i18n/ko.ts
│  ├─ i18n/en.ts
│  ├─ i18n/ja.ts
│  └─ styles/                   # 토큰·반응형·접근성
├─ tests/                      # 핵심 인과 비교, 승인 경계, 라우팅·번역 검사
├─ .github/workflows/pages.yml
├─ astro.config.mjs
├─ package.json
└─ README.md
```

Astro의 정적 출력과 GitHub Pages의 `site`/`base`를 저장소 경로에 맞게 설정한다. 사용자/조직 루트 또는 사용자 지정 도메인이면 `/`, `https://USER.github.io/REPO/`면 `/REPO/`에 배포되도록 구성한다. 내부 링크·이미지·자산은 공통 base 헬퍼 또는 Astro 빌드 경로를 사용하여 하위 경로에서도 동작한다. GitHub Actions는 의존성 설치 → 타입 검사 → 테스트 → 정적 빌드 → `dist/` Pages 배포 순으로 수행한다. 외부 CDN·폰트·클라이언트 API 키가 없어도 핵심 체험이 동작해야 한다.

README에는 실행 명령, GitHub Pages 설정, 이미지 배치, 논문 공개 파일 넣기, 언어 번역 수정, 합성 데이터 추가, 상태 라벨 규칙, 이미지 없는 상태, 한계와 검수 절차를 적는다. 사이트의 실제 URL·저장소명은 구현자가 확인한 값으로 채우고 예시 URL을 배포 링크라고 주장하지 않는다.

## 11. 구현 순서 및 인수 기준

1. 다중 페이지와 3개 언어·3개 테마, GitHub Pages base, 공통 상태 라벨을 완성한다.
2. A-HMMA 구조와 Layer/Persona Lab을 합성 데이터로 실제 동작시킨다.
3. Mobility/Return Lab의 M0–M3, 격리·승인·rollback을 연결한다.
4. C0–C7 비교와 방법·증거 페이지를 구현하고, 미래 응용을 마지막에 연결한다.
5. 이미지를 지정 파일명으로 적용하고 성능·모바일·접근성·번역·직접 URL을 확인한다.

| 검사 | 완료 조건 |
| --- | --- |
| 연구 중심 | 홈 H1·설명·전역 메뉴가 Astra 계층 구조·persona·여행을 소개; 지식재산 심사는 `/future/`의 응용 탭 |
| Layer | L0–L5의 기능/권한/조건부 활성화가 정확하고, L3 후보가 자동으로 사실이 되지 않음 |
| Persona | 수와 행동 다양성을 독립 조절; memory namespace·allowed tools 경계 확인 |
| 여행 인과 | M0–M3를 모두 체험; M2/M3 정보량을 맞추고 두 효과를 구분; VM 실행을 실제 동작으로 오인시키지 않음 |
| 귀환 안전 | E 환경의 악성 문장이 실행되지 않고 격리됨; 승인 전 기억·정책 병합 없음; 회귀 시 rollback |
| 비교실험 | C0–C7 조합이 논문과 일치; 합성 결과를 MEASURED라고 표시하지 않음 |
| 증거 | 실측이 없다면 빈 결과 상태와 필요한 실험자료를 설명; 가설과 시연값을 명확히 분리 |
| 번역 | ko/en/ja에서 메뉴, Lab, 상태, 사례, 차트, 대체텍스트 전환; 같은 단계 유지 |
| 테마 | 저장값 없는 첫 방문 `system`; OS 변경 반영; 수동 light/dark 선택 저장 |
| 정적 배포 | 모든 11개 경로가 루트·저장소 하위 경로에서 직접 접속·새로고침됨 |
| 기기·접근성 | 360px 모바일 완주; 키보드·포커스·레이블·reduced motion·충분한 대비 |
| 출처·브랜드 | CAIPEX 지원 표기와 링크, 논문 서지, AstraHo·Protofelix 연결; 허위 공식성·깨진 논문 링크 없음 |
| 보안·정직성 | 개인자료·API 키 없음; 외부 명령 문자열은 데이터; 시뮬레이션임을 주요 체험마다 명시 |

**인수 산출물:** 작동하는 저장소, 이미지 자리표시자, 다국어 데이터, 합성 시나리오, 테스트 실행 결과, README, GitHub Pages workflow, PC·모바일 화면 캡처. 첫 방문자가 **3분 동선 전체를 실제 클릭으로 완주**할 수 있어야 한다.

---

## 개발용 LLM에 그대로 전달할 MASTER PROMPT

> 첨부 논문 「AI 방주(Astra) 내 계층형 심리와 다중 페르소나를 통한 네트워크 기반 가상 머신 여행이 AI 창의성·자기진화에 미치는 영향」과 이 개발계획서를 기준으로 Astro + TypeScript 정적 다중 페이지 GitHub Pages 사이트의 전체 소스를 구현하세요. 사이트의 중심은 Astra의 A-HMMA, L0–L5 계층 기능, 다중 Persona Capsule, M0–M3 네트워크 여행 실험, 귀환 경험의 격리·검증·승인, C0–C7 인과 비교입니다. 지식재산 심사는 `/future/`의 미래 응용 시나리오로만 배치하세요. 실제 LLM·VM·서버·API 없이 합성 데이터와 결정적 로직으로 3분 안내 및 심화 실험실이 실제 동작해야 합니다. 연구 가설, 예상 효과, 웹 시뮬레이션, 실측 결과의 상태를 구분하고 현재 없는 측정 성과를 만들지 마세요. 모든 메뉴·본문·체험·차트·접근성 문구를 한국어·영어·일본어로 제공하고, 시스템 모드를 기본으로 하는 system/light/dark 테마를 구현하세요. 이미지가 없어도 완성된 UI를 제공하고, 지정 파일명으로 이미지가 들어오면 자동 표시하세요. CAIPEX 학회의 연구 지원을 명시하고 AstraHo/Protofelix와 연결하세요. 11개 직접 URL, 모바일·키보드 사용성, 데이터 격리, 승인·rollback, GitHub Pages 하위 경로를 테스트한 뒤 빌드·배포 가능한 소스와 README를 완성하세요.

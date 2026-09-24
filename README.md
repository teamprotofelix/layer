# Astra 연구 체험 — Astra Research Experience

**Astra 계층형 심리·다중 페르소나·네트워크 여행 연구 체험 사이트**

기준 논문: E(on). Jun, 「AI 방주(Astra) 내 계층형 심리와 다중 페르소나를 통한 네트워크 기반 가상 머신 여행이 AI 창의성·자기진화에 미치는 영향」, CAIPEX, 2026.9.
이 사이트는 **CAIPEX 학회의 지원을 받는 연구**입니다 — <https://caipex.site/>

- 배포 URL(사용자 지정 도메인): **https://layer.caipex.site/**
- 저장소: <https://github.com/teamprotofelix/layer>
- 관련 사이트: AstraHo <https://protofelix.moip.ai.kr/astra/> · Protofelix <https://protofelix.moip.ai.kr/>

> 이 사이트의 체험은 **합성 데이터와 결정적 규칙**으로만 동작합니다. 실제 VM, AI 모델, 원격 서버, API 키, 인증, DB, 특허 사건을 사용하지 않습니다. VM 여행의 시각화는 실제 마이그레이션 측정 결과가 아니라 **연구 설계를 체험하는 시뮬레이션**입니다. 논문은 실측 성과를 제시하지 않으며, 사이트 어디에도 연구 효과에 `MEASURED`를 붙이지 않습니다.

## 페이지 (11개 직접 URL)

| 경로 | 이름 | 내용 |
| --- | --- | --- |
| `/` | 연구의 문 | 연구 질문, 90초 안내, 3분 빠른 체험(튜토리얼), 상태 범례 |
| `/research/` | 연구 소개 | RQ-A–E, 가설 H1–H6, A-HMMA, 한계 |
| `/architecture/` | Astra 구조 | 클릭 가능한 Ark/Capsule 도식, 여행 전후 상태, 경계 |
| `/layer-lab/` | Layer Lab | L0–L5 조건부 활성화, 입력·출력·실패 상태 비교 |
| `/persona-lab/` | Persona Lab | persona 수·행동 다양성 독립 조절, 제안 비교, 기억 공유 차단 |
| `/mobility-lab/` | 여행 실험실 | 환경 A–E, M0–M3, 출발→도착→귀환 타임라인, 메커니즘 비교 |
| `/return-lab/` | 귀환·성찰 실험실 | 격리→검증→승인→archive→회귀·rollback, QD archive 격자 |
| `/experiment/` | 비교실험 | 2×2×2 요인설계 C0–C7, –L1…–L5, persona sweep, M0–M3 |
| `/future/` | 미래 체험 | 연구 장면 + 지식재산 심사 응용(APPLICATION CONCEPT) |
| `/method/` | 방법과 증거 | 지표 카드(정의→원자료→대조군→실패 기준→평가자→증거 상태), MEASURED 필수 근거 |
| `/sources/` | 자료·용어·상태 | 논문 서지, CAIPEX/AstraHo/Protofelix, 용어, 증거 상태 정의 |

## 실행 명령

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (기본 http://localhost:4321)
npm run build      # 정적 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
npm run check      # astro check(타입) + 번역 완전성 검사
npm test           # vitest — 시뮬레이터·승인 경계·rollback·i18n·데이터 검사
node scripts/smoke.mjs [http://localhost:4321]  # (선택) 헤드리스 브라우저 스모크 테스트
```

`npm run check`는 **UI 번역 누락이 있으면 빌드가 실패**하도록 하는 검사입니다(`scripts/check-i18n.mjs`).

## GitHub Pages 배포

- `.github/workflows/pages.yml`이 `main` 푸시마다 **의존성 설치 → 타입·번역 검사 → 테스트 → 정적 빌드 → `dist/` 배포**를 수행합니다.
- 저장소 Settings → Pages에서 **Source: GitHub Actions**, **Custom domain: `layer.caipex.site`** 로 설정하세요.
- DNS: `layer.caipex.site`의 CNAME(또는 A 레코드)을 GitHub Pages 대상(`teamprotofelix.github.io`)으로 연결하세요. `public/CNAME` 파일이 저장소에도 포함되어 있습니다.
- **사용자 지정 도메인 기준 base는 `/`입니다.** 저장소 하위 경로(`https://USER.github.io/REPO/`)로 배포하려면 빌드 시 `SITE_BASE=/REPO/`를 지정합니다(워크플로에서는 리포지토리 변수 `SITE_BASE`로 설정). Windows Git Bash에서는 `MSYS_NO_PATHCONV=1 SITE_BASE=/REPO/ npm run build`처럼 실행하세요.

## 이미지 배치 (지정 파일명)

`public/assets/images/`에 정확한 파일명(WebP 권장, PNG도 동일 basename 지원)으로 넣으면 자동 적용되고, 없으면 CSS/SVG 대체 화면이 표시됩니다. 그림 속 텍스트·UI·수치·성능 그래프는 금지입니다. 실제 도식은 코드로 그립니다.

| 파일명 | 비율·최소 크기 | 사용처 |
| --- | --- | --- |
| `astra-hero.webp` | 16:9, 1600×900 | 홈 히어로 |
| `ark-control.webp` | 3:2, 1200×800 | Astra 구조 |
| `persona-voyage.webp` | 16:9, 1600×900 | Persona·Mobility |
| `memory-return.webp` | 3:2, 1200×800 | 귀환 Lab |
| `research-horizon.webp` | 21:9, 1680×720 | 미래 체험 |

## 논문 공개 파일 넣기

공개 배포 허가가 있는 경우에만 논문 파일(PDF/DOCX 등)을 `public/docs/`에 넣고 `/sources/`에서 링크를 추가하세요. 허가가 없으면 서지 정보와 설명만 제공합니다(현재 상태).

## 언어 번역 수정

- 사전: `src/i18n/ko.ts`(기준), `en.ts`, `ja.ts` — **키는 셋이 정확히 일치**해야 하며 `npm run check`가 어긋나면 실패합니다.
- 콘텐츠 데이터의 번역: `src/data/*.ts`의 `LocalizedString`(`{ ko, en, ja }`) 객체.
- 언어 적용 순서: `?lang=ko|en|ja` URL → 저장된 선택(localStorage) → 한국어. 언어를 바꿔도 실험실의 현재 단계와 선택은 유지됩니다.

## 합성 데이터 추가·수정

- 후보: `src/data/candidates.ts` (참신성, 제약 충족, 범주, 회귀 결과)
- 환경·관찰: `src/data/environments.ts` (A–E, 악성 문장은 연구용 가짜 문자열)
- 실험 조건: `src/data/experiments.ts` (C0–C7), `src/data/ablation.ts`
- 귀환 패킷: `src/data/returnPackets.ts`
- 결정적 시뮬레이터: `src/lib/simulate.ts` — 순수 함수, 같은 입력 → 같은 출력. 실행 순서는 **조건 확인 → 권한 상한 검사 → 환경 관찰 → 출처 기록 → 불신 입력 격리 → 후보 평가 → 인간 승인 → 회귀검사 → archive 반영/rollback**.

## 상태 라벨 규칙

`NARRATIVE`(방주 서사) · `CONCEPT`(연구 설계) · `PROTOTYPE`(시연 기술) · `SIMULATION`(이 사이트의 합성 모형) · `EXPECTED`(검증할 가설) · `MEASURED`(실측 결과).

- 연구 효과에는 `MEASURED`를 붙이지 않습니다(논문이 실측 성과를 제시하지 않음).
- 사이트의 모든 가상 수치에는 `SIMULATION`을 표시합니다.
- `MEASURED` 결과를 추가하려면 `/method/`의 필수 근거 목록(실험 ID, 기준선, 데이터 버전, seed, 기반 모델, 설정, 메커니즘, 환경·하드웨어, 표본 수, 지표 정의, 전문가 평가, 신뢰구간, 실패 사례, 비용, 재현 자료)을 모두 갖춘 뒤에만 표시하세요.

## 이미지 없는 상태

이미지 파일이 없어도 모든 화면이 완성됩니다: 홈 히어로는 그라디언트, `ImageWithFallback` 컴포넌트는 SVG/CSS 자리표시자를 렌더링합니다. 외부 CDN·폰트·클라이언트 API 키 없이 핵심 체험이 동작합니다.

## 한계와 검수 절차

- 모든 실험실 수치는 사전 작성된 합성 후보의 선택·필터·집계이며 실제 생성 결과가 아닙니다. 예시 그래프는 인과효과를 증명하지 않습니다.
- `C7이 무조건 최고`라는 표·그래프는 없습니다 — 예시 데이터셋은 의도적으로 trade-off와 실패를 포함합니다.
- 지식재산 심사는 `/future/`의 한 탭에만 있으며 `APPLICATION CONCEPT`으로 표시되고 실제 사건명·출원번호·법률 결론·정확도 수치를 사용하지 않습니다.
- 배포 직전 확인할 것: ① CAIPEX/AstraHo/Protofelix 링크 상태, ② 저장소 Pages 설정(Source: GitHub Actions, Custom domain), ③ DNS 연결, ④ `SITE_BASE` 값, ⑤ PC·모바일 화면 캡처(`screenshots/`), ⑥ 공식 로고가 생기면 교체(임의 학회 문장 금지).

## 기술 스택

Astro 5(정적 출력) + TypeScript + 로컬 CSS. 실험실은 vanilla TS 클라이언트 컴포넌트, 시뮬레이터는 순수 함수. 테스트: Vitest 65건(시뮬레이터 결정성, 격리, 승인 경계, rollback, i18n 키 패리티, URL 화이트리스트, C0–C7·M0–M3 데이터 정합성). 스모크 테스트: Playwright(선택).

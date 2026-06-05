# PRO ALI SMART Audit Copilot — Master Project Document

> **이 문서는 프로젝트의 단일 진실 원천(Single Source of Truth)입니다.**
> 새 대화/세션에서 작업을 이어갈 때 이 문서를 먼저 읽으세요.
> 작업 진행 시 이 문서의 PROGRESS TRACKER를 반드시 업데이트하세요.

---

## 1. 프로젝트 개요

ISO 심사원을 위한 AI 기반 심사 평가 플랫폼 (SaaS)
- 온라인 수익 창출 목적
- 심사원에게 수준 높은 심사 기법을 편리하고 정확하게 지원
- 심사 품질 향상 + 심사 시간 단축 동시 달성

---

## 2. 확정된 설계 결정

| 항목 | 결정 | 비고 |
|------|------|------|
| 프론트엔드 | Vanilla HTML/CSS/JavaScript | 프레임워크 없음 |
| 백엔드 DB | Google Sheets + Google Apps Script | Web App API로 배포 |
| 인증/로그인 | Google Sheets 기반 회원가입/로그인 | SHA-256 비밀번호 해시 |
| 배포 | Vercel | 정적 사이트 호스팅 |
| 언어 | 한국어 UI + 전문 영어/ISO 용어 혼용 | 전문가다운 톤 |
| AI 기능 | UI 프로토타입 시뮬레이션 | 추후 GPT/Gemini API 연동 가능 구조 |
| 디자인 | Glassmorphism + Premium Enterprise SaaS | Apple+Starbucks+Shopify 감성 |
| 반응형 | PC / Tablet / Mobile 지원 | Adaptive Layout |
| 다크모드 | 지원 (다크/라이트 전환) | |

---

## 3. 기술 아키텍처

```
┌─────────────────┐     fetch()      ┌──────────────────────┐     Read/Write     ┌───────────────┐
│  Vercel 호스팅   │ ──────────────▶ │  Google Apps Script  │ ──────────────▶   │ Google Sheets │
│  (HTML/CSS/JS)  │ ◀────────────── │  (Web App API)       │ ◀──────────────   │ (Database)    │
└─────────────────┘     JSON          └──────────────────────┘                   └───────────────┘
```

### Google Sheets 시트 구성

| 시트명 | 컬럼 | 용도 |
|--------|------|------|
| Users | id, email, name, password_hash, role, plan, created_at | 회원 관리 |
| Sessions | token, user_id, created_at, expires_at | 로그인 세션 |
| Audits | id, user_id, standard, scope, status, created_at | 심사 데이터 |
| NCReports | id, audit_id, type, clause, requirement, evidence, statement | 부적합 보고서 |
| CAPA | id, nc_id, root_cause, corrective_action, status, due_date | 시정조치 |
| RiskAssessments | id, audit_id, process, severity, occurrence, detection, rpn | 리스크 평가 |
| ReferenceLinks | id, category, title, url, description | 외부 참조 링크 |
| ExpertKnowledge | id, category, title, content, author, created_at | 전문가 노하우 |

### Google Apps Script API 엔드포인트

| 엔드포인트 | 메서드 | 기능 |
|-----------|--------|------|
| ?action=register | POST | 회원가입 |
| ?action=login | POST | 로그인 (세션 토큰 발급) |
| ?action=getUser | GET | 사용자 정보 조회 |
| ?action=createAudit | POST | 심사 생성 |
| ?action=getAudits | GET | 심사 목록 조회 |
| ?action=createNC | POST | 부적합 보고서 생성 |
| ?action=createCAPA | POST | CAPA 생성 |
| ?action=saveRisk | POST | 리스크 평가 저장 |
| ?action=getLinks | GET | 참조 링크 조회 |
| ?action=saveKnowledge | POST | 노하우 저장 |

---

## 4. 디자인 시스템

### Color Palette

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| --color-primary | #1B2A4A (Deep Navy) | #4A7CFF (Bright Blue) |
| --color-primary-light | #2E4A7A | #6B9AFF |
| --color-secondary | #1E6B45 (Starbucks Green) | #2ECC71 |
| --color-accent-ai | #7C3AED (AI Purple) | #A78BFA |
| --color-success | #059669 | #34D399 |
| --color-warning | #D97706 | #FBBF24 |
| --color-danger | #DC2626 | #F87171 |
| --color-surface | rgba(255,255,255,0.7) | rgba(30,30,50,0.7) |
| --color-glass | rgba(255,255,255,0.15) | rgba(255,255,255,0.05) |

### Typography
- Display: 48px / 700 weight
- H1: 36px / 700
- H2: 28px / 600
- H3: 22px / 600
- Body: 16px / 400
- Small: 14px / 400
- Caption: 12px / 500
- Font: Inter + Pretendard (Google Fonts CDN)

### UX Design Reference
- 상세 UX 철학: UI/UX-Design.md 참조
- Apple 직관성 + Starbucks 편안함 + Shopify 생산성

---

## 5. 9개 핵심 모듈

| # | 모듈명 | 핵심 기능 |
|---|--------|----------|
| 1 | ISO Clause Navigator | ISO 규격 검색, 조항별 심사 포인트, 증거 예시 |
| 2 | AI Audit Question Generator | 규격/조항/공정/산업군 → 기본/심화/추적/인터뷰 질문 |
| 3 | Process Audit Engine | SIPOC 기반, Turtle Diagram, Process Flow |
| 4 | Evidence Analyzer | 문서 분석 (PDF/PPT/DOCX/XLSX/IMAGE), 적합성 검증 |
| 5 | AI Nonconformity Writer | 심사 메모 → Major NC / Minor NC / OFI 자동 작성 |
| 6 | Risk Assessment | FMEA 기반, S/O/D/RPN 자동 계산, Heat Map |
| 7 | CAPA Manager | 5 Why, Fishbone, FTA 원인 분석, 시정조치 관리 |
| 8 | Audit Report Generator | PDF/DOCX/PPT 자동 생성 |
| 9 | AI Audit Copilot | 자연어 질의 기반 심사 지원 채팅 |

---

## 6. SaaS 수익화 모델

FREE / PRO / ENTERPRISE / MULTI AUDITOR / CONSULTANT / CERTIFICATION BODY

---

## 7. 반도체 산업 특화

지원 공정: Incoming Inspection, Wafer FAB, Diffusion, Lithography, Etching, Thin Film, CMP, EDS, Assembly, Packaging, Final Test, Shipping

AI 심사 지원: 공정 리스크, 핵심 CTQ, SPC 분석, FMEA 검토, Control Plan 검증

---

## 8. Quality To Profit 엔진

자동 계산: COPQ, Scrap Cost, Rework Cost, Claim Cost, Opportunity Cost
ROI Dashboard 제공

---

## 9. 저장소 폴더 구조 (빈 폴더)

### knowledge-base/ (지식베이스)
- iso-standards/ — ISO 규격서
- checklists/ — 심사 체크리스트
- audit-cases/ — 심사 사례집
- quality-manuals/ — 품질 매뉴얼
- procedures/ — 절차서
- work-standards/ — 작업표준서
- fmea/ — FMEA 자료
- control-plans/ — Control Plan
- spc/ — SPC 자료
- msa/ — MSA 자료
- 8d-reports/ — 8D Report
- capa/ — CAPA 사례

### reference-links/ (외부 참조 링크)
- certification-bodies/ — 인증기관
- iso-guides/ — ISO 해설 사이트
- ai-learning/ — AI 학습 사이트
- quality-blogs/ — 품질 전문 블로그
- video-lectures/ — 유튜브 강의
- regulations/ — 법규 사이트
- industry-standards/ — 산업 표준 사이트
- links.json — 참조 링크 데이터

### expert-knowledge/ (사용자 노하우)
- must-check-items/ — 심사 시 반드시 확인할 사항
- common-nonconformities/ — 자주 발생하는 부적합
- interview-techniques/ — 심사 인터뷰 기법
- follow-up-questions/ — 추적 심사 질문
- industry-risks/ — 업종별 핵심 리스크

---

## 10. 페이지 목록 (8+1 페이지)

| 파일 | 페이지 | 설명 |
|------|--------|------|
| index.html | Landing Page | 서비스 소개 + CTA |
| login.html | Login/Register | 회원가입/로그인 |
| dashboard.html | Dashboard | KPI, 일정, 최근 활동 |
| workspace.html | Audit Workspace | 심사 작업 공간 (모듈 1,2,4,5) |
| copilot.html | AI Copilot | AI 채팅 (모듈 3,9) |
| knowledge-base.html | Knowledge Base | 지식/자료 관리 |
| reports.html | Report Center | 보고서/CAPA/리스크 (모듈 6,7,8) |
| admin.html | Admin Page | 사용자/조직/시스템 관리 |
| subscription.html | Subscription Page | 요금제 + 결제 |

---

## 11. 파일 구조

```
e:\0000_ISO- Audit-Copilot\
├── PROJECT.md                    ← 이 문서 (Master Document)
├── index.html
├── login.html
├── dashboard.html
├── workspace.html
├── copilot.html
├── knowledge-base.html
├── reports.html
├── admin.html
├── subscription.html
├── vercel.json
│
├── css/
│   ├── design-system.css
│   ├── components.css
│   ├── layout.css
│   ├── animations.css
│   └── pages/
│       ├── landing.css
│       ├── login.css
│       ├── dashboard.css
│       ├── workspace.css
│       ├── copilot.css
│       ├── knowledge-base.css
│       ├── reports.css
│       ├── admin.css
│       └── subscription.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── api.js
│   ├── navigation.js
│   ├── theme.js
│   ├── modules/
│   │   ├── clause-navigator.js
│   │   ├── question-generator.js
│   │   ├── process-audit.js
│   │   ├── evidence-analyzer.js
│   │   ├── nc-writer.js
│   │   ├── risk-assessment.js
│   │   ├── capa-manager.js
│   │   ├── report-generator.js
│   │   └── ai-copilot.js
│   ├── data/
│   │   ├── iso-standards.js
│   │   ├── semiconductor.js
│   │   ├── quality-profit.js
│   │   └── sample-data.js
│   └── utils/
│       ├── charts.js
│       ├── export.js
│       └── storage.js
│
├── google-apps-script/
│   └── Code.gs
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── UI/
│   └── UX-Design.md
│
├── knowledge-base/
│   ├── README.md
│   └── (12개 하위 폴더)
│
├── reference-links/
│   ├── README.md
│   ├── links.json
│   └── (7개 하위 폴더)
│
└── expert-knowledge/
    ├── README.md
    └── (5개 하위 폴더)
```

---

## 12. PROGRESS TRACKER

> **⚠️ 작업 진행 시 반드시 이 섹션을 업데이트하세요**

### Phase 1: 저장소 폴더 생성 + README ✅
- [x] knowledge-base/ 폴더 12개 + README.md
- [x] reference-links/ 폴더 7개 + README.md + links.json
- [x] expert-knowledge/ 폴더 5개 + README.md

### Phase 2: 디자인 시스템 CSS ✅
- [x] css/design-system.css
- [x] css/components.css
- [x] css/layout.css
- [x] css/animations.css

### Phase 3: Landing Page + Login ✅
- [x] index.html + css/pages/landing.css
- [x] login.html + css/pages/login.css

### Phase 4: Google Apps Script 백엔드 ✅
- [x] google-apps-script/Code.gs
- [x] js/api.js (인라인으로 각 HTML에 포함)
- [x] js/auth.js (인라인으로 각 HTML에 포함)

### Phase 5: Navigation + Theme ✅
- [x] js/app.js (인라인으로 각 HTML에 포함)
- [x] js/navigation.js (인라인으로 각 HTML에 포함)
- [x] js/theme.js (인라인으로 각 HTML에 포함)

### Phase 6: Dashboard ✅
- [x] dashboard.html + css/pages/dashboard.css

### Phase 7: Audit Workspace ✅
- [x] workspace.html + css/pages/workspace.css

### Phase 8: AI Copilot ✅
- [x] copilot.html + css/pages/copilot.css

### Phase 9: Knowledge Base ✅
- [x] knowledge-base.html + css/pages/knowledge-base.css

### Phase 10: Reports / Admin / Subscription ✅
- [x] reports.html + css/pages/reports.css
- [x] admin.html + css/pages/admin.css
- [x] subscription.html + css/pages/subscription.css

### Phase 11: JS 모듈 + 데이터 ← 다음 작업 (선택)
- [x] 핵심 로직 인라인 구현 완료 (각 HTML 내 script 태그)
- [ ] js/modules/ 별도 파일 분리 (리팩토링, 선택)
- [ ] js/data/ 별도 파일 분리 (리팩토링, 선택)
- [ ] js/utils/ 별도 파일 분리 (리팩토링, 선택)

### Phase 12: Vercel 배포 ✅
- [x] vercel.json

---

## 13. 새 세션에서 작업 이어가기

새 대화에서 이 프로젝트 작업을 이어가려면:

1. 이 문서를 읽어주세요: `e:\0000_ISO- Audit-Copilot\PROJECT.md`
2. PROGRESS TRACKER에서 현재 진행 상황을 확인하세요
3. 체크되지 않은 항목부터 이어서 작업하세요
4. 작업 완료 시 PROGRESS TRACKER를 업데이트하세요
5. UX 디자인 참조: `e:\0000_ISO- Audit-Copilot\UI\UX-Design.md`

---

*마지막 업데이트: 2026-06-03*

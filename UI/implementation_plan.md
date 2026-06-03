# PRO ILI SMART Audit Copilot - 구현 계획서

## 프로젝트 개요

ISO 심사원을 위한 AI 기반 심사 평가 플랫폼을 구축합니다. Apple의 직관성, Starbucks의 편안함, Shopify의 생산성을 결합한 Premium Enterprise SaaS 수준의 웹 애플리케이션을 Vanilla HTML/CSS/JS로 개발합니다.

---

## 확정 사항

| 항목 | 결정 |
|------|------|
| **언어** | 한국어 UI + 전문 영어/ISO 용어 혼용 (전문가다운 톤) |
| **백엔드 DB** | Google Sheets + Google Apps Script (Web App API) |
| **인증/로그인** | Google Sheets 기반 회원가입/로그인 구현 |
| **배포** | Vercel 배포 |
| **프론트엔드** | Vanilla HTML/CSS/JavaScript |
| **AI 기능** | UI 프로토타입 시뮬레이션 (추후 API 연동 가능 구조) |

> [!WARNING]
> **Google Apps Script**: Apps Script Web App URL은 배포 후 생성됩니다. 프론트엔드에서는 `API_BASE_URL` 상수로 관리하여, 나중에 실제 URL로 교체하면 바로 연동됩니다.

---

## Google Sheets DB 아키텍처

```
┌─────────────────┐     fetch()      ┌──────────────────────┐     Read/Write     ┌───────────────┐
│  Vercel 호스팅   │ ──────────────▶ │  Google Apps Script  │ ──────────────▶   │ Google Sheets │
│  (HTML/CSS/JS)  │ ◀────────────── │  (Web App API)       │ ◀──────────────   │ (Database)    │
└─────────────────┘     JSON          └──────────────────────┘                   └───────────────┘
```

### Google Sheets 시트 구성

| 시트명 | 컬럼 | 용도 |
|--------|------|------|
| `Users` | id, email, name, password_hash, role, plan, created_at | 회원 관리 |
| `Sessions` | token, user_id, created_at, expires_at | 로그인 세션 |
| `Audits` | id, user_id, standard, scope, status, created_at | 심사 데이터 |
| `NCReports` | id, audit_id, type, clause, requirement, evidence, statement | 부적합 보고서 |
| `CAPA` | id, nc_id, root_cause, corrective_action, status, due_date | 시정조치 |
| `RiskAssessments` | id, audit_id, process, severity, occurrence, detection, rpn | 리스크 평가 |
| `ReferenceLinks` | id, category, title, url, description | 외부 참조 링크 |
| `ExpertKnowledge` | id, category, title, content, author, created_at | 전문가 노하우 |

### Google Apps Script API 엔드포인트

| 엔드포인트 | 메서드 | 기능 |
|-----------|--------|------|
| `?action=register` | POST | 회원가입 |
| `?action=login` | POST | 로그인 (세션 토큰 발급) |
| `?action=getUser` | GET | 사용자 정보 조회 |
| `?action=createAudit` | POST | 심사 생성 |
| `?action=getAudits` | GET | 심사 목록 조회 |
| `?action=createNC` | POST | 부적합 보고서 생성 |
| `?action=createCAPA` | POST | CAPA 생성 |
| `?action=saveRisk` | POST | 리스크 평가 저장 |
| `?action=getLinks` | GET | 참조 링크 조회 |
| `?action=saveKnowledge` | POST | 노하우 저장 |

---

## 프로젝트 구조

```
e:\0000_ISO- Audit-Copilot\
│
├── index.html                    # Landing Page
├── login.html                    # 로그인/회원가입 페이지
├── dashboard.html                # Dashboard
├── workspace.html                # Audit Workspace
├── copilot.html                  # AI Copilot
├── knowledge-base.html           # Knowledge Base
├── reports.html                  # Report Center
├── admin.html                    # Admin Page
├── subscription.html             # Subscription Page
├── vercel.json                   # Vercel 배포 설정
│
├── css/
│   ├── design-system.css         # 디자인 토큰, 변수, 기본 스타일
│   ├── components.css            # 재사용 컴포넌트 스타일
│   ├── layout.css                # 레이아웃 시스템 (반응형)
│   ├── animations.css            # 모션 디자인, 마이크로 인터랙션
│   └── pages/
│       ├── landing.css           # Landing 전용 스타일
│       ├── login.css             # Login 전용 스타일
│       ├── dashboard.css         # Dashboard 전용 스타일
│       ├── workspace.css         # Workspace 전용 스타일
│       ├── copilot.css           # Copilot 전용 스타일
│       ├── knowledge-base.css    # Knowledge Base 전용 스타일
│       ├── reports.css           # Reports 전용 스타일
│       ├── admin.css             # Admin 전용 스타일
│       └── subscription.css      # Subscription 전용 스타일
│
├── js/
│   ├── app.js                    # 앱 초기화, 라우팅
│   ├── auth.js                   # Google Sheets 인증/로그인 모듈
│   ├── api.js                    # Google Apps Script API 클라이언트
│   ├── navigation.js             # 네비게이션 컨트롤
│   ├── theme.js                  # 다크/라이트 모드 전환
│   ├── modules/
│   │   ├── clause-navigator.js   # Module 1: ISO Clause Navigator
│   │   ├── question-generator.js # Module 2: AI Audit Question Generator
│   │   ├── process-audit.js      # Module 3: Process Audit Engine
│   │   ├── evidence-analyzer.js  # Module 4: Evidence Analyzer
│   │   ├── nc-writer.js          # Module 5: AI Nonconformity Writer
│   │   ├── risk-assessment.js    # Module 6: Risk Assessment
│   │   ├── capa-manager.js       # Module 7: CAPA Manager
│   │   ├── report-generator.js   # Module 8: Audit Report Generator
│   │   └── ai-copilot.js        # Module 9: AI Audit Copilot
│   ├── data/
│   │   ├── iso-standards.js      # ISO 규격 데이터
│   │   ├── semiconductor.js      # 반도체 산업 특화 데이터
│   │   ├── quality-profit.js     # Quality To Profit 데이터
│   │   └── sample-data.js        # 데모용 샘플 데이터
│   └── utils/
│       ├── charts.js             # 차트/그래프 유틸
│       ├── export.js             # PDF/DOCX 내보내기
│       └── storage.js            # localStorage + Google Sheets 유틸
│
├── google-apps-script/
│   └── Code.gs                   # Google Apps Script 서버 코드
│
├── assets/
│   ├── icons/                    # SVG 아이콘
│   ├── images/                   # 이미지 리소스
│   └── fonts/                    # 커스텀 폰트 (있을 경우)
│
├── UI/
│   └── UX-Design.md              # (기존) UX 디자인 철학 문서
│
├── knowledge-base/               # ★ 지식베이스 저장소
│   ├── README.md                 # 저장소 사용법 안내
│   ├── iso-standards/            # ISO 규격서
│   ├── checklists/               # 심사 체크리스트
│   ├── audit-cases/              # 심사 사례집
│   ├── quality-manuals/          # 품질 매뉴얼
│   ├── procedures/               # 절차서
│   ├── work-standards/           # 작업표준서
│   ├── fmea/                     # FMEA 자료
│   ├── control-plans/            # Control Plan
│   ├── spc/                      # SPC 자료
│   ├── msa/                      # MSA 자료
│   ├── 8d-reports/               # 8D Report
│   └── capa/                     # CAPA 사례
│
├── reference-links/              # ★ 외부 참조 링크 저장소
│   ├── README.md                 # 저장소 사용법 안내
│   ├── links.json                # 참조 링크 데이터 파일
│   ├── certification-bodies/     # 인증기관 관련
│   ├── iso-guides/               # ISO 해설 사이트
│   ├── ai-learning/              # AI 학습 사이트
│   ├── quality-blogs/            # 품질 전문 블로그
│   ├── video-lectures/           # 유튜브 강의
│   ├── regulations/              # 법규 사이트
│   └── industry-standards/       # 산업 표준 사이트
│
└── expert-knowledge/             # ★ 사용자 노하우 저장소
    ├── README.md                 # 저장소 사용법 안내
    ├── must-check-items/         # 심사 시 반드시 확인할 사항
    ├── common-nonconformities/   # 자주 발생하는 부적합
    ├── interview-techniques/     # 심사 인터뷰 기법
    ├── follow-up-questions/      # 추적 심사 질문
    └── industry-risks/           # 업종별 핵심 리스크
```

---

## Proposed Changes

### Phase 1: 디자인 시스템 & 기반 구조

#### [NEW] [design-system.css](file:///e:/0000_ISO-%20Audit-Copilot/css/design-system.css)
- CSS Custom Properties 기반 디자인 토큰
- Color System: Deep Navy, Premium Blue, AI Purple, Success Green, Warning Amber, Risk Red
- Typography: Inter + Pretendard (Google Fonts CDN)
- Glassmorphism 효과 (backdrop-filter, rgba backgrounds)
- 다크모드/라이트모드 변수
- Spacing, Border Radius, Shadow 토큰

#### [NEW] [components.css](file:///e:/0000_ISO-%20Audit-Copilot/css/components.css)
- Smart Cards (glassmorphism 효과)
- KPI Widgets
- Buttons (Primary, Secondary, Ghost, Danger)
- Form Elements (Input, Select, Textarea)
- Badges, Tags, Status Indicators
- Modal, Dropdown, Tooltip
- AI Chat Bubble
- Data Tables
- Progress Bars, Meters

#### [NEW] [layout.css](file:///e:/0000_ISO-%20Audit-Copilot/css/layout.css)
- CSS Grid 기반 메인 레이아웃
- Sidebar Navigation
- Responsive Breakpoints (Desktop ≥1200px, Tablet ≥768px, Mobile <768px)
- Collapsible Sidebar
- Bottom Navigation (Mobile)

#### [NEW] [animations.css](file:///e:/0000_ISO-%20Audit-Copilot/css/animations.css)
- Fade In/Out
- Slide Up/Down
- Hover Effects
- Micro Interactions
- Loading Animations
- Page Transitions

---

### Phase 2: Landing Page + 로그인

#### [NEW] [index.html](file:///e:/0000_ISO-%20Audit-Copilot/index.html)
- Hero Section: 메인 카피 + CTA 버튼 + AI 데모 애니메이션
- Features Section: 9개 모듈 카드 소개
- Pricing Section: FREE/PRO/ENTERPRISE 요금표
- Semiconductor Package Section: 반도체 산업 특화 소개
- Social Proof Section: 신뢰 지표
- CTA Footer: 회원가입/무료체험 유도

#### [NEW] [login.html](file:///e:/0000_ISO-%20Audit-Copilot/login.html)
- 로그인 폼 (이메일/비밀번호)
- 회원가입 폼 (이름/이메일/비밀번호/조직명/역할)
- 로그인↔회원가입 전환 애니메이션
- Google Sheets API 연동

#### [NEW] [landing.css](file:///e:/0000_ISO-%20Audit-Copilot/css/pages/landing.css)
- 그라데이션 Hero 배경
- 모듈 카드 Grid
- Pricing Table
- 스크롤 애니메이션

#### [NEW] [login.css](file:///e:/0000_ISO-%20Audit-Copilot/css/pages/login.css)
- Glassmorphism 로그인 카드
- 폼 전환 애니메이션

---

### Phase 3: Google Apps Script 백엔드

#### [NEW] [Code.gs](file:///e:/0000_ISO-%20Audit-Copilot/google-apps-script/Code.gs)
- doGet/doPost 핸들러
- 회원가입 (비밀번호 SHA-256 해시)
- 로그인 (세션 토큰 발급)
- CRUD API 전체 엔드포인트
- CORS 설정

#### [NEW] [api.js](file:///e:/0000_ISO-%20Audit-Copilot/js/api.js)
- Google Apps Script Web App API 클라이언트
- `API_BASE_URL` 상수 (배포 후 교체)
- fetch wrapper (에러 핸들링, 토큰 자동 첨부)

#### [NEW] [auth.js](file:///e:/0000_ISO-%20Audit-Copilot/js/auth.js)
- 로그인/로그아웃 상태 관리
- 세션 토큰 localStorage 저장
- 인증 가드 (비로그인 시 리다이렉트)

---

### Phase 4: Dashboard

#### [NEW] [dashboard.html](file:///e:/0000_ISO-%20Audit-Copilot/dashboard.html)
- KPI Cards: 진행중 심사, 완료 심사, 부적합 건수, 리스크 레벨
- Audit Calendar / Timeline
- Recent Activities Feed
- Quick Actions Panel
- Quality To Profit Widget (COPQ, ROI)
- Risk Heat Map 미니 위젯

#### [NEW] [dashboard.css](file:///e:/0000_ISO-%20Audit-Copilot/css/pages/dashboard.css)

---

### Phase 5: Audit Workspace

#### [NEW] [workspace.html](file:///e:/0000_ISO-%20Audit-Copilot/workspace.html)
- Multi-Panel Layout
- ISO Clause Navigator Panel (Module 1)
- Audit Question Panel (Module 2)
- Evidence Upload & Analysis (Module 4)
- NC Writer Panel (Module 5)
- Inline AI Copilot

#### [NEW] [workspace.css](file:///e:/0000_ISO-%20Audit-Copilot/css/pages/workspace.css)

---

### Phase 6: AI Copilot

#### [NEW] [copilot.html](file:///e:/0000_ISO-%20Audit-Copilot/copilot.html)
- Chat Interface (Module 9)
- Quick Prompt Templates
- Context-Aware Suggestions
- Response with Source Citations
- Process Audit Tools (Module 3: SIPOC, Turtle Diagram)

#### [NEW] [copilot.css](file:///e:/0000_ISO-%20Audit-Copilot/css/pages/copilot.css)

---

### Phase 7: Knowledge Base

#### [NEW] [knowledge-base.html](file:///e:/0000_ISO-%20Audit-Copilot/knowledge-base.html)
- Document Library (업로드 자료 관리)
- Reference Links Manager (외부 링크 관리)
- Expert Knowledge Repository (노하우 관리)
- Search & Filter
- Tags & Categories

#### [NEW] [knowledge-base.css](file:///e:/0000_ISO-%20Audit-Copilot/css/pages/knowledge-base.css)

---

### Phase 8: Report Center, Admin, Subscription

#### [NEW] [reports.html](file:///e:/0000_ISO-%20Audit-Copilot/reports.html)
- Audit Report List
- Report Generator (Module 8)
- CAPA Tracker (Module 7)
- Risk Assessment Summary (Module 6)
- Export Options (PDF/DOCX/PPT)

#### [NEW] [admin.html](file:///e:/0000_ISO-%20Audit-Copilot/admin.html)
- User Management
- Organization Settings
- Audit Template Management
- System Configuration
- Usage Analytics

#### [NEW] [subscription.html](file:///e:/0000_ISO-%20Audit-Copilot/subscription.html)
- Pricing Cards (FREE/PRO/ENTERPRISE/MULTI AUDITOR/CONSULTANT/CERTIFICATION BODY)
- Feature Comparison Table
- Payment Flow UI
- Current Plan Status

---

### Phase 9: JavaScript 모듈

#### [NEW] 모듈 JS 파일들
- 9개 핵심 모듈 각각의 JavaScript 로직
- ISO 규격 데이터 (ISO 9001, 14001, 45001, IATF 16949, AS9100)
- 반도체 공정 데이터
- Quality To Profit 계산 엔진
- localStorage 기반 데이터 관리

---

### Phase 10: Knowledge Base / Reference Links / Expert Knowledge 저장소

#### [NEW] 저장소 폴더 + README
- `knowledge-base/` 하위 12개 카테고리 폴더 + README.md
- `reference-links/` 하위 7개 카테고리 폴더 + README.md + links.json
- `expert-knowledge/` 하위 5개 카테고리 폴더 + README.md

---

## 디자인 시스템 상세

### Color Palette
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--color-primary` | `#1B2A4A` (Deep Navy) | `#4A7CFF` (Bright Blue) |
| `--color-primary-light` | `#2E4A7A` | `#6B9AFF` |
| `--color-secondary` | `#1E6B45` (Starbucks Green) | `#2ECC71` |
| `--color-accent-ai` | `#7C3AED` (AI Purple) | `#A78BFA` |
| `--color-success` | `#059669` | `#34D399` |
| `--color-warning` | `#D97706` | `#FBBF24` |
| `--color-danger` | `#DC2626` | `#F87171` |
| `--color-surface` | `rgba(255,255,255,0.7)` | `rgba(30,30,50,0.7)` |
| `--color-glass` | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.05)` |

### Glassmorphism
```css
.glass-card {
  background: var(--color-glass);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
```

### Typography Scale
- Display: 48px / 700 weight
- H1: 36px / 700 weight
- H2: 28px / 600 weight
- H3: 22px / 600 weight
- Body: 16px / 400 weight
- Small: 14px / 400 weight
- Caption: 12px / 500 weight

---

## 구현 순서

| 순서 | 내용 | 파일 수 |
|------|------|--------|
| 1 | 저장소 폴더 생성 + README | ~30 |
| 2 | 디자인 시스템 CSS | 4 |
| 3 | Landing Page + Login Page | 4 |
| 4 | Google Apps Script + API + Auth JS | 3 |
| 5 | Navigation + Theme JS | 3 |
| 6 | Dashboard | 2 |
| 7 | Audit Workspace | 2 |
| 8 | AI Copilot | 2 |
| 9 | Knowledge Base | 2 |
| 10 | Reports / Admin / Subscription | 6 |
| 11 | JS 모듈 + 데이터 | ~15 |
| 12 | Vercel 배포 설정 | 1 |

---

## Verification Plan

### Automated Tests
- 각 HTML 페이지를 브라우저에서 열어 렌더링 확인
- 반응형 레이아웃 테스트 (Desktop/Tablet/Mobile 크기 조정)
- 다크/라이트 모드 전환 확인
- 네비게이션 링크 동작 확인
- 로그인/회원가입 폼 동작 확인

### Manual Verification
- Glassmorphism 효과 시각적 확인
- 애니메이션 및 마이크로 인터랙션 동작
- 모든 모듈 UI의 인터랙티브 요소 작동
- 모바일 레이아웃 적절성 확인
- Google Apps Script API 연동 테스트 (배포 후)

### Vercel 배포
- `vercel.json` 설정 확인
- 정적 파일 라우팅 테스트
- HTTPS 환경에서 Google Apps Script API 호출 정상 작동 확인

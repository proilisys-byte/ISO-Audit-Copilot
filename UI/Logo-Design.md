# Audit Copilot Logo Specifications

본 문서는 **PRO ILI SMART Audit Copilot** 플랫폼의 로고 디자인 시스템, 규격, 색상 조합 및 자산 활용 가이드를 담고 있습니다.

---

## 🎨 로고 디자인 프리뷰 (Rendered SVG)

아래는 Markdown에서 직접 렌더링된 공식 고해상도 SVG 로고입니다. (GitHub 및 지원 브라우저에서 올바르게 노출됩니다.)

<div align="center" style="background: #0B0F19; padding: 40px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); margin: 20px 0;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120" width="400" height="96">
    <defs>
      <!-- Gradient Definition matching var(--gradient-accent) -->
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7C3AED" />
        <stop offset="100%" stop-color="#A78BFA" />
      </linearGradient>
      <!-- Premium Glow Effect -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <!-- Background Icon Shape -->
    <rect x="15" y="15" width="90" height="90" rx="24" fill="url(#logoGrad)" />
    <!-- Glowing Accent Inner Dot -->
    <circle cx="85" cy="35" r="5" fill="#FFFFFF" opacity="0.8" />
    <!-- Brand Acronym 'AC' -->
    <text x="60" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-weight="900" font-size="46" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">AC</text>
    <!-- Main Text Brand Name -->
    <text x="125" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-weight="800" font-size="38" fill="#FFFFFF">Audit Copilot</text>
    <!-- Subtitle matching Platform Subtitle -->
    <text x="127" y="93" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-weight="700" font-size="13" fill="#A78BFA" letter-spacing="6">PRO ILI SMART</text>
  </svg>
</div>

---

## 📐 디자인 명세 (Design Specifications)

### 1. 색상 체계 (Color Codes)
로고는 플랫폼의 메인 아이덴티티인 **AI & Premium**을 대변하기 위해 보라색 계열의 그라데이션을 사용합니다.

- **Primary Gradient (Accent Gradient)**:
  - 시작 색상: `#7C3AED` (Deep Violet)
  - 끝 색상: `#A78BFA` (Light Lavender)
  - 각도: `135도 (linear-gradient)`
- **텍스트 및 전면 아이콘 색상**: `#FFFFFF` (Pure White)
- **서브텍스트 색상**: `#A78BFA` (Light Lavender, 자투리 강조)

### 2. 서체 (Typography)
브랜드의 신뢰성과 테크 SaaS 감성을 살리기 위해 기하학적이고 현대적인 산세리프 서체를 사용합니다.

- **대표 서체**:
  - 영문: `Inter` (ExtraBold / Black)
  - 국문 동시 노출 영역: `Pretendard` 또는 `SUIT` (Bold)
- **로고 폰트 두께 (Font Weights)**:
  - 심볼 내 "AC" 약어: `900 (Black)`
  - 타이틀 "Audit Copilot": `800 (ExtraBold)`
  - 서브타이틀 "PRO ILI SMART": `700 (Bold)`

### 3. 구조와 비율 (Proportions)
- **심볼 아이콘**: `1:1 정사각 형태 (Border-radius: 26.6% / 24px 기준)`
- **간격 (Padding)**: 심볼 박스와 내부 "AC" 텍스트의 상하좌우 중심을 완벽히 매칭
- **텍스트 간격**: 메인 로고와 서브타이틀은 동일한 가로 정렬 라인(`x=125`)을 유지하여 통일성을 제공

---

## 💾 SVG 소스 코드 (SVG Source Code)

웹 디자인이나 그래픽 디자인 툴에 바로 가져다 쓸 수 있는 원본 SVG 코드입니다.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120" width="500" height="120">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#A78BFA" />
    </linearGradient>
  </defs>
  <rect x="15" y="15" width="90" height="90" rx="24" fill="url(#logoGrad)" />
  <circle cx="85" cy="35" r="5" fill="#FFFFFF" opacity="0.8" />
  <text x="60" y="76" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-weight="900" font-size="46" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">AC</text>
  <text x="125" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-weight="800" font-size="38" fill="#FFFFFF">Audit Copilot</text>
  <text x="127" y="93" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-weight="700" font-size="13" fill="#A78BFA" letter-spacing="6">PRO ILI SMART</text>
</svg>
```

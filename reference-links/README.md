# 🔗 Reference Links — 외부 참조 링크 저장소

> 심사 업무에 유용한 외부 웹사이트 링크를 관리합니다.

## 📂 폴더 구조

| 폴더 | 용도 | 예시 |
|------|------|------|
| `certification-bodies/` | 인증기관 관련 | KAB, KFQ, BSI, TÜV, DNV |
| `iso-guides/` | ISO 해설 사이트 | ISO.org, 규격 해설 블로그 |
| `ai-learning/` | AI 학습 사이트 | AI 활용 심사 기법 |
| `quality-blogs/` | 품질 전문 블로그 | ASQ, 품질경영 블로그 |
| `video-lectures/` | 유튜브 강의 | ISO 심사 교육 영상 |
| `regulations/` | 법규 사이트 | 산업안전보건법, 환경법규 |
| `industry-standards/` | 산업 표준 사이트 | KS, ASTM, JIS |

## 📋 사용법

1. `links.json` 파일에 링크를 JSON 형식으로 추가합니다.
2. 또는 해당 카테고리 폴더에 북마크 파일(.md)을 저장합니다.

## 📄 links.json 형식

```json
{
  "links": [
    {
      "category": "certification-bodies",
      "title": "한국인정기구 (KAB)",
      "url": "https://www.kab.or.kr",
      "description": "대한민국 공식 인정기구"
    }
  ]
}
```

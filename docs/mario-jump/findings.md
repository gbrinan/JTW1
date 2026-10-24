# Findings & Decisions

> **기술적 발견, 중요한 결정이 있을 때마다 이 파일을 즉시 업데이트하세요.**

## Requirements

- 외부 의존성 없는 단일 HTML 게임
- 세 시점(2D, 탑다운, 1인칭) 변형
- 효과음을 WAV로도 추출 가능

## Research Findings

### 코드베이스 구조

- 모든 파일은 800x450 논리 해상도 캔버스, `devicePixelRatio`로 스케일
- 입력은 `keys[e.code]` 맵, 게임 루프는 `update(); draw(); requestAnimationFrame`
- 월드 상태: `player`, `enemies`(`makeEnemies`), `monsters`(`makeMonsters`), `reset()`

### 기존 패턴

- 적은 구간(min/max) 왕복, 중력 영향 없음
- 몬스터는 사인파로 부유, 320px 이내면 플레이어 쪽으로 이동
- 효과음: `SFX_INSTRUMENTS`(부분음 비율/진폭/감쇠) + `SFX`(노트 이벤트) + `envelope()`

## Resources

### 문서

- [file-based-planning-workflow](https://github.com/ahastudio/file-based-planning-workflow)

### 코드 참조

- SFX 단일 출처: `mario-jump-A.html:37-90`
- WAV 렌더러: `render-sfx.js`

## Technical Decisions

| Decision | Rationale |
| -------- | --------- |
| SFX 블록을 마커 주석으로 감싸 `render-sfx.js`가 `new Function`으로 읽음 | 재생 코드와 렌더링이 같은 정의를 공유 |
| 사인 부분음 합성 (종/첼레스타/베이스) | 샘플 파일 없이 얼음 같은 음색 구현 |
| WAV는 32-bit float mono | 렌더러가 샘플을 그대로 기록, 변환 불필요 |
| 탑다운에서 점프를 z축으로 모델링 | 물길을 점프로 건너는 규칙 구현 |

## Issues Encountered

### 1. SFX 블록 중복

**문제**:

A와 B에 동일한 SFX 블록이 복제되어 있다.

**원인**:

각 HTML이 독립 실행 파일이어야 한다는 제약(CON-1).

**해결**:

변경 시 양쪽 동기화. 렌더러는 A만 읽는다.

**결과**:

미해결 (허용된 트레이드오프)

## Learnings

### 워크플로우 도입 (2026-10-24)

기존 파일을 file-based-planning-workflow 구조로 재정리하고 기능 문서를 `docs/mario-jump/`에 작성했다.

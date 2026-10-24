# 점프 게임

## Background

캔버스만으로 동작하는 단일 HTML 점프 게임을 시점별로 실험한다. 같은 스테이지(구덩이, 적, 떠다니는 몬스터, 깃발)를 세 가지 시점으로 구현한다.

## Goal

의존성 없이 브라우저에서 바로 실행되는 점프 게임 세 가지 변형과, 공통 효과음 파이프라인을 제공한다.

## How it works

### 변형

- `mario-jump.html`: 2D 횡스크롤. 효과음 없음.
- `mario-jump-A.html`: 탑다운. 점프는 z축, 물길을 점프로 건너고 적을 밟는다. 효과음 포함.
- `mario-jump-B.html`: 1인칭 원근 투영. 효과음 포함.

### 효과음

A, B의 `SFX-BEGIN ~ SFX-END` 블록이 Web Audio 재생과 `render-sfx.js`(WAV 렌더링)의 단일 출처다. `render-sfx.js`는 A 파일을 읽는다.

## Related Documents

- [spec.md](spec.md): 요구사항 및 상세 스펙
- [plan.md](plan.md): 기술 구현 계획
- [tasks.md](tasks.md): 작업 계획 및 추적
- [findings.md](findings.md): 기술적 발견사항 및 결정
- [progress.md](progress.md): 세션별 작업 내역

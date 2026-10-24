# Implementation Plan: 점프 게임

## Summary

각 변형은 독립된 단일 HTML(Canvas 2D)이며 `update()` → `draw()` 루프를 공유하는 구조다. 효과음은 MIDI 스타일 노트 이벤트를 사인 부분음 합성으로 재생/렌더링한다.

## Requirements

1. 이동/점프/충돌/적/몬스터/깃발 (spec.md FR-1, FR-2)
2. 효과음 재생과 WAV 렌더링 (FR-3, FR-5)

## Critical Files

### New Files

- 없음 (현재 구현 완료 상태를 문서화)

### Modified Files

- `mario-jump-A.html`: SFX 블록 수정 시 B와 동기화 필요

### Reference Files

- `mario-jump.html`: 기본 물리/충돌 로직
- `render-sfx.js`: A의 SFX 블록을 정규식으로 추출해 실행

## Architecture

### Event Flow

```text
keydown → initAudio() → keys[code] = true
requestAnimationFrame → update() → draw()
update(): 이동 → 충돌 해결 → 적/몬스터 → 낙사/클리어 → playSfx(name)
```

### 변형별 차이

```text
mario-jump.html   x/y 평면 + 중력, 카메라 x 추적
mario-jump-A.html x/y 지면 + z 점프, 깊이순 정렬 렌더링
mario-jump-B.html 원근 투영(project), 화가 알고리즘, 빌보드 스프라이트
```

## Implementation Steps

1. 기본 2D 횡스크롤 (`mario-jump.html`)
2. 탑다운 변형 + 효과음 (`mario-jump-A.html`)
3. 1인칭 변형 + 효과음 (`mario-jump-B.html`)
4. 효과음 WAV 렌더러 (`render-sfx.js`)

## Verification

### Build

빌드 없음.

### Test

```bash
node render-sfx.js
```

### Manual Test

1. 각 HTML을 열어 이동/점프/적 밟기/구덩이 낙사/클리어/R 재시작 확인
2. 첫 키 입력 후 효과음 재생 확인

## Considerations

### 기존 코드 재사용

SFX 블록은 A/B에 복제되어 있다. 변경 시 양쪽을 함께 수정한다.

### 호환성

`render-sfx.js`는 `// SFX-BEGIN`/`// SFX-END` 마커와 `mario-jump-A.html` 파일명에 의존한다.

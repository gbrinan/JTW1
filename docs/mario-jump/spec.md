# Feature Specification: 점프 게임

## Overview

플레이어가 이동과 점프로 장애물을 넘고, 적을 위에서 밟아 처치하며 깃발에 도달하면 클리어하는 게임. 시점이 다른 세 변형이 있다.

## User Scenarios & Testing (mandatory)

### User Story 1: 스테이지 클리어

- As: 플레이어는
- I: 이동과 점프로 깃발까지 갈 수 있다
- So: 스테이지를 클리어하기 위해

#### Acceptance Scenarios

Scenario 1: **깃발 도달**

- Given: 게임이 시작되었을 때
- When: 플레이어가 깃발에 닿으면
- Then: "CLEAR!" 문구가 표시되고 입력이 멈춘다

Scenario 2: **재시작**

- Given: 어느 상태에서든
- When: R 키를 누르면
- Then: 처음 위치와 적 상태로 초기화된다

### User Story 2: 위험 요소

- As: 플레이어는
- I: 적을 밟아 처치하거나 피할 수 있다
- So: 안전하게 진행하기 위해

#### Acceptance Scenarios

Scenario 1: **적 밟기**

- Given: 플레이어가 적 위에서 하강 중일 때
- When: 적과 접촉하면
- Then: 적이 사라지고 플레이어가 튕겨 오른다

Scenario 2: **피격 및 낙사**

- Given: 플레이어가 적/몬스터에 옆에서 닿거나 바닥 없는 곳(구덩이/물길)에 있을 때
- When: 접촉 또는 착지하면
- Then: 스테이지가 처음부터 다시 시작된다

## Functional Requirements (mandatory)

- FR-1: MUST 방향키/WASD로 이동하고 Space로 점프한다 (기본 변형은 ↑/W도 점프)
- FR-2: MUST 적은 구간을 왕복하고, 몬스터는 위아래로 떠다니며 가까우면 플레이어에게 다가온다
- FR-3: MUST 점프/밟기/사망/낙사/클리어 효과음을 재생한다 (A, B)
- FR-4: SHOULD 고해상도(retina) 화면에서 선명하게 렌더링한다
- FR-5: SHOULD 효과음을 WAV 파일로 렌더링할 수 있다

## Constraints (mandatory)

- CON-1: MUST 외부 라이브러리와 빌드 단계 없이 HTML 파일 하나로 동작한다
- CON-2: MUST 오디오는 첫 키 입력 이후에 초기화한다 (브라우저 자동재생 정책)
- CON-3: MUST 효과음 정의는 A/B에서 동일하게 유지한다

## Success Criteria (mandatory)

- SC-1: 세 파일 모두 브라우저에서 열어 콘솔 에러 없이 깃발까지 클리어 가능
- SC-2: `node render-sfx.js` 실행 시 `sfx/`에 5개 WAV(jump, stomp, die, fall, clear)가 생성된다

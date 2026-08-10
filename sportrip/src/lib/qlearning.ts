/**
 * Q-Learning 기반 맞춤 관광코스 추천
 * - 상태: 동반유형 × 코스타입(activity/food/attraction)
 * - 행동: 특정 코스 스팟 선택
 * - 보상: 클릭=+1, 즐겨찾기=+3, 공유=+2, 무시=-0.1
 */

export type SpotType = 'activity' | 'food' | 'attraction' | 'festival';
export type CompanionType = 'solo' | 'couple' | 'family' | 'friend' | 'senior';

export interface QState {
  qtable: Record<string, number>;       // "companion:spotType:spotName" → Q값
  visitCount: Record<string, number>;   // 방문 횟수
  companion: CompanionType;
  totalReward: number;
  epsilon: number;                      // 탐색률 (이용할수록 낮아짐)
}

const ALPHA = 0.3;   // 학습률
const GAMMA = 0.9;   // 할인율
const EPSILON_DECAY = 0.98;

export function initQState(): QState {
  return { qtable: {}, visitCount: {}, companion: 'solo', totalReward: 0, epsilon: 0.8 };
}

export function loadQState(): QState {
  if (typeof window === 'undefined') return initQState();
  try {
    const s = localStorage.getItem('sportrip_qstate');
    return s ? JSON.parse(s) : initQState();
  } catch { return initQState(); }
}

export function saveQState(state: QState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sportrip_qstate', JSON.stringify(state));
}

function qKey(companion: CompanionType, type: SpotType, name: string) {
  return `${companion}:${type}:${name.slice(0, 10)}`;
}

export function updateQ(state: QState, type: SpotType, name: string, reward: number): QState {
  const key = qKey(state.companion, type, name);
  const current = state.qtable[key] ?? 0;
  const newQ = current + ALPHA * (reward + GAMMA * current - current);
  const newEpsilon = Math.max(0.1, state.epsilon * EPSILON_DECAY);
  const newState = {
    ...state,
    qtable: { ...state.qtable, [key]: newQ },
    visitCount: { ...state.visitCount, [key]: (state.visitCount[key] ?? 0) + 1 },
    totalReward: state.totalReward + reward,
    epsilon: newEpsilon,
  };
  saveQState(newState);
  return newState;
}

export function getQScore(state: QState, type: SpotType, name: string): number {
  return state.qtable[qKey(state.companion, type, name)] ?? 0;
}

// 동반유형별 기본 가중치 (Q-Learning 없을 때 초기 편향)
const COMPANION_BIAS: Record<CompanionType, Record<SpotType, number>> = {
  solo:   { activity: 1.2, food: 1.0, attraction: 1.1, festival: 0.8 },
  couple: { activity: 0.9, food: 1.2, attraction: 1.2, festival: 1.3 },
  family: { activity: 1.3, food: 1.3, attraction: 0.9, festival: 1.2 },
  friend: { activity: 1.4, food: 1.3, attraction: 0.7, festival: 1.1 },
  senior: { activity: 0.5, food: 1.0, attraction: 1.5, festival: 0.9 },
};

export function rankSpots<T extends { type: SpotType; name: string }>(
  spots: T[], state: QState
): T[] {
  const bias = COMPANION_BIAS[state.companion];
  return [...spots].sort((a, b) => {
    const qa = getQScore(state, a.type, a.name) + (bias[a.type] ?? 1);
    const qb = getQScore(state, b.type, b.name) + (bias[b.type] ?? 1);
    return qb - qa;
  });
}

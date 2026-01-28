// src/types/race.ts

export type RaceStatus = 'WAITING' | 'RUNNING' | 'FINISHED'

export interface Race {
  id: string // "20250119_1400" 또는 "20250119_1430"
  status: RaceStatus
  start_time: string // ISO timestamp
  seed: string
  result: number[] | null // [3, 1, 5, 2, ...] 순위
  created_at: string
}

export interface Turtle {
  id: number
  name: string
  emoji: string
  color: string
  speed: number // 기본 속도
  odds: {
    win: number // 단승 배당
    place: number // 연승 배당
  }
}

// 거북이 설정 (8마리)
export const TURTLES: Turtle[] = [
  { id: 1, name: '번개', emoji: '⚡', color: '#FF6B6B', speed: 1.2, odds: { win: 2.5, place: 1.3 } },
  { id: 2, name: '질풍', emoji: '💨', color: '#4ECDC4', speed: 1.15, odds: { win: 3.0, place: 1.5 } },
  { id: 3, name: '천둥', emoji: '🌩️', color: '#45B7D1', speed: 1.1, odds: { win: 3.5, place: 1.7 } },
  { id: 4, name: '폭풍', emoji: '🌪️', color: '#96CEB4', speed: 1.05, odds: { win: 4.0, place: 2.0 } },
  { id: 5, name: '태풍', emoji: '🌀', color: '#FFEAA7', speed: 1.0, odds: { win: 5.0, place: 2.3 } },
  { id: 6, name: '용오름', emoji: '🐉', color: '#DFE6E9', speed: 0.95, odds: { win: 6.5, place: 2.7 } },
  { id: 7, name: '허리케인', emoji: '🌊', color: '#A29BFE', speed: 0.9, odds: { win: 8.0, place: 3.2 } },
  { id: 8, name: '회오리', emoji: '🌫️', color: '#FD79A8', speed: 0.85, odds: { win: 10.0, place: 4.0 } }
]

export const RACE_DURATION = 30 // 초
export const BET_CLOSE_BEFORE = 5 // 경주 시작 5초 전 배팅 마감
export const RACE_INTERVAL = 30 // 30분 간격
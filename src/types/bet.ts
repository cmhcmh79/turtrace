// src/types/bet.ts

export type BetType = 'win'|'place' // 나중에 'place', 'quinella' 추가

export interface Bet {
  id: string
  race_id: string
  user_id: string
  bet_type: BetType
  horses: number[] // [3] 또는 [2, 5] (쌍승식)
  amount: number
  odds: number
  is_winner: boolean | null
  payout: number | null
  created_at: string
}

export interface BetInput {
  race_id: string
  user_id: string
  bet_type: BetType
  horses: number[]
  amount: number
}

// 배팅 금액 옵션
export const BET_AMOUNTS = [
  1000,
  5000,
  10000,
  50000,
  100000
]

// 배팅 제한
export const MIN_BET = 1000
export const MAX_BET = 1000000
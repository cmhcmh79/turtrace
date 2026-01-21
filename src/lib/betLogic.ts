// src/lib/betLogic.ts
import { Bet, BetType } from '@/types/bet'
import { TURTLES } from '@/types/race'

/**
 * 단승 배팅 당첨 여부 확인
 */
export function checkWinBet(bet: Bet, result: number[]): boolean {
  if (bet.bet_type !== 'win') return false
  return result[0] === bet.horses[0]
}

/**
 * 연승 배팅 당첨 여부 확인 (1~2등)
 */
export function checkPlaceBet(bet: Bet, result: number[]): boolean {
  if (bet.bet_type !== 'place') return false
  const top2 = result.slice(0, 2)
  return top2.includes(bet.horses[0])
}

/**
 * 배팅 당첨 여부 확인 (모든 타입)
 */
export function checkBetWinner(bet: Bet, result: number[]): boolean {
  switch (bet.bet_type) {
    case 'win':
      return checkWinBet(bet, result)
    // case 'place':
    //   return checkPlaceBet(bet, result)
    // 나중에 추가
    default:
      return false
  }
}

/**
 * 배당금 계산
 */
export function calculatePayout(bet: Bet): number {
  if (!bet.is_winner) return 0
  return Math.floor(bet.amount * bet.odds)
}

/**
 * 배팅 배당률 조회
 */
export function getOdds(betType: BetType, turtleId: number): number {
  const turtle = TURTLES.find(t => t.id === turtleId)
  if (!turtle) return 1

  switch (betType) {
    case 'win':
      return turtle.odds.win
    // case 'place':
    //   return turtle.odds.place
    default:
      return 1
  }
}

/**
 * 배팅 유효성 검증
 */
export function validateBet(
  betType: BetType,
  horses: number[],
  amount: number
): { valid: boolean; error?: string } {
  // 금액 검증
  if (amount < 1000) {
    return { valid: false, error: '최소 배팅 금액은 1,000원입니다' }
  }
  if (amount > 1000000) {
    return { valid: false, error: '최대 배팅 금액은 1,000,000원입니다' }
  }

  // 거북이 선택 검증
  if (horses.length === 0) {
    return { valid: false, error: '거북이를 선택해주세요' }
  }

  // 단승: 1마리만
  if (betType === 'win' && horses.length !== 1) {
    return { valid: false, error: '단승은 1마리만 선택해야 합니다' }
  }

  // 거북이 ID 유효성
  const validIds = horses.every(id => id >= 1 && id <= 8)
  if (!validIds) {
    return { valid: false, error: '잘못된 거북이 ID입니다' }
  }

  return { valid: true }
}
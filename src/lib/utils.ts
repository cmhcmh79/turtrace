// src/lib/utils.ts

/**
 * 금액 포맷 (1000 → 1,000원)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

/**
 * 날짜 포맷
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * 시간 차이 계산 (초)
 */
export function getTimeDiff(targetTime: string): number {
  const now = new Date().getTime()
  const target = new Date(targetTime).getTime()
  return Math.floor((target - now) / 1000)
}

/**
 * 카운트다운 포맷 (123초 → 2:03)
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Race ID 생성 (현재 30분 슬롯)
 */
export function getCurrentRaceId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  
  // 30분 단위로 변경
  const minute = now.getMinutes() < 30 ? '00' : '30'
  
  return `${year}${month}${day}_${hour}${minute}`
}

/**
 * 다음 30분 슬롯 시간 계산
 */
export function getNextRaceTime(): Date {
  const now = new Date()
  const minute = now.getMinutes()
  
  const next = new Date(now)
  
  // 현재 30분 미만이면 다음은 30분
  // 현재 30분 이상이면 다음 시간 00분
  if (minute < 30) {
    next.setMinutes(30)
  } else {
    next.setHours(next.getHours() + 1)
    next.setMinutes(0)
  }
  
  next.setSeconds(0)
  next.setMilliseconds(0)
  
  return next
}

/**
 * 배팅 마감 시간 확인
 */
export function isBettingClosed(raceStartTime: string): boolean {
  const diff = getTimeDiff(raceStartTime)
  return diff <= 5 // 5초 전 마감
}

/**
 * 클래스명 조합
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
// src/lib/raceLogic.ts
import { TURTLES, RACE_DURATION } from '@/types/race'

/**
 * Seed 기반 랜덤 생성기 (공정성 보장)
 */
class SeededRandom {
  private seed: number

  constructor(seed: string) {
    this.seed = this.hashString(seed)
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
}

/**
 * 레이스 시뮬레이션 (결정론적)
 * 같은 seed = 같은 결과
 */
export function simulateRace(seed: string): number[] {
  const rng = new SeededRandom(seed)
  
  // 각 거북이의 최종 시간 계산
  const finishTimes = TURTLES.map(turtle => {
    // 기본 속도 + 랜덤 요소
    const baseTime = RACE_DURATION / turtle.speed
    const randomFactor = 0.8 + rng.next() * 0.4 // 0.8 ~ 1.2
    return baseTime * randomFactor
  })

  // 시간 순으로 정렬하여 순위 결정
  const rankings = finishTimes
    .map((time, index) => ({ turtleId: index + 1, time }))
    .sort((a, b) => a.time - b.time)
    .map(item => item.turtleId)

  return rankings
}

/**
 * 레이스 애니메이션용 프레임 데이터 생성
 */
export function generateRaceFrames(seed: string, fps: number = 30): number[][] {
  const rng = new SeededRandom(seed)
  const totalFrames = RACE_DURATION * fps
  const frames: number[][] = []

  // 각 거북이의 속도 패턴 생성
  const speeds = TURTLES.map(turtle => {
    const baseSpeed = turtle.speed
    const variation = 0.8 + rng.next() * 0.4
    return baseSpeed * variation
  })

  // 프레임별 위치 계산
  for (let frame = 0; frame < totalFrames; frame++) {
    const positions = speeds.map((speed, index) => {
      const progress = (frame / totalFrames) * speed
      // 약간의 랜덤 변동 추가
      const wobble = Math.sin(frame * 0.1 + index) * 0.02
      return Math.min(progress + wobble, 1.0) // 0 ~ 1
    })
    frames.push(positions)
  }

  return frames
}

/**
 * 특정 프레임의 순위 계산
 */
export function getRankingsAtFrame(positions: number[]): number[] {
  return positions
    .map((pos, index) => ({ turtleId: index + 1, pos }))
    .sort((a, b) => b.pos - a.pos)
    .map(item => item.turtleId)
}
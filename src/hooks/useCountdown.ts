// src/hooks/useCountdown.ts
'use client'

import { useState, useEffect } from 'react'
import { getTimeDiff } from '@/lib/utils'

interface UseCountdownReturn {
  timeLeft: number // 초
  isActive: boolean
  progress: number // 0~1
}

export function useCountdown(
  targetTime: string, 
  totalDuration: number = 1800 // 30분 = 1800초
): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    // 초기 시간 계산
    const updateTime = () => {
      const diff = getTimeDiff(targetTime)
      setTimeLeft(Math.max(0, diff))
    }

    updateTime()

    // 1초마다 업데이트
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  const isActive = timeLeft > 0
  const progress = totalDuration > 0 
    ? Math.max(0, Math.min(1, 1 - (timeLeft / totalDuration)))
    : 0

  return {
    timeLeft,
    isActive,
    progress
  }
}
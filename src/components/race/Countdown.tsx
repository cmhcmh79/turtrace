// src/components/race/Countdown.tsx
'use client'

import { useCountdown } from '@/hooks/useCountdown'
import { formatCountdown } from '@/lib/utils'

interface CountdownProps {
  targetTime: string
}

export function Countdown({ targetTime }: CountdownProps) {
  const { timeLeft, isActive, progress } = useCountdown(targetTime, 600)

  return (
    <div>
      <h2>다음 레이스까지</h2>
      <div className="text-4xl font-bold">
        {formatCountdown(timeLeft)}
      </div>
      <div className="w-full bg-gray-200 rounded">
        <div 
          className="bg-blue-500 h-2 rounded transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
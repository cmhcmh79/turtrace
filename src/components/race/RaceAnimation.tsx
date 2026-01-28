// src/components/race/RaceAnimation.tsx
'use client'

import { useState, useEffect } from 'react'
import { TURTLES } from '@/types/race'

interface RaceAnimationProps {
  frames: number[][]  // DB에서 받은 프레임 데이터
  onComplete: (result: number[]) => void
  selectedTurtle?: number
}

export function RaceAnimation({
  frames,
  onComplete,
  selectedTurtle
}: RaceAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const FPS = 30
  const FINISH_LINE = 100  // 프레임 데이터의 최대값

  useEffect(() => {
    if (!frames || frames.length === 0) return

    let frameIndex = 0
    setCurrentFrame(0)
    setIsFinished(false)

    const interval = setInterval(() => {
      frameIndex++
      setCurrentFrame(frameIndex)

      if (frameIndex >= frames.length - 1) {
        clearInterval(interval)
        setIsFinished(true)

        const finalPositions = frames[frames.length - 1]

        const result = finalPositions
          .map((pos, index) => ({ turtleId: index + 1, pos }))
          .sort((a, b) => b.pos - a.pos)
          .map(item => item.turtleId)

        setTimeout(() => {
          onComplete(result)
        }, 500)
      }
    }, 1000 / FPS)

    return () => clearInterval(interval)
  }, [frames, onComplete])

  if (!frames || frames.length === 0) {
    return <div className="text-center py-12">🐢 레이스 준비 중...</div>
  }

  const currentPositions = frames[Math.min(currentFrame, frames.length - 1)]

  const currentRankings = currentPositions
    .map((pos, index) => ({ turtleId: index + 1, pos }))
    .sort((a, b) => b.pos - a.pos)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="space-y-5 mb-8">
        {TURTLES.map((turtle, index) => {
          const position = currentPositions[index]
          const safePosition = Math.min(Math.max(position / FINISH_LINE, 0), 1)
          const isSelected = turtle.id === selectedTurtle
          const rank =
            currentRankings.findIndex(r => r.turtleId === turtle.id) + 1
          const isLeader = rank === 1 && !isFinished

          return (
            <div key={turtle.id} className="relative">
              <div
                className={`h-20 rounded-xl border-4 relative overflow-hidden flex items-center ${
                  isSelected
                    ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-blue-50'
                    : 'border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50'
                }`}
              >
                <div className="absolute right-2 top-0 bottom-0 w-1 bg-red-500 opacity-70">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 whitespace-nowrap">
                    🏁 FINISH
                  </div>
                </div>

                <div
                  className="absolute transition-all duration-100 linear"
                  style={{
                    left: `calc(${safePosition * 100}% - 24px)`
                  }}
                >
                  <div
                    className={`text-5xl ${
                      isLeader ? 'animate-pulse scale-110' : ''
                    }`}
                  >
                    {turtle.emoji}
                  </div>

                  {isFinished && rank === 1 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                      👑
                    </div>
                  )}
                </div>

                <div className="absolute -right-10 top-1/2 -translate-y-1/2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow-lg ${
                      rank === 1
                        ? 'bg-yellow-400 text-white'
                        : rank === 2
                        ? 'bg-gray-400 text-white'
                        : rank === 3
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {rank}
                  </div>
                </div>
              </div>

              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-1 rounded shadow">
                <span className="font-bold text-sm">{turtle.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-4">
        {isFinished ? (
          <div className="text-green-600 font-extrabold text-xl animate-pulse">
            🏁 레이스 종료!
          </div>
        ) : (
          <div className="text-blue-600 font-extrabold text-xl">
            🏃 레이스 진행 중...
          </div>
        )}
      </div>
    </div>
  )
}

export default RaceAnimation
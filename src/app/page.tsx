// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { TURTLES } from '@/types/race'
import RaceAnimation from '@/components/race/RaceAnimation'
import RaceResultModal from '@/components/race/RaceResultModal'
import { useRaces } from '@/hooks/useRace'

type GameState = 'IDLE' | 'RACE_SELECT' | 'BETTING' | 'RACING'

export default function GamePage() {
  const { races, loading, error } = useRaces()
  
  const [gameState, setGameState] = useState<GameState>('IDLE')
  const [selectedRace, setSelectedRace] = useState<number | null>(null)
  const [selectedTurtle, setSelectedTurtle] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState(10000)
  const [raceResult, setRaceResult] = useState<number[]>([])
  const [balance, setBalance] = useState(1_000_000)
  const [showResult, setShowResult] = useState(false)

  // 현재 레이스 데이터
  const currentRace = selectedRace !== null ? races[selectedRace] : null

  /* =====================
     게임 흐름
  ===================== */

  const startGame = () => {
    setGameState('RACE_SELECT')
  }

  const selectRace = (raceIndex: number) => {
    setSelectedRace(raceIndex)
    setSelectedTurtle(null)
    setRaceResult([])
    setShowResult(false)
    setGameState('BETTING')
  }

  const confirmBet = () => {
    if (!selectedTurtle) {
      alert('거북이를 선택해주세요!')
      return
    }

    if (betAmount > balance) {
      alert('잔액이 부족합니다!')
      return
    }

    setBalance(prev => prev - betAmount)
    setGameState('RACING')
  }

  /* =====================
     레이스 종료 처리
  ===================== */

  const handleRaceComplete = (result: number[]) => {
    setRaceResult(result)

    const winner = result[0]
    const won = winner === selectedTurtle

    if (won && selectedTurtle) {
      const turtle = TURTLES.find(t => t.id === selectedTurtle)
      const prize = Math.floor(betAmount * (turtle?.odds.win || 1))
      setBalance(prev => prev + prize)
    }

    setShowResult(true)
  }

  /* =====================
     렌더링
  ===================== */

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐢</div>
          <div className="text-xl font-bold">레이스 데이터 로딩 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl font-bold mb-2">에러 발생</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 p-4">
      <div className="container mx-auto max-w-5xl">

        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2">🐢 Turtrace</h1>
          <p className="text-gray-600">거북이 레이스 게임</p>
        </div>

        {/* 잔액 */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex justify-between">
          <span className="text-gray-600">현재 잔액</span>
          <span className="text-2xl font-bold text-blue-600">
            {balance.toLocaleString()}원
          </span>
        </div>

        {/* IDLE - 시작 화면 */}
        {gameState === 'IDLE' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">🐢</div>
            <h2 className="text-3xl font-bold mb-4">거북이 레이스</h2>
            <p className="text-gray-600 mb-6">
              오늘의 레이스: {races.length}경기
            </p>
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-12 rounded-xl transition"
            >
              게임 시작
            </button>
          </div>
        )}

        {/* RACE_SELECT - 레이스 선택 */}
        {gameState === 'RACE_SELECT' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">레이스 선택</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {races.map((race, index) => (
                <button
                  key={race.id}
                  onClick={() => selectRace(index)}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="text-3xl mb-2">🏁</div>
                  <div className="font-bold text-lg">제 {race.race_number}경주</div>
                  <div className="text-sm text-gray-600">{race.start_time}</div>
                  <div className="text-xs text-blue-600 mt-2">
                    {race.status === 'completed' ? '완료' : '진행 가능'}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setGameState('IDLE')}
              className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition"
            >
              뒤로가기
            </button>
          </div>
        )}

        {/* BETTING - 거북이 선택 */}
        {gameState === 'BETTING' && currentRace && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">
                  제 {currentRace.race_number}경주 - 거북이 선택
                </h3>
                <span className="text-sm text-gray-600">
                  {currentRace.start_time}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TURTLES.map(turtle => (
                  <button
                    key={turtle.id}
                    onClick={() => setSelectedTurtle(turtle.id)}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedTurtle === turtle.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl">{turtle.emoji}</div>
                    <div className="font-bold">{turtle.name}</div>
                    <div className="text-sm text-blue-600">
                      x{turtle.odds.win}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setGameState('RACE_SELECT')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xl font-bold py-4 rounded-xl transition"
              >
                레이스 재선택
              </button>
              <button
                onClick={confirmBet}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-xl transition"
              >
                배팅 확정
              </button>
            </div>
          </div>
        )}

        {/* RACING - 레이스 진행 */}
        {gameState === 'RACING' && currentRace && (
          <div>
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">제 {currentRace.race_number}경주</span>
                <span className="text-sm text-gray-600">
                  배팅: {betAmount.toLocaleString()}원
                </span>
              </div>
            </div>
            <RaceAnimation
              frames={currentRace.frames}
              selectedTurtle={selectedTurtle || undefined}
              onComplete={handleRaceComplete}
            />
          </div>
        )}
      </div>

      {/* 결과 팝업 */}
      <RaceResultModal
        open={showResult}
        result={raceResult}
        selectedTurtle={selectedTurtle || undefined}
        multiplier={
          selectedTurtle
            ? TURTLES.find(t => t.id === selectedTurtle)?.odds.win || 1
            : 1
        }
        betAmount={betAmount}
        onClose={() => {
          setShowResult(false)
          setGameState('IDLE')
        }}
      />
    </div>
  )
}
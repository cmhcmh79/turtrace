// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TestResult {
  step: string
  status: 'loading' | 'success' | 'error'
  message: string
}

export default function Home() {
  const [tests, setTests] = useState<TestResult[]>([
    { step: '환경변수', status: 'loading', message: '확인 중...' },
    { step: 'Supabase 연결', status: 'loading', message: '확인 중...' },
    { step: 'DB 테이블', status: 'loading', message: '확인 중...' },
  ])

  // ✅ 레이스 생성 상태
  const [createResult, setCreateResult] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    runTests()
  }, [])

  /* =====================
     테스트 실행
  ===================== */
  const runTests = async () => {
    // 1. 환경변수 확인
    const hasEnv = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    updateTest(
      0,
      hasEnv ? 'success' : 'error',
      hasEnv
        ? `✅ URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30)}...`
        : '❌ 환경변수 없음! .env.local 확인 필요'
    )

    if (!hasEnv) return

    // 2. Supabase 연결 확인
    try {
      const { error } = await supabase
        .from('races')
        .select('id')
        .limit(1)

      if (error) throw error

      updateTest(1, 'success', '✅ Supabase 연결 성공!')
    } catch (error: any) {
      updateTest(1, 'error', `❌ 연결 실패: ${error.message}`)
      return
    }

    // 3. races 테이블 조회
    try {
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(3)

      if (error) throw error

      updateTest(
        2,
        'success',
        `✅ races 테이블 정상 (${data?.length || 0}개 레이스)`
      )
    } catch (error: any) {
      updateTest(2, 'error', `❌ 테이블 조회 실패: ${error.message}`)
    }
  }

  /* =====================
     테스트 결과 업데이트
  ===================== */
  const updateTest = (
    index: number,
    status: TestResult['status'],
    message: string
  ) => {
    setTests(prev => {
      const newTests = [...prev]
      newTests[index] = { ...newTests[index], status, message }
      return newTests
    })
  }

  /* =====================
     테스트 레이스 생성 (POST)
  ===================== */
  const createTestRace = async () => {
    setCreating(true)
    setCreateResult(null)

    try {
      const res = await fetch('/api/race/test', {
        method: 'POST',
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || '레이스 생성 실패')
      }

      setCreateResult(`✅ 테스트 레이스 생성 완료 (ID: ${json.race.id})`)
    } catch (error: any) {
      setCreateResult(`❌ 실패: ${error.message}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* =====================
            상단 카드
        ===================== */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            🐢 Turtrace
          </h1>
          <p className="text-center text-gray-600 mb-8">
            세팅 확인 페이지
          </p>

          {/* 테스트 결과 */}
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  test.status === 'loading'
                    ? 'bg-gray-50 border-gray-200'
                    : test.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {test.status === 'loading'
                      ? '⏳'
                      : test.status === 'success'
                      ? '✅'
                      : '❌'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {test.step}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {test.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 다시 테스트 */}
          <button
            onClick={runTests}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🔄 다시 테스트
          </button>

          {/* 테스트 레이스 생성 버튼 */}
          <button
            onClick={createTestRace}
            disabled={creating}
            className={`mt-4 w-full font-semibold py-3 px-6 rounded-lg transition-colors
              ${
                creating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
          >
            🏁 테스트 레이스 생성 (POST)
          </button>

          {/* 레이스 생성 결과 */}
          {createResult && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                createResult.startsWith('✅')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {createResult}
            </div>
          )}
        </div>


      </div>
    </div>
  )
}

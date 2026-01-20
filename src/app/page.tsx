// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'  // ✅ supabase만 import

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

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    // 1. 환경변수 확인
    const hasEnv = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    updateTest(0, hasEnv ? 'success' : 'error', 
      hasEnv 
        ? `✅ URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30)}...`
        : '❌ 환경변수 없음! .env.local 확인 필요'
    )

    if (!hasEnv) return

    // 2. Supabase 연결 확인
    try {
      const { data, error } = await supabase
        .from('races')
        .select('count')
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
      
      updateTest(2, 'success', 
        `✅ races 테이블 정상 (${data?.length || 0}개 레이스)`
      )
    } catch (error: any) {
      updateTest(2, 'error', `❌ 테이블 조회 실패: ${error.message}`)
    }
  }

  const updateTest = (index: number, status: TestResult['status'], message: string) => {
    setTests(prev => {
      const newTests = [...prev]
      newTests[index] = { ...newTests[index], status, message }
      return newTests
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            🐢 Turtrace
          </h1>
          <p className="text-center text-gray-600 mb-8">
            세팅 확인 페이지
          </p>

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
                    {test.status === 'loading' ? '⏳' : 
                     test.status === 'success' ? '✅' : '❌'}
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

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 다음 단계
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ 모든 테스트 통과 → 개발 시작 가능!</li>
              <li>❌ 테스트 실패 → 아래 해결 방법 확인</li>
            </ul>
          </div>

          <button
            onClick={runTests}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🔄 다시 테스트
          </button>
        </div>

        {/* 문제 해결 가이드 */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">🔧 문제 해결</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-red-600 mb-2">
                ❌ 환경변수 없음
              </h3>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`# .env.local 파일 확인
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...`}
              </pre>
              <p className="mt-2 text-gray-600">
                → 파일 저장 후 <code className="bg-gray-100 px-2 py-1 rounded">pnpm dev</code> 재시작
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-red-600 mb-2">
                ❌ Supabase 연결 실패
              </h3>
              <p className="text-gray-600">
                1. Supabase 대시보드에서 프로젝트가 "Active" 상태인지 확인<br/>
                2. API 키가 정확한지 재확인<br/>
                3. URL에 https:// 포함되어 있는지 확인
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-red-600 mb-2">
                ❌ 테이블 조회 실패
              </h3>
              <p className="text-gray-600">
                1. Supabase SQL Editor에서 테이블 생성 SQL 실행했는지 확인<br/>
                2. <code className="bg-gray-100 px-2 py-1 rounded">SELECT * FROM races;</code> 직접 실행해보기
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
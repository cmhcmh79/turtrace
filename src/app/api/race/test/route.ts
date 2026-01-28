// src/app/api/race/test/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // 테스트용 레이스 생성 (2분 후 시작)
    const startTime = new Date(Date.now() + 120000)
    const raceId = `test_${Date.now()}`

    const { data: race, error } = await supabaseAdmin
      .from('races')
      .insert({
        id: raceId,
        status: 'WAITING',
        start_time: startTime.toISOString(),
        seed: Math.random().toString(36).substring(7)
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: '테스트 레이스 생성 완료 (2분 후 시작)',
      race,
      info: {
        interval: '30분 간격 (00분, 30분)',
        duration: '30초',
        betting_close: '시작 5초 전'
      }
    })
  } catch (error) {
    console.error('Test Race Error:', error)
    return NextResponse.json(
      { error: '테스트 레이스 생성 실패' },
      { status: 500 }
    )
  }
}
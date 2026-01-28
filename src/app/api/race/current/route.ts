// src/app/api/race/current/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTimeDiff } from '@/lib/utils'

export async function GET() {
  console.log('🔍 Fetching current race...')

  try {

    // 현재 시간 기준으로 레이스 찾기
    const now = new Date().toISOString()

    // 1. RUNNING 또는 WAITING 상태의 레이스 찾기
    const { data: races, error } = await supabase
      .from('races')
      .select('*')
      .in('status', ['WAITING', 'RUNNING', 'FINISHED'])
      .gte('start_time', new Date(Date.now() - 30000).toISOString()) // 30초 전부터
      .order('start_time', { ascending: true })
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // 레이스가 없으면 404
    if (!races || races.length === 0) {
      return NextResponse.json(
        { error: '진행 중인 레이스가 없습니다' },
        { status: 404 }
      )
    }

    const race = races[0]
    const timeUntilStart = getTimeDiff(race.start_time)

    return NextResponse.json({
      race,
      timeUntilStart
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '레이스 정보를 가져올 수 없습니다' },
      { status: 500 }
    )
  }
}
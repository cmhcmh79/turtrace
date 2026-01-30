// src/app/api/race/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  console.log('[GET /api/race] 레이스 목록 조회 시작')
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not found')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // races 테이블에서 레이스 목록을 날짜 역순으로 가져오기
    const { data: races, error } = await supabase
      .from('races')
      .select('*')
      .order('date', { ascending: false })
      .order('race_number', { ascending: true })

    if (error) {
      console.error('[GET /api/race] Error fetching races:', error)
      throw error
    }

    console.log(`[GET /api/race] ${races?.length || 0}개의 레이스 조회 완료`)

    return NextResponse.json(races || [])

  } catch (error: any) {
    console.error('[GET /api/race] Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
// src/app/api/race/[id]/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: race, error } = await supabase
      .from('races')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !race) {
      return NextResponse.json(
        { error: '레이스를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ race })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '레이스 정보를 가져올 수 없습니다' },
      { status: 500 }
    )
  }
}
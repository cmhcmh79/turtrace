// src/app/api/race/ensure-today/route.ts

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Service Role Key 사용 (서버 측에서만 사용 가능)
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Supabase URL:', supabaseUrl)
    console.log('Has Service Key:', !!supabaseServiceKey)
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not found')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-daily-races`
    console.log('Calling:', functionUrl)

    // Edge Function 호출
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    console.log('Edge Function Response:', data)
    console.log('Response Status:', response.status)

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      ...data
    })

  } catch (error: any) {
    console.error('Error ensuring races:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
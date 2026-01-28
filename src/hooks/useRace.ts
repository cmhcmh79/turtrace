import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Race {
  id: string
  date: string
  race_number: number
  start_time: string
  seed: string
  frames: number[][]
  result: number[]
  status: string
}

export function useRaces() {
  console.log('useRaces called')

  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchRaces() {
      try {
        const today = new Date().toISOString().split('T')[0]

        // 1. 오늘 레이스가 있는지 확인
        const { data: existingRaces, error: fetchError } = await supabase
          .from('races')
          .select('*')
          .eq('date', today)
          .order('race_number', { ascending: true })

        if (fetchError) throw fetchError

        // 2. 레이스가 없으면 생성 요청
        if (!existingRaces || existingRaces.length === 0) {
          console.log('No races found for today, generating...')
          
          const response = await fetch('/api/race/ensure-today')
          const result = await response.json()
          
          if (!result.success) {
            throw new Error(result.error || 'Failed to generate races')
          }

          // 3. 다시 조회
          const { data: newRaces, error: refetchError } = await supabase
            .from('races')
            .select('*')
            .eq('date', today)
            .order('race_number', { ascending: true })

          if (refetchError) throw refetchError
          setRaces(newRaces || [])
        } else {
          setRaces(existingRaces)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching races:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchRaces()
  }, [supabase])

  return { races, loading, error }
}
// src/hooks/useRace.ts
'use client'

import { useState, useEffect } from 'react'
import { Race } from '@/types/race'

interface UseRaceReturn {
  race: Race | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRace(raceId?: string): UseRaceReturn {
  const [race, setRace] = useState<Race | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRace = async () => {
    try {
      setLoading(true)
      setError(null)

      const endpoint = raceId 
        ? `/api/race/${raceId}` 
        : '/api/race/current'
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('레이스 정보를 가져올 수 없습니다')
      }

      const data = await response.json()
      setRace(data.race)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
      setRace(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRace()

    // 30초마다 자동 갱신 (옵션)
    const interval = setInterval(fetchRace, 30000)
    
    return () => clearInterval(interval)
  }, [raceId])

  return {
    race,
    loading,
    error,
    refetch: fetchRace
  }
}
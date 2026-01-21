// src/hooks/useUserBets.ts
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Bet } from '@/types/bet'

interface UseUserBetsReturn {
  bets: Bet[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserBets(userId: string, raceId?: string): UseUserBetsReturn {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBets = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('bets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // 특정 레이스의 배팅만 조회
      if (raceId) {
        query = query.eq('race_id', raceId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setBets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
      setBets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      setBets([])
      setLoading(false)
      return
    }

    fetchBets()
  }, [userId, raceId])

  return {
    bets,
    loading,
    error,
    refetch: fetchBets
  }
}
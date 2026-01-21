// src/hooks/useBetting.ts
'use client'

import { useState } from 'react'
import { Bet, BetInput } from '@/types/bet'

interface UseBettingReturn {
  createBet: (input: BetInput) => Promise<Bet>
  loading: boolean
  error: string | null
}

export function useBetting(): UseBettingReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBet = async (input: BetInput): Promise<Bet> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '배팅에 실패했습니다')
      }

      const data = await response.json()
      return data.bet
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createBet,
    loading,
    error
  }
}
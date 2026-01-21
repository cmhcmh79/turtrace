// src/hooks/useRealtime.ts
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UseRealtimeReturn {
  subscribed: boolean
  presenceCount: number // 접속자 수
}

export function useRealtime(raceId: string): UseRealtimeReturn {
  const [subscribed, setSubscribed] = useState(false)
  const [presenceCount, setPresenceCount] = useState(0)

  useEffect(() => {
    if (!raceId) return

    const channel = supabase.channel(`race:${raceId}`)

    // Presence 구독
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const count = Object.keys(state).length
        setPresenceCount(count)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setSubscribed(true)
          // 자신을 Presence에 추가
          await channel.track({
            online_at: new Date().toISOString()
          })
        }
      })

    return () => {
      channel.unsubscribe()
      setSubscribed(false)
    }
  }, [raceId])

  return {
    subscribed,
    presenceCount
  }
}
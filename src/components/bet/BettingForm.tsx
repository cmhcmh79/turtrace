// src/components/bet/BettingForm.tsx
'use client'

import { useBetting } from '@/hooks/useBetting'

export function BettingForm({ raceId, turtleId }: Props) {
  const { createBet, loading, error } = useBetting()
  const [amount, setAmount] = useState(10000)

  const handleBet = async () => {
    try {
      const bet = await createBet({
        race_id: raceId,
        user_id: 'temp_user', // 임시
        bet_type: 'win',
        horses: [turtleId],
        amount
      })
      
      alert('배팅 성공!')
    } catch (err) {
      alert('배팅 실패: ' + error)
    }
  }

  return (
    <div>
      <input 
        type="number" 
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button 
        onClick={handleBet}
        disabled={loading}
      >
        {loading ? '배팅 중...' : '배팅하기'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
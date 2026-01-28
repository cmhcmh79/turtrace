'use client'

interface RaceResultModalProps {
  open: boolean
  result: number[]
  selectedTurtle?: number
  multiplier: number
  betAmount: number
  onClose: () => void
}

export default function RaceResultModal({
  open,
  result,
  selectedTurtle,
  multiplier,
  betAmount,
  onClose
}: RaceResultModalProps) {
  if (!open) return null

  const isWin = result[0] === selectedTurtle
  const payout = isWin ? betAmount * multiplier : 0

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[320px] text-center shadow-xl animate-scaleIn">
        <h2 className="text-2xl font-extrabold mb-3">
          {isWin ? '🎉 승리!' : '😢 패배'}
        </h2>

        <div className="mb-4 space-y-1">
          {result.slice(0, 3).map((id, i) => (
            <div key={id} className="font-bold">
              {i + 1}위 – 🐢 {id}
            </div>
          ))}
        </div>

        <div className="text-lg font-bold mb-4">
          {isWin ? (
            <span className="text-green-600">
              +{payout.toLocaleString()}원
            </span>
          ) : (
            <span className="text-gray-500">획득 없음</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700"
        >
          다음 레이스
        </button>
      </div>
    </div>
  )
}

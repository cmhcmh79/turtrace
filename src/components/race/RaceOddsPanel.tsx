interface OddsPanelProps {
  odds: Record<number, number>
  selectedTurtle?: number
}

export function RaceOddsPanel({ odds, selectedTurtle }: OddsPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-48">
      <h3 className="font-extrabold mb-3 text-center">💰 배당률</h3>

      <div className="space-y-2">
        {Object.entries(odds).map(([id, odd]) => {
          const turtleId = Number(id)
          const isSelected = turtleId === selectedTurtle

          return (
            <div
              key={id}
              className={`flex justify-between px-3 py-2 rounded-lg font-bold ${
                isSelected
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100'
              }`}
            >
              <span>🐢 {id}</span>
              <span>x{odd.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

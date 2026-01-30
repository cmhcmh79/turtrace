// src/app/races/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Race {
  id: string;
  date: string;
  race_number: number;
  start_time: string;
  seed: string;
  frames: any;
  result: any;
  status: string;
  created_at: string;
}

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  useEffect(() => {
    fetch('/api/race/ensure-today')
      .then(() => fetch('/api/races'))
      .then(res => res.json())
      .then(data => {
        setRaces(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-gray-500">⏳ 경기 일정 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <Link href="/" className="text-blue-600 hover:underline">
            ← 홈으로
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-4 flex items-center gap-2">
            🐢 오늘 경기 일정
          </h1>

          <p className="text-gray-600 mt-2">{today}</p>
          <p className="text-sm text-gray-500 mt-1">
            총 {races.length}개의 경주가 예정되어 있습니다
          </p>
        </div>

        {races.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-500 text-lg">오늘 예정된 경주가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {races.map((race) => {
              const statusStyle =
                race.status === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : race.status === 'ongoing'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-blue-500 bg-white';

              const statusText =
                race.status === 'completed'
                  ? '완료'
                  : race.status === 'ongoing'
                  ? '진행중'
                  : '예정';

              return (
                <Link
                  key={race.id}
                  href={`/races/${race.id}`}
                  className={`block border-l-4 ${statusStyle} rounded-xl shadow-sm hover:shadow-md transition p-6`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* 왼쪽 정보 */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-800">
                          {race.race_number}R
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 text-white">
                          {statusText}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>🕒 시작 시간: <strong>{race.start_time}</strong></p>
                        <p className="font-mono text-xs">
                          🔑 Seed: {race.seed.slice(0, 8)}...
                        </p>
                      </div>

                      {race.result && race.status === 'completed' && (
                        <div className="mt-3 text-sm text-green-700 bg-green-100 inline-block px-3 py-1 rounded">
                          🏁 결과 확정
                        </div>
                      )}
                    </div>

                    {/* 오른쪽 날짜 */}
                    <div className="text-right text-sm text-gray-500">
                      <div>생성일</div>
                      <div className="font-medium text-gray-800">
                        {new Date(race.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

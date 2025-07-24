"use client"

import { useEffect, useState } from "react";

const mockData = [
  { rank: 1, name: "Alice", score: 5 },
  { rank: 2, name: "Bob", score: 4 },
  { rank: 3, name: "Charlie", score: 3 },
  { rank: 4, name: "David", score: 2 },
  { rank: 5, name: "Eve", score: 1 },
];

const LeaderBoard = ({ score, nickname }) => {
  console.log("<LeaderBoard /> 렌더링 됨");

  const [players, setPlayers] = useState(mockData);

  useEffect(() => {
    // 사용자 점수를 mockData에 삽입 (중복 제거)
    const updated = [
      ...mockData.filter(player => player.name !== nickname), // 기존 중복 제거
      { name: nickname, score }, // 현재 사용자 점수 추가
    ];

    const ranked = updated
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));

    setPlayers(ranked);
  }, [score, nickname]);


  return (
    <div className="w-1/4 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 순위</h2>
      <div className="mb-4 text-center text-lg font-semibold text-blue-700">
        내 점수: {score}
      </div>
      <ul className="space-y-2">
        {players.map((user) => (
          <li
            key={user.name}
            className="flex justify-between bg-white rounded-lg shadow px-3 py-2"
          >
            <span className="font-semibold">{user.rank}위</span>
            <span>{user.name}</span>
            <span className="font-mono">{user.score}점</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
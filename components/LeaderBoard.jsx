"use client"

import { useEffect, useState } from "react";

const mockData = [
  { rank: 1, name: "Alice", score: 1200 },
  { rank: 2, name: "Bob", score: 1150 },
  { rank: 3, name: "Charlie", score: 1000 },
  { rank: 4, name: "David", score: 900 },
  { rank: 5, name: "Eve", score: 850 },
];

const LeaderBoard = () => {
  console.log("<LeaderBoard /> 렌더링 됨");

  const [players, setPlayers] = useState(mockData);

  // 점수 변경 시 rank 재계산
  const rankedPlayers = [...players]
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));

  // 점수 변경 시뮬레이션 (3초 후)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayers((prev) =>
        prev.map((player) =>
          player.name === "Eve"
            ? { ...player, score: player.score + 500 } // Eve가 급상승
            : player
        )
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-1/4 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 순위</h2>
      <ul className="space-y-2">
        {rankedPlayers.map((user) => (
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
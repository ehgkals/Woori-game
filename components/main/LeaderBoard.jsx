"use client"

import { useEffect, useState } from "react";

const LeaderBoard = ({ score, nickname }) => {
  console.log("<LeaderBoard /> 렌더링 됨");

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!Array.isArray(data)) return;

        const updated = [
          ...data.users.filter(player => player.nickname !== nickname),
          { nickname, score }, // 내 점수
        ];

        const ranked = updated
          .sort((a, b) => b.score - a.score)
          .map((player, index) => ({
            rank: index + 1,
            name: player.nickname,
            score: player.score,
          }));

        setPlayers(ranked);
      } catch (error) {
        console.error("리더보드 불러오기 실패:", error);
      }
    };

    fetchLeaderboard();
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
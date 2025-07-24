"use client";

import { useEffect, useState, useRef } from "react";

const LeaderBoard = ({ score, nickname, gameOver }) => {
  console.log("<LeaderBoard /> 렌더링 됨");

  const [players, setPlayers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://game-server-ihbh.onrender.com/");

    socketRef.current.onopen = () => {
      console.log("✅ Connected to WebSocket");

      if (!gameOver) {
        socketRef.current.send(
          JSON.stringify({
            type: "scoreUpdate",
            payload: { nickname, score },
          })
        );
      }
    };

    socketRef.current.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
      if (data.type === "leaderboard" && Array.isArray(data.payload)) {
        const ranked = data.payload
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((player, index) => ({ ...player, rank: index + 1 }));
        setPlayers(ranked);
      }
      } catch (err) {
        console.error("JSON 파싱 오류:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socketRef.current.close();
    };
  }, [nickname]);

  // score가 바뀔 때마다 서버에 점수 업데이트 전송
  useEffect(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      !gameOver &&
      nickname
    ) {
      socketRef.current.send(
        JSON.stringify({
          type: "scoreUpdate",
          payload: { nickname, score },
        })
      );
    }
  }, [score, nickname, gameOver]);

  return (
    <div className="w-1/4 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 순위</h2>
      <div className="mb-4 text-center text-lg font-semibold text-blue-700">
        내 점수: {score}
      </div>
      <ul className="space-y-2">
        {players.map((user) => (
          <li
            key={user.nickname}
            className="flex justify-between bg-white rounded-lg shadow px-3 py-2"
          >
            <span className="font-semibold">{user.rank}위</span>
            <span>{user.nickname}</span>
            <span className="font-mono">{user.score}점</span>
          </li>
        ))}
      </ul>
      {gameOver && (
        <div className="mt-4 text-center text-red-600 font-semibold">
          ⏰ 게임 종료, 점수판이 고정되었습니다.
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;

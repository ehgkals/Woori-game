"use client";

import { useEffect, useState, useRef } from "react";

const LeaderBoard = ({ score, nickname }) => {
  console.log("<LeaderBoard /> 렌더링 됨");

  const [players, setPlayers] = useState([]);
  const socketRef = useRef(null);

  // WebSocket 연결 (닉네임이 바뀔 때만 새로 연결)
  useEffect(() => {
    // ws:// 혹은 wss:// 로 시작하는 WebSocket URL로 연결해야 합니다.
    // 배포 URL에 맞게 수정하세요.
    socketRef.current = new WebSocket("wss://game-server-ihbh.onrender.com/");

    socketRef.current.onopen = () => {
      console.log("✅ Connected to WebSocket");

      // 최초 연결 시 현재 점수 전송
      socketRef.current.send(
        JSON.stringify({
          type: "scoreUpdate",
          payload: { nickname, score },
        })
      );
    };

    socketRef.current.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === "leaderboard" && Array.isArray(data.payload)) {
          // 서버에서 받은 점수판을 그대로 사용
          // (서버에서 이미 정렬되어 있으므로 재정렬은 생략 가능)
          const ranked = data.payload.map((player, index) => ({
            ...player,
            rank: index + 1,
          }));

          setPlayers(ranked);
        }
      } catch (err) {
        console.error("JSON 파싱 오류:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // 컴포넌트 언마운트 시 소켓 닫기
    return () => {
      socketRef.current.close();
    };
  }, [nickname]);

  // score가 바뀔 때마다 서버에 점수 업데이트 전송
  useEffect(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      nickname
    ) {
      socketRef.current.send(
        JSON.stringify({
          type: "scoreUpdate",
          payload: { nickname, score },
        })
      );
    }
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
            key={user.nickname}
            className="flex justify-between bg-white rounded-lg shadow px-3 py-2"
          >
            <span className="font-semibold">{user.rank}위</span>
            <span>{user.nickname}</span>
            <span className="font-mono">{user.score}점</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;

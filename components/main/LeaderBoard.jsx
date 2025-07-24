"use client"

import { useEffect, useState } from "react";

const LeaderBoard = ({ score, nickname }) => {
  console.log("<LeaderBoard /> 렌더링 됨");
  
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();

      // 응답 구조 확인
      if (!data.success || !Array.isArray(data.users)) {
        throw new Error("데이터 형식이 올바르지 않습니다");
      }

      // DB 데이터를 점수순으로 정렬
      const ranked = data.users
        .sort((a, b) => b.score - a.score)
        .map((player, index) => ({
          rank: index + 1,
          name: player.nickname,
          score: player.score,
          isCurrentUser: player.nickname === nickname
        }));

      setPlayers(ranked);
      setError(null);
    } catch (error) {
      console.error("리더보드 불러오기 실패:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // 10초마다 자동 업데이트 (실시간 느낌)
    const interval = setInterval(fetchLeaderboard, 10000);
    
    return () => clearInterval(interval);
  }, [nickname]); // nickname 변경시에만 즉시 업데이트

  // score가 변경되면 즉시 새로고침
  useEffect(() => {
    if (score !== undefined) {
      fetchLeaderboard();
    }
  }, [score]);

  if (loading && players.length === 0) {
    return (
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4 text-center">🏆 순위</h2>
        <div className="text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4 text-center">🏆 순위</h2>
        <div className="text-center text-red-500 text-sm mb-2">{error}</div>
        <button 
          onClick={fetchLeaderboard}
          className="w-full text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 현재 사용자의 순위 찾기
  const currentUserRank = players.find(p => p.isCurrentUser)?.rank;

  return (
    <div className="w-1/4 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 순위</h2>
      
      <div className="mb-4 text-center">
        <div className="text-lg font-semibold text-blue-700">
          내 점수: {score || 0}점
        </div>
        {currentUserRank && (
          <div className="text-sm text-gray-600">
            현재 순위: {currentUserRank}위
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {players.length > 0 ? (
          players.slice(0, 20).map((user) => ( // 상위 20명만 표시
            <li
              key={user.name}
              className={`flex justify-between rounded-lg shadow px-3 py-2 ${
                user.isCurrentUser 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'bg-white'
              }`}
            >
              <span className="font-semibold">
                {user.rank <= 3 ? (
                  <span className="text-lg">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  `${user.rank}위`
                )}
              </span>
              <span className={user.isCurrentUser ? 'font-bold' : ''}>
                {user.name}
              </span>
              <span className="font-mono">{user.score}점</span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">
            플레이어가 없습니다
          </li>
        )}
      </ul>

      <div className="mt-4 text-center">
        <button 
          onClick={fetchLeaderboard}
          className="text-xs text-blue-500 hover:text-blue-700"
          disabled={loading}
        >
          {loading ? '🔄 업데이트 중...' : '🔄 새로고침'}
        </button>
      </div>
    </div>
  );
};

export default LeaderBoard;
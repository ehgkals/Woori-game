"use client"

import { useEffect, useState } from "react";

const LeaderBoard = ({ currentScore, nickname, gameStatus, allPlayers }) => {
  console.log("🏆 <LeaderBoard /> 렌더링됨 - props:", { currentScore, nickname, gameStatus });
  
  const [sessionPlayers, setSessionPlayers] = useState([]);

  // 매판 세션 플레이어들 관리
  useEffect(() => {
    console.log("📊 세션 플레이어 업데이트:", { allPlayers, currentScore, nickname });
    
    if (!allPlayers || !Array.isArray(allPlayers)) {
      console.log("❌ allPlayers가 없거나 배열이 아님");
      return;
    }

    // 현재 세션의 모든 플레이어들을 점수순으로 정렬
    const ranked = allPlayers
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        rank: index + 1,
        name: player.nickname,
        score: player.score,
        isCurrentUser: player.nickname === nickname
      }));

    setSessionPlayers(ranked);
    console.log("✅ 세션 랭킹 업데이트:", ranked);
  }, [allPlayers, currentScore, nickname]);

  return (
    <div className="w-1/4 p-4 overflow-y-auto bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">🏆 현재 게임 랭킹</h2>
      
      {/* 내 현재 점수 */}
      <div className="mb-6 p-4 bg-blue-900 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-300">
          {currentScore || 0}점
        </div>
        <div className="text-sm text-blue-200">
          내 현재 점수
        </div>
        {sessionPlayers.length > 0 && (
          <div className="text-xs text-blue-200 mt-1">
            {sessionPlayers.length}명 중 {sessionPlayers.findIndex(p => p.isCurrentUser) + 1 || sessionPlayers.length}위
          </div>
        )}
      </div>

      {/* 세션 랭킹 리스트 */}
      <div className="space-y-2">
        <div className="text-center text-sm text-gray-400 mb-3">
          현재 게임 참여자 랭킹
        </div>
        
        {sessionPlayers.length > 0 ? (
          sessionPlayers.map((player) => (
            <div
              key={player.name}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                player.isCurrentUser 
                  ? 'bg-yellow-600 border-2 border-yellow-400 transform scale-105' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg min-w-[2rem]">
                  {player.rank <= 3 ? (
                    <span className="text-2xl">
                      {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-gray-400">{player.rank}위</span>
                  )}
                </span>
                <span className={`${player.isCurrentUser ? 'font-bold text-white' : 'text-gray-300'}`}>
                  {player.name}
                  {player.isCurrentUser && <span className="ml-2 text-yellow-300">(나)</span>}
                </span>
              </div>
              <span className={`font-mono font-bold text-lg ${
                player.isCurrentUser ? 'text-yellow-100' : 'text-white'
              }`}>
                {player.score}점
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🎮</div>
            <div>아직 플레이어가 없습니다</div>
            <div className="text-sm mt-1">게임을 시작해보세요!</div>
          </div>
        )}
      </div>

      {/* 게임 상태 표시 */}
      <div className="mt-6 text-center">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          gameStatus === 'playing' 
            ? 'bg-green-600 text-green-100' 
            : gameStatus === 'ended'
            ? 'bg-red-600 text-red-100'
            : 'bg-gray-600 text-gray-100'
        }`}>
          {gameStatus === 'playing' ? '🎮 게임 중' : 
           gameStatus === 'ended' ? '🏁 게임 종료' : '⏸️ 대기 중'}
        </div>
      </div>

      {/* 실시간 업데이트 표시 */}
      {gameStatus === 'playing' && (
        <div className="mt-4 text-xs text-center text-gray-400">
          <div className="animate-pulse">📡 실시간 업데이트</div>
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
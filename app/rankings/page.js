"use client"

import { useEffect, useState } from "react";

const RankingPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 랭킹 데이터 가져오기
  const fetchRanking = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('랭킹 데이터를 불러올 수 없습니다');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // 점수순으로 정렬하고 순위 추가
        const rankedPlayers = data.users
          .sort((a, b) => b.score - a.score)
          .map((player, index) => ({
            ...player,
            rank: index + 1
          }));
        
        setPlayers(rankedPlayers);
        setLastUpdated(new Date());
        setError(null);
      } else {
        throw new Error(data.error || '데이터 로드 실패');
      }
    } catch (err) {
      console.error('랭킹 로드 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
    
    // 30초마다 자동 업데이트
    const interval = setInterval(fetchRanking, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // 순위별 스타일
  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
    if (rank <= 10) return 'bg-blue-50 border-blue-200';
    return 'bg-white';
  };

  // 순위별 아이콘
  const getRankIcon = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}위`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">랭킹을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchRanking}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 플레이어 랭킹
          </h1>
          <p className="text-gray-600">
            총 {players.length}명의 플레이어가 등록되어 있습니다
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              마지막 업데이트: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* 새로고침 버튼 */}
        <div className="text-center mb-6">
          <button 
            onClick={fetchRanking}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
          >
            🔄 새로고침
          </button>
        </div>

        {/* 랭킹 리스트 */}
        {players.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700">
                <div>순위</div>
                <div>닉네임</div>
                <div>점수</div>
                <div>레벨</div>
                <div>로그인 횟수</div>
              </div>
            </div>

            {/* 플레이어 목록 */}
            <div className="divide-y divide-gray-200">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${getRankStyle(player.rank)}`}
                >
                  <div className="grid grid-cols-5 gap-4 items-center">
                    {/* 순위 */}
                    <div className="font-bold text-lg">
                      {getRankIcon(player.rank)}
                    </div>
                    
                    {/* 닉네임 */}
                    <div className="font-semibold">
                      {player.nickname}
                    </div>
                    
                    {/* 점수 */}
                    <div className="font-mono text-lg font-bold">
                      {player.score.toLocaleString()}점
                    </div>
                    
                    {/* 레벨 */}
                    <div className="text-center">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                        Lv.{player.level}
                      </span>
                    </div>
                    
                    {/* 로그인 횟수 */}
                    <div className="text-center text-gray-600">
                      {player.login_count}회
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              아직 플레이어가 없습니다
            </h3>
            <p className="text-gray-600">
              첫 번째 플레이어가 되어보세요!
            </p>
          </div>
        )}

        {/* 통계 정보 */}
        {players.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-blue-600">
                {players.length}
              </div>
              <div className="text-gray-600">총 플레이어</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.max(...players.map(p => p.score)).toLocaleString()}
              </div>
              <div className="text-gray-600">최고 점수</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(players.reduce((sum, p) => sum + p.score, 0) / players.length).toLocaleString()}
              </div>
              <div className="text-gray-600">평균 점수</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
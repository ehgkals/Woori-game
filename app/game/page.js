// app/game/page.js - 간단한 클릭 게임 페이지
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState({
    currentScore: 0,
    clickCount: 0,
    isPlaying: false
  });
  
  const router = useRouter();

  useEffect(() => {
    // 게임 페이지 진입시 자동으로 사용자 확인
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch('/api/login');
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setGameStats(prev => ({
          ...prev,
          currentScore: data.user.score
        }));
        console.log('✅ 게임 페이지에서 사용자 인식:', data.user);
      } else {
        console.log('❌ 사용자 인식 실패 - 로그인 페이지로 이동');
        router.push('/');
      }
    } catch (error) {
      console.error('사용자 확인 오류:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const startGame = () => {
    setGameStats(prev => ({
      ...prev,
      isPlaying: true,
      clickCount: 0
    }));
    console.log('🚀 게임 시작!');
  };

  const clickButton = async (points) => {
    // 점수 증가 (로컬 상태)
    setGameStats(prev => ({
      ...prev,
      currentScore: prev.currentScore + points,
      clickCount: prev.clickCount + 1
    }));

    // 서버에 점수 저장
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'increase_score',
          data: { points }
        })
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.user);
        console.log(`💾 점수 저장: +${points}점 (총: ${result.user.score}점)`);
      }
    } catch (error) {
      console.error('점수 저장 실패:', error);
    }
  };

  const endGame = () => {
    setGameStats(prev => ({
      ...prev,
      isPlaying: false
    }));
    console.log('🏁 게임 종료!');
  };

  const goBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>게임 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-pink-400">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <button 
            onClick={goBack}
            className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 클릭 게임</h1>
          <p className="text-white/80">버튼을 클릭해서 점수를 획득하세요!</p>
        </div>

        {/* 플레이어 정보 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 플레이어 정보</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user.nickname}</p>
              <p className="text-sm text-gray-600">닉네임</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{user.level}</p>
              <p className="text-sm text-gray-600">레벨</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{gameStats.currentScore}</p>
              <p className="text-sm text-gray-600">현재 점수</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{gameStats.clickCount}</p>
              <p className="text-sm text-gray-600">클릭 수</p>
            </div>
          </div>
        </div>

        {/* 게임 영역 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-6 shadow-xl">
          {!gameStats.isPlaying ? (
            // 게임 시작 전
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 게임을 시작해보세요!</h2>
              <p className="text-gray-600 mb-6">버튼을 클릭해서 점수를 모으고 레벨을 올려보세요</p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl text-xl font-bold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
              >
                🚀 게임 시작!
              </button>
            </div>
          ) : (
            // 게임 플레이 중
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">🎮 게임 진행 중</h2>
                <p className="text-lg text-gray-600">
                  현재 점수: <span className="font-bold text-green-600">{gameStats.currentScore}</span>점
                </p>
                <p className="text-sm text-gray-500">
                  클릭 횟수: {gameStats.clickCount}회
                </p>
              </div>

              {/* 클릭 버튼들 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button
                  onClick={() => clickButton(1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 rounded-xl text-lg font-bold transform hover:scale-105 transition-all shadow-lg"
                >
                  🔵 기본 클릭
                  <br />
                  <span className="text-sm">+1점</span>
                </button>

                <button
                  onClick={() => clickButton(5)}
                  className="bg-green-500 hover:bg-green-600 text-white py-6 px-8 rounded-xl text-lg font-bold transform hover:scale-105 transition-all shadow-lg"
                >
                  🟢 파워 클릭
                  <br />
                  <span className="text-sm">+5점</span>
                </button>

                <button
                  onClick={() => clickButton(10)}
                  className="bg-purple-500 hover:bg-purple-600 text-white py-6 px-8 rounded-xl text-lg font-bold transform hover:scale-105 transition-all shadow-lg"
                >
                  🟣 슈퍼 클릭
                  <br />
                  <span className="text-sm">+10점</span>
                </button>
              </div>

              {/* 특별 버튼들 */}
              {gameStats.clickCount >= 10 && (
                <div className="text-center mb-6">
                  <button
                    onClick={() => clickButton(50)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 px-8 rounded-xl text-lg font-bold transform hover:scale-105 transition-all shadow-lg animate-pulse"
                  >
                    ⭐ 보너스 클릭 (10회 달성!)
                    <br />
                    <span className="text-sm">+50점</span>
                  </button>
                </div>
              )}

              {/* 게임 종료 버튼 */}
              <div className="text-center">
                <button
                  onClick={endGame}
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold"
                >
                  🏁 게임 종료
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 게임 통계 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 게임 기록</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{user.score}</p>
              <p className="text-sm text-gray-600">총 점수</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{user.loginCount}</p>
              <p className="text-sm text-gray-600">방문 횟수</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{user.level}</p>
              <p className="text-sm text-gray-600">현재 레벨</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{user.ip}</p>
              <p className="text-sm text-gray-600">IP 주소</p>
            </div>
          </div>
        </div>

        {/* 돌아가기 버튼 */}
        <div className="text-center">
          <button
            onClick={goBack}
            className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold"
          >
            🏠 메인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
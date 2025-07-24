"use client"

import Game from "@/components/main/Game";
import Header from "@/components/main/Header";
import LeaderBoard from "@/components/main/LeaderBoard";
import { useEffect, useState } from "react";

export default function Main() {
  const [score, setScore] = useState(0);
  const [nickname, setNickname] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  // 🔄 로그인 상태 관리
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔌 컴포넌트 마운트시 자동 로그인 (로그인 페이지와 동일한 방식)
  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log("🔄 Main에서 사용자 정보 가져오는 중...");
        const response = await fetch('/api/login');
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
          setNickname(data.user.nickname); // 👈 이게 핵심!
          console.log("✅ 사용자 정보 로드 성공:", data.user);
        } else {
          console.error("❌ 사용자 정보 로드 실패:", data.error);
          // 로그인 페이지로 리다이렉트
          window.location.href = '/';
        }
      } catch (error) {
        console.error("🔴 사용자 정보 로드 API 오류:", error);
        window.location.href = '/';
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, []);

  // 🎮 게임 시작 함수
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setTimeLeft(30);
  };

  // ⏰ 타이머 관리
  useEffect(() => {
    if (!isPlaying) return;
    
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGameOver(true);
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, isPlaying]);

  // 🔄 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-800">게임 준비 중...</div>
          <div className="text-gray-600 mt-2">잠시만 기다려주세요</div>
        </div>
      </div>
    );
  }

  // ❌ 사용자 정보가 없으면 로그인 페이지로
  if (!user) {
    return null; // 리다이렉트 처리 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 p-4">
     

      {/* 🎮 게임 상태별 UI */}
      {!isPlaying && !gameOver && (
        <div className="text-center mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mx-auto max-w-md">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">게임 시작 준비!</h2>
            <p className="text-gray-600 mb-6">30초 동안 최대한 많은 단어를 입력하세요</p>
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg"
            >
              🚀 게임 시작!
            </button>
          </div>
        </div>
      )}

      {/* 🏁 게임 종료 화면 */}
      {gameOver && (
        <div className="text-center mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mx-auto max-w-md">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">시간 종료!</h2>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 mb-6">
              <div className="text-lg font-semibold">{nickname}님의 최종 점수</div>
              <div className="text-4xl font-bold">{score}점</div>
            </div>
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg"
            >
              🔄 다시 도전하기!
            </button>
          </div>
        </div>
      )}

      {/* ⏰ 게임 중 타이머 */}
      {isPlaying && (
        <div className="text-center mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mx-auto max-w-md">
            <div className="text-lg text-gray-700 mb-2">
              <span className="font-bold text-purple-600">{nickname}</span>님, 화이팅! 💪
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-3xl">⏱️</div>
              <div className={`text-4xl font-bold transition-colors duration-300 ${
                timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'
              }`}>
                {timeLeft}초
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 게임 영역 */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 게임 메인 영역 */}
          <div className="flex-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              <Game
                onScoreChange={setScore}
                nickname={nickname}
                isPlaying={isPlaying}
                onStart={startGame}
              />
            </div>
          </div>
          
          {/* 리더보드 영역 */}
          <div className="lg:w-80">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              <LeaderBoard 
                score={score} 
                nickname={nickname}
                gameOver={gameOver} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🎮 하단 액션 버튼들 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
          title="로그인 페이지로"
        >
          🏠
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
          title="새로고침"
        >
          🔄
        </button>
      </div>

      {/* 현재 점수 고정 표시 (게임 중일 때만) */}
      {isPlaying && (
        <div className="fixed top-6 right-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="text-sm font-medium">현재 점수</div>
            <div className="text-2xl font-bold text-center">{score}</div>
          </div>
        </div>
      )}
    </div>
  );
}
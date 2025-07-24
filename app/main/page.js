"use client"

import Game from "@/components/main/Game";
import Header from "@/components/main/Header";
import LeaderBoard from "@/components/main/LeaderBoard";
import { useEffect, useState } from "react";


export default function Main() {
  const [score,  setScore] = useState(0);
  const [nickname, setNickname] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setTimeLeft(30);
  };

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
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {!isPlaying && !gameOver && (
        <button
          onClick={startGame}
          className="mb-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          게임 시작
        </button>
      )}

      {isPlaying && (
        <div className="mb-2 text-lg font-semibold">남은 시간: {timeLeft}s</div>
      )}

      <div className="flex w-full max-w-5xl gap-4">
        <Game
          onScoreChange={setScore}
          nickname={nickname}
          isPlaying={isPlaying}
        />
        <LeaderBoard score={score} nickname={nickname} gameOver={gameOver} />
      </div>

      {gameOver && (
        <div className="mt-4 text-red-600 font-bold text-xl">
          ⏰ 시간이 종료되어 게임이 종료되었습니다!
        </div>
      )}
    </div>
  );
}
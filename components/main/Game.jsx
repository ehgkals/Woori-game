
"use client";
import RandomWordViewer from "@/components/viewer/RandomWordViewer";
import TypingWord from "@/components/viewer/TypingWord";
import { useState, useEffect } from "react";
import { fetchRandomWord } from "../../utils/fetchWord";

const Game = ({ onScoreChange, nickname, isPlaying, onStart }) => {
  console.log("<Game /> 렌더링 됨");
      
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadWords() {                                      
      setIsLoading(true);
      console.log(isLoading);
      const data = await fetchRandomWord();
      setIsLoading(false);
      setWords(data);
    }
    loadWords();
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setText("");
      setCurrentIdx(0);
      setScore(0);
      onScoreChange(0);
    }
  }, [isPlaying, onScoreChange]);

  // 점수가 변경될 때마다 부모에게 알림 (렌더링과 분리)
  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const currentWord = words[currentIdx] || "";
  
  const inputTextfieldHandler = (e) => {
    if (!isPlaying) return;
    const value = e.target.value;
    if(/^[a-zA-Z]*$/.test(value))
        setText(value);
  };

  const enterHandler = (e) => {
    if (!isPlaying) return;
    
    if (e.key === "Enter" || e.key === " ") {
      if (text.trim() === currentWord) {
        // 입력값과 단어가 일치하면 다음 단어로 이동
        setCurrentIdx((prev) => prev + 1);
        // 점수만 업데이트 (onScoreChange는 useEffect에서 처리)
        setScore((prev) => prev + 1);
      } else {
        // 일치하지 않으면
        setIsWrong(true);
        setTimeout(() => {
          setIsWrong(false);
        }, 1000);
        console.log("Fail!");
      }
      setText("");
    }
  };
           
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-96">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
          <div className="text-2xl font-bold text-gray-800 mb-2">게임 준비 중...</div>
          <div className="text-gray-600">단어를 불러오고 있습니다</div>
          <div className="flex justify-center mt-4 gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      {/* 🎮 게임 헤더 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl p-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎮</div>
            <div>
              <h2 className="text-xl font-bold">타이핑 게임</h2>
              <div className="text-sm opacity-80">{nickname}님의 게임</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">현재 점수</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
        </div>
      </div>

      {/* 📝 단어 표시 영역 */}
      <div className="mb-8">
        <RandomWordViewer
          words={words}
          currentIdx={currentIdx}
          isWrong={isWrong}
        />
      </div>

      {/* ⌨️ 타이핑 입력 영역 */}
      <div className="mb-6">
        <TypingWord
          text={text}
          enterHandler={enterHandler}
          inputTextfieldHandler={inputTextfieldHandler}
          disabled={!isPlaying}
        />
      </div>

      {/* 📊 게임 상태 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-lg font-bold text-blue-600">{score}</div>
          <div className="text-xs text-gray-600">맞춘 단어</div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-lg font-bold text-green-600">
            {words.length > 0 ? Math.round((score / words.length) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-600">정확도</div>
        </div>
      </div>

      {/* 🎮 게임 컨트롤 버튼 */}
      {!isPlaying && (
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            {score > 0 ? (
              <>
                <div className="text-4xl mb-3">🎉</div>
                <div className="text-xl font-bold text-gray-800 mb-2">게임 완료!</div>
                <div className="text-gray-600 mb-4">
                  총 <span className="font-bold text-purple-600">{score}개</span>의 단어를 맞추셨습니다
                </div>
                <button
                  onClick={onStart}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg"
                >
                  🔄 다시 도전하기!
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🚀</div>
                <div className="text-xl font-bold text-gray-800 mb-2">게임 시작 준비!</div>
                <div className="text-gray-600 mb-4">
                  단어를 보고 정확하게 타이핑하세요
                </div>
                <button
                  onClick={onStart}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-bold text-lg shadow-lg"
                >
                  🎮 게임 시작!
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 💡 게임 힌트 (게임 중일 때만) */}
      {isPlaying && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-700">
            <span>💡</span>
            <span>현재 단어: <strong className="text-yellow-800">{currentWord}</strong></span>
          </div>
          <div className="text-xs text-yellow-600 mt-1">
            Enter 또는 Space로 제출 • 영어만 입력 가능
          </div>
        </div>
      )}

      {/* 🔥 연속 성공 효과 (점수가 5 이상일 때) */}
      {isPlaying && score >= 5 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl animate-bounce">🔥</div>
        </div>
      )}

      {/* ❌ 틀렸을 때 효과 */}
      {isWrong && (
        <div className="fixed inset-0 bg-red-500/20 pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default LeaderBoard;
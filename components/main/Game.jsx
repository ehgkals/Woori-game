"use client";
import RandomWordViewer from "@/components/viewer/RandomWordViewer";
import TypingWord from "@/components/viewer/TypingWord";
import { useState, useEffect } from "react";
import { fetchRandomWord } from "../../utils/fetchWord";
import { Suspense } from "react";
const Game = ({ onScoreChange, nickname, isPlaying }) => {
  console.log("<Game /> 렌더링 됨");


  const [text, setText] = useState('');
      const [words, setWords] = useState([]);
      const [currentIdx, setCurrentIdx] = useState(0);
      const [score, setScore] = useState(0);
  
      useEffect(() => {
    if (!isPlaying) {
      setText("");
      setCurrentIdx(0);
      setScore(0);
    }
  }, [isPlaying]);

  const currentWord = words[currentIdx] || "";

  const inputTextfieldHandler = (e) => {
    if (!isPlaying) return; // 게임중 아니면 입력 무시
    setText(e.target.value);
  };

  const enterHandler = (e) => {
    if (!isPlaying) return; // 게임중 아니면 입력 무시
    if (e.key === "Enter") {
      if (text.trim() === currentWord) {
        setCurrentIdx((prev) => prev + 1);
        setScore((prev) => {
          const newScore = prev + 1;
          onScoreChange(newScore);
          return newScore;
        });
      }
      setText("");
    }
  };

  return (
    <div className="w-3/4 p-4">
      <RandomWordViewer words={words} currentIdx={currentIdx} />
      <TypingWord
        text={text}
        enterHandler={enterHandler}
        inputTextfieldHandler={inputTextfieldHandler}

        disabled={!isPlaying}
      />
      <div className="mt-4 text-white text-lg">점수: {score}</div>
    </div>
  );
};
export default Game;
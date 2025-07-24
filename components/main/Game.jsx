'use client'
import RandomWordViewer from '@/components/viewer/RandomWordViewer'
import TypingWord from '@/components/viewer/TypingWord'
import { useState, useEffect } from 'react';
import { fetchRandomWord } from '../../utils/fetchWord';

const Game = ({ onScoreChange, nickname, isPlaying }) => {
  console.log("<Game /> 렌더링 됨");

    const [text, setText] = useState('');
    const [words, setWords] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        async function loadWords() {
            const data = await fetchRandomWord();
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

        {!isPlaying && (
            <button
            onClick={onStart}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            {score > 0 ? '게임 다시 시작' : '게임 시작'}
            </button>
        )}
    </div>
  );
};

export default Game;
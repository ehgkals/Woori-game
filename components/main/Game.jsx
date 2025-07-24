"use client";
import RandomWordViewer from "@/components/viewer/RandomWordViewer";
import TypingWord from "@/components/viewer/TypingWord";
import { useState, useEffect } from "react";
import { fetchRandomWord } from "../../utils/fetchWord";
const Game = ({ onScoreChange, nickname, isPlaying }) => {
  console.log("<Game /> 렌더링 됨");
  const [text, setText] = useState("");
  const [words, setWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isWrong, setIsWrong] = useState(false); // 틀렸을 때의 상태
  useEffect(() => {
    async function loadWords() {
      const data = await fetchRandomWord();
      setWords(data);
      console.log("데이터 받기 성공");
    }
    loadWords();
  }, []);
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
    // 영어 알파벳인 경우만 setText에 넣기
    // 영어 외 문자들은 무시
    const value = e.target.value;
    if(/^[a-zA-Z]*$/.test(value))
        setText(value);
  };
  const enterHandler = (e) => {
    if (!isPlaying) return;
    // 사용자가 엔터나 스페이스바를 눌렀을 때만 단어 비교
    if (e.key === "Enter" || e.key === " ") {
      if (text.trim() === currentWord) {
        // 입력값과 단어가 일치하면 다음 단어롤 이동
        setCurrentIdx((prev) => prev + 1);
        setScore((prev) => {
          const newScore = prev + 1;
          onScoreChange(newScore);
          return newScore;
        });
      } else {
        // 일치하지 않으면
        setIsWrong(true); // 틀린 상태 설정
        setTimeout(() => {
          setIsWrong(false);
        }, 1000); // 1초 후 틀린 상태 초기화
        console.log("Fail!");
      }
      setText(""); // 텍스트 필드 공백
    }
  };
  return (
    <div className="w-3/4 p-4">
          {/* <Suspense fallback={<p>Loading...</p>}> */}
              <RandomWordViewer
                words={words}
                currentIdx={currentIdx}
                isWrong={isWrong}
              />
          {/* </Suspense> */}
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
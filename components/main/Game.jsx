"use client";
import RandomWordViewer from "@/components/viewer/RandomWordViewer";
import TypingWord from "@/components/viewer/TypingWord";
import { useState, useEffect } from "react";
import { fetchRandomWord } from "../../utils/fetchWord";
import { Suspense } from "react";
const Game = ({ onScoreChange, nickname }) => {
  console.log("<Game /> 렌더링 됨");
  const [text, setText] = useState("");
  const [words, setWords] = useState([]);
  const [currentIdx, setCurretIdx] = useState(0);
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
  const currentWord = words[currentIdx] || "";
  const inputTextfieldHandler = (e) => {
    const value = e.target.value;
    // 영어 알파벳인 경우만 setText에 넣기
    // 영어 외 문자들은 무시
    if(/^[a-zA-Z]*$/.test(value))
        setText(value);
  };
  const enterHandler = (e) => {
    // 사용자가 엔터나 스페이스바를 눌렀을 때만 단어 비교
    if (e.key === "Enter" || e.key === " ") {
      if (text.trim() === currentWord) {
        // 입력값과 단어가 일치하면 다음 단어롤 이동
        setCurretIdx((prev) => prev + 1);
        setScore((prev) => prev + 1);
        onScoreChange(score + 1);
        console.log("Correct!");
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
      <Suspense fallback={<p>로딩 중...</p>}>
          <RandomWordViewer
            words={words}
            currentIdx={currentIdx}
            isWrong={isWrong}
          />
      </Suspense>
      <TypingWord
        text={text}
        enterHandler={enterHandler}
        inputTextfieldHandler={inputTextfieldHandler}
      />
      <div className="mt-4 text-white text-lg">점수: {score}</div>
    </div>
  );
};
export default Game;
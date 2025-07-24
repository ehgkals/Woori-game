'use client'
import RandomWordViewer from '@/components/viewer/RandomWordViewer'
import TypingWord from '@/components/viewer/TypingWord'
import { useState, useEffect } from 'react';
import { fetchRandomWord } from '../../utils/fetchWord';

const Game = () => {
  console.log("<Game /> 렌더링 됨");

  const [text, setText] = useState('');
      const [words, setWords] = useState([]);
      const [currentIdx, setCurretIdx] = useState(0);
  
      useEffect(() => {
          async function loadWords() {
              const data =await fetchRandomWord();
              setWords(data);
              console.log('데이터 받기 성공');
          }
          loadWords();
      }, []);
      
      const currentWord = words[currentIdx] || '';
  
      const inputTextfieldHandler = (e) => { // 입력값 바뀔때마다
          setText(e.target.value);
      }
  
      const enterHandler = (e) => { // 사용자가 엔터를 눌렀을 때만 단어 비교
          if(e.key === 'Enter'){
              if(text.trim() === currentWord){ // 입력값과 단어가 일치하면 다음 단어롤 이동
                  setCurretIdx(prev => prev + 1); 
                  console.log('Correct!');
              }
              else { // 일치하지 않으면 
                  console.log('Fail!');
              }
              setText(''); // 텍스트 필드 공백
          }
      }
  

  return (
    <div className="w-3/4 p-4">
        <RandomWordViewer words={words} currentIdx={currentIdx}/>
        <TypingWord 
            text={text} 
            enterHandler={enterHandler}
            inputTextfieldHandler={inputTextfieldHandler}/>
    </div>
  );
};

export default Game;
'use client'
export default function TypingWord({ text, inputTextfieldHandler, enterHandler }) {
  return (
    <div className="flex justify-center items-center"> {/* 화면 중앙 정렬 */}
      <input
        onChange={inputTextfieldHandler}
        onKeyDown={enterHandler}
        type="text"
        value={text}
        className="border border-gray-400 rounded px-4 py-2 text-xl w-64 text-center"
        placeholder="단어 입력..."
        autoFocus
      />
    </div>
  );
}
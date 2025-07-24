"use client";

import { useState } from "react";

const Modal = ({ onSubmit }) => {
  const [nickname, setNickname] = useState("");

  const handleSubmit = () => {
    if (nickname.trim()) {
      onSubmit(nickname);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          🎮 닉네임을 입력하세요
        </h2>

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (예: gamer123)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-white font-semibold py-2 rounded-lg hover:bg-teal-600 transition"
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default Modal;
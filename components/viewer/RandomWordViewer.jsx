"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef } from "react";
import TypingWord from "./TypingWord";

export default function RandomWordViewer({ words, currentIdx, isWrong }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(currentIdx);
    }
  }, [currentIdx]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* 🎯 헤더 섹션 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg">
          <span className="text-lg">⚡</span>
          <span className="font-bold">단어 #{currentIdx + 1}</span>
          <span className="text-sm opacity-80">/ {words.length}</span>
        </div>
      </div>

      {/* 🎮 메인 단어 영역 */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6">
        {/* 배경 데코레이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl"></div>
        <div className="absolute top-4 right-4 text-4xl opacity-20">🎯</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">⚡</div>
        
        {/* 프로그레스 바 */}
        <div className="relative mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / words.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            진행률: {Math.round(((currentIdx + 1) / words.length) * 100)}%
          </div>
        </div>

        {/* Swiper 영역 */}
        <div className="relative h-40 flex items-center">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={50}
            slidesPerView={3}
            centeredSlides={true}
            allowTouchMove={false}
            className="word-swiper"
          >
            {words.map((word, idx) => (
              <SwiperSlide key={idx} className="flex items-center justify-center">
                <div
                  className={`
                    relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform
                    ${idx === currentIdx
                      ? isWrong
                        ? "text-white bg-gradient-to-r from-red-500 to-pink-500 scale-110 shadow-2xl animate-pulse"
                        : "text-white bg-gradient-to-r from-blue-500 to-purple-600 scale-110 shadow-2xl"
                      : idx < currentIdx
                        ? "text-green-600 bg-green-100 scale-95 opacity-60"
                        : "text-gray-400 bg-gray-100 scale-90 opacity-40"
                    }
                  `}
                >
                  {/* 현재 단어 특별 효과 */}
                  {idx === currentIdx && (
                    <>
                      <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl -z-10 animate-ping opacity-30"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    </>
                  )}
                  
                  {/* 완료된 단어 체크마크 */}
                  {idx < currentIdx && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                  
                  <span className={`
                    text-2xl lg:text-3xl font-extrabold
                    ${idx === currentIdx ? 'drop-shadow-lg' : ''}
                  `}>
                    {word}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <TypingWord />

        </div>

        {/* 상태 메시지 */}
        <div className="text-center mt-6">
          {isWrong ? (
            <div clasName="bg-red-100 border border-red-300 rounded-xl p-4">
              <div className="text-2xl mb-2">❌</div>
              <div className="text-red-700 font-bold">틀렸습니다!</div>
              <div className="text-red-600 text-sm mt-1">다시 시도해보세요</div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-blue-700 font-bold">현재 단어를 입력하세요</div>
              <div className="text-blue-600 text-sm mt-1">정확하게 타이핑해주세요</div>
            </div>
          )}
        </div>
      </div>

      {/* 📊 하단 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-lg font-bold text-green-600">{currentIdx}</div>
          <div className="text-xs text-gray-600">완료</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-lg font-bold text-blue-600">{words.length - currentIdx}</div>
          <div className="text-xs text-gray-600">남은 단어</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-lg font-bold text-purple-600">{words.length}</div>
          <div className="text-xs text-gray-600">전체</div>
        </div>
      </div>

      {/* 키보드 힌트 */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
          <span>💡</span>
          <span>Enter 또는 Space로 다음 단어</span>
        </div>
      </div>
    </div>
  );
}
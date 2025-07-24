"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef } from "react";
export default function RandomWordViewer({ words, currentIdx, isWrong }) {
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(currentIdx);
    }
  }, [currentIdx]);
  return (
    <div className="w-full max-w-3xl mx-auto text-center h-32">
      <Swiper // 전체 슬라이더 영역
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={50}
        slidesPerView={3}
        centeredSlides={true}
        allowTouchMove={false} // 손가락 슬라이드 비활성화
      >
        {words.map((word, idx) => (
          <SwiperSlide key={idx}>
            <div
              key={idx}
              className={`text-3xl font-semibold transition-colors duration-300 ${
                idx === currentIdx
                  ? isWrong
                    ? "text-red-500" // 틀렸을 때 빨간색
                    : "text-black" // 현재 단어이면서 맞았을 때
                  : "text-gray-400" // 나머지 단어
              }`}
            >
              {word}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}






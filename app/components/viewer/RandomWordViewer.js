"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef } from "react";

export default function RandomWordViewer({ words, currentIdx }) {
  const swiperRef = useRef(null);

  useEffect( () => {
    if(swiperRef.current && swiperRef.current.slideTo){
        swiperRef.current.slideTo(currentIdx);
    }
  }, [currentIdx])

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
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
              className={`text-3xl font-semibold ${
                idx === currentIdx
                  ? 'text-black'
                  : 'text-gray-400'
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

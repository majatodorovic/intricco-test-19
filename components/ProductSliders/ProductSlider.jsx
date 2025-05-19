"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ThumbByViewport } from "../Thumb/ThumbByViewport";

const LoadingSkeleton = () => (
  <div className={`flex gap-[25px]`}>
    <div className="flex aspect-2/3 w-full animate-pulse bg-slate-300"></div>
    <div className="hidden aspect-2/3 w-full animate-pulse bg-slate-300 sm:flex"></div>
    <div className="hidden aspect-2/3 w-full animate-pulse bg-slate-300 lg:flex"></div>
    <div className="hidden aspect-2/3 w-full animate-pulse bg-slate-300 2xl:flex"></div>
  </div>
);

const ProductSlider = ({ text, productDetails }) => {
  const swiperRef = useRef(null);
  const thumbRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [isSwiperReady, setSwiperReady] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(50);

  useEffect(() => {
    if (
      productDetails &&
      productDetails.items &&
      productDetails?.items?.length > 0
    ) {
      setSwiperReady(true);
    }
  }, [productDetails]);

  useEffect(() => {
    const updateShowArrows = () => {
      const screenWidth = window.innerWidth;
      let slidesPerView = 1;

      if (screenWidth >= 1440) slidesPerView = 4;
      else if (screenWidth >= 1024) slidesPerView = 3;
      else if (screenWidth >= 640) slidesPerView = 2;

      setShowArrows(productDetails?.items?.length > slidesPerView);
    };

    updateShowArrows();
    window.addEventListener("resize", updateShowArrows);
    return () => window.removeEventListener("resize", updateShowArrows);
  }, [productDetails]);

  useEffect(() => {
    setTimeout(() => {
      if (thumbRef.current) {
        setThumbHeight(thumbRef.current.clientHeight);
      }
    }, 200);
  }, [isSwiperReady, productDetails]);

  return (
    <div className="sectionWidth mt-10 lg:mt-[80px]">
      <div className="flex w-full items-center justify-between">
        <h5 className="text-[1.5rem] font-bold max-md:text-[1.1rem]">{text}</h5>
      </div>
      <div className="relative mx-auto mt-10">
        {!productDetails || !isSwiperReady ? (
          <LoadingSkeleton />
        ) : (
          <>
            <Swiper
              slidesPerView={1}
              spaceBetween={12}
              loop={productDetails?.items?.length > 0}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className={`${showArrows ? "!mx-[60px]" : ""}`}
            >
              {productDetails?.items?.map((product, index) => (
                <SwiperSlide key={index}>
                  <ThumbByViewport
                    ref={thumbRef}
                    id={product.id}
                    apiLink={`/product-details/thumb/${product.id}?categoryId=*`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
        {showArrows && (
          <>
            <button
              className="absolute left-0 top-0 z-[50] flex w-10 items-center justify-center bg-gray"
              style={{ height: `${thumbHeight}px` }}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <Image
                src="/icons/chevron.png"
                alt="Arrow"
                width={24}
                height={24}
                className="rotate-90"
              />
            </button>
            <button
              className="absolute right-0 top-0 z-10 flex w-10 items-center justify-center bg-gray"
              style={{ height: `${thumbHeight}px` }}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <Image
                src="/icons/chevron.png"
                alt="Arrow"
                width={24}
                height={24}
                className="-rotate-90"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;

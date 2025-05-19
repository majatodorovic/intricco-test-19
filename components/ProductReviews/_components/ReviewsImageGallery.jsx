"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { useSuspenseQuery } from "@tanstack/react-query";
import { list as LIST } from "@/api/api";

const ReviewsImageGallery = ({ api }) => {
  // Fetch reviews file list for the product
  const { data: items } = useSuspenseQuery({
    queryKey: ["reviewsFileList", api],
    queryFn: async () => {
      const response = await LIST(`${api}`);
      return response?.payload;
    },
    // keepPreviousData: true,
  });

  return (
    <div className="relative mb-8">
      <h2 className="text-lg font-bold mb-4">All Image ({items.length})</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        slidesPerView={3}
        breakpoints={{
          640: {
            slidesPerView: 2.5,
          },
          768: {
            slidesPerView: 4.5,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="relative w-full !h-[140px]">
            <Image
              src={item.url}
              alt={item.descriptions.alt}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewsImageGallery;

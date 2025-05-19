"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import Image from "next/image";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import noImage from "../../public/images/placeholder.webp";
import { getCurrentGalleryByVariantKeys } from "@/components/ProductDetails/helpers/gallery";

export const ProductGallery = ({
  productGallery,
  variantKeyArray,
  discountPrice,
}) => {
  const currentGallery = variantKeyArray
    ? getCurrentGalleryByVariantKeys({
        variantKeys: variantKeyArray,
        productGallery,
      })
    : [];

  const [gallery, setGallery] = useState(
    currentGallery && currentGallery.length > 0
      ? currentGallery
      : productGallery?.gallery,
  );

  useEffect(() => {
    if (variantKeyArray) {
      let currentGallery = getCurrentGalleryByVariantKeys({
        variantKeys: variantKeyArray,
        productGallery,
      });

      setGallery(currentGallery);
    }
  }, [variantKeyArray]);

  function ImageMagnifier({ src, onClick = () => {} }) {
    return (
      <div
        style={{
          position: "relative",
          zIndex: 100,
        }}
        className="aspect-2/3 h-full w-full object-cover"
        onClick={onClick}
      >
        {discountPrice && (
          <div className={`absolute left-2 top-2 z-[1] text-[13px] text-white`}>
            <div
              className={`rounded-lg bg-[#c23d27] px-[0.85rem] py-1 font-bold`}
            >
              -
              {(
                ((discountPrice?.price?.original -
                  discountPrice?.price?.discount) /
                  discountPrice?.price?.original) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
        )}

        <Image
          src={src}
          width={0}
          height={0}
          ref={mainSliderRef}
          sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
          priority={true}
          className="!h-full w-full !object-cover"
          alt={src}
        />
      </div>
    );
  }

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const productImage =
    gallery?.length > 0 ? (
      gallery?.map((image, index) => {
        const imageUrl = convertHttpToHttps(image?.image) || noImage; // fallback to noImage if image is missing

        return (
          <SwiperSlide key={index} className="relative w-full">
            <ImageMagnifier src={imageUrl} />
          </SwiperSlide>
        );
      })
    ) : (
      <SwiperSlide>
        <Image src={noImage} alt="no image placeholder maximon" />
      </SwiperSlide>
    );

  const thumbImage = gallery?.map((image, index) => {
    return (
      <SwiperSlide
        key={`${index}-thumbImage`}
        className={`!aspect-2/3 !overflow-hidden !bg-gray`}
      >
        <Image
          src={convertHttpToHttps(image?.image)}
          alt={`Thumb image`}
          width={0}
          height={0}
          priority={true}
          sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
          style={{ objectFit: "contain" }}
          className="!h-full w-full cursor-pointer max-md:hidden"
        />
      </SwiperSlide>
    );
  });

  const [swiper, setSwiper] = useState(null);

  const mainSliderRef = useRef(null);

  useEffect(() => {
    const updateMainSliderHeight = () => {
      if (mainSliderRef.current) {
        const thumbsSwiper = document.getElementById("thumbsSwiper");
        thumbsSwiper.style.height = `${mainSliderRef.current.clientHeight}px`;
      }
    };

    updateMainSliderHeight();

    window.addEventListener("resize", updateMainSliderHeight);
    return () => {
      window.removeEventListener("resize", updateMainSliderHeight);
    };
  }, []);

  return (
    <div className="col-span-2 h-fit gap-5 overflow-hidden max-lg:col-span-4 max-md:aspect-2/3 md:flex md:flex-row-reverse">
      <Swiper
        spaceBetween={10}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        pagination={true}
        modules={[FreeMode, Thumbs, Pagination, Navigation]}
        initialSlide={0}
        navigation={true}
        rewind={true}
        onSwiper={(swiper) => setSwiper(swiper)}
        className={`!relative h-full w-full`}
        breakpoints={{
          768: {
            direction: "horizontal",
            slidesPerView: 1,
            pagination: {
              el: ".swiper-pagination",
              enabled: false,
            },
            navigation: {
              enabled: true,
            },
            modules: [FreeMode, Thumbs, Navigation],
          },
          0: {
            direction: "horizontal",
            slidesPerView: 1,
            pagination: {
              el: ".swiper-pagination",
              enabled: false,
            },
            navigation: {
              enabled: true,
            },
            // pagination: {
            //   el: ".swiper-pagination",
            //   clickable: true,
            //   enabled: true,
            //   bulletClass: "swiper-pagination-bullet",
            //   bulletActiveClass: "swiper-pagination-bullet-active",
            // },
            // navigation: {
            //   el: ".swiper-nav-button",
            //   clickable: true,
            //   enabled: false,
            //   bulletClass: "swiper-pagination-bullet",
            //   bulletActiveClass: "swiper-pagination-bullet-active",
            // },
            modules: [FreeMode, Thumbs, Pagination],
          },
        }}
      >
        <>{productImage}</>

        <div className={`absolute right-2 top-2 z-50 flex flex-col gap-1`}>
          {productGallery?.stickers?.length > 0 &&
            productGallery?.stickers?.map((sticker, stickerIndex) => {
              return (
                <div
                  key={`stickerIndex-${stickerIndex}`}
                  className={`bg-primary px-[0.85rem] py-1 text-sm`}
                >
                  <span className={`text-white`}>{sticker?.name}</span>
                </div>
              );
            })}
        </div>
      </Swiper>

      <Swiper
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        spaceBetween={15}
        id={`thumbsSwiper`}
        slidesPerView={0}
        breakpoints={{
          320: {
            direction: "horizontal",
            slidesPerView: 0,
            thumbs: {
              enabled: false,
            },
            modules: [],
          },
          768: {
            direction: "vertical",
            slidesPerView: 4,
            enabled: true,
            allowSlidePrev: true,
            modules: [FreeMode, Thumbs],
          },
        }}
        freeMode={true}
        className={`!relative m-auto h-full w-1/4 max-md:hidden`}
      >
        {thumbImage}
        <div
          slot="container-start"
          className={`absolute ${
            productGallery?.gallery?.length > swiper?.params?.slidesPerView
              ? `block`
              : `hidden`
          } bottom-0 left-0 right-0 z-50 flex w-full cursor-pointer items-center justify-center bg-white/70 pt-1 text-center`}
          onClick={() => {
            swiper?.slideNext();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8"
            onClick={() => {
              swiper?.slideNext();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>

          {/* <i
            className={`fa-thin fa-chevron-down`}
            
          ></i> */}
        </div>
        <div
          className={`absolute ${
            productGallery?.gallery?.length > swiper?.params?.slidesPerView
              ? `block`
              : `hidden`
          } left-0 right-0 top-0 z-50 flex w-full cursor-pointer items-center justify-center bg-white/70 pb-1`}
          onClick={() => {
            swiper?.slidePrev();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8"
            onClick={() => {
              swiper?.slidePrev();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>

          {/* <i
            className={`fa-thin fa-chevron-up`}
            
          ></i> */}
        </div>
      </Swiper>
    </div>
  );
};

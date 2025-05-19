"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { Autoplay } from "swiper/modules";
import Aos from "aos";

function extractYoutubeId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : null;
}

const RenderBanner = ({ banner }) => {
  switch (banner.type) {
    case "image": {
      return (
        <Image
          src={banner?.image ?? "/"}
          alt={banner?.title ?? "Alt"}
          width={0}
          height={0}
          sizes={`100vw`}
          className="h-auto w-full"
          priority
        />
      );
    }
    case "video_link": {
      const videoProvider = banner.video_provider;
      const videoUrl = banner.video_url;

      const src =
        videoProvider === "youtube"
          ? `https://www.youtube.com/embed/${extractYoutubeId(
              videoUrl,
            )}?autoplay=1&mute=1&loop=1&playsinline=1&controls=0&playlist=${extractYoutubeId(
              videoUrl,
            )}`
          : `${videoUrl}?autoplay=1&muted=1&loop=1&background=1&playsinline=1}`;

      return (
        <iframe
          className="pointer-events-none aspect-[960/1550] h-full w-full object-cover md:aspect-[1920/800]"
          width={banner.width}
          height={banner.height}
          src={src}
          style={{ border: "none" }}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
    case "video": {
      return (
        <>
          <video
            key={banner?.file}
            width={banner?.file_data?.banner_position?.width}
            height={banner?.file_data?.banner_position?.height}
            className="h-full w-full bg-fixed object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          >
            <source src={convertHttpToHttps(banner?.file)} type="video/mp4" />
            <source
              src={convertHttpToHttps(banner?.file.replace(".mp4", ".webm"))}
              type="video/webm"
            />
            Your browser does not support the video tag.
          </video>
        </>
      );
    }
    default:
      break;
  }
};

const RenderSlider = ({ banners }) => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    swiperRef.current?.swiper.slideTo(index);
  };

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="relative h-auto">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={banners.length > 1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="h-full"
      >
        {banners?.map((banner, index) => (
          <SwiperSlide key={index} className="relative h-full">
            <RenderBanner banner={banner} />
            <Link
              href={banner?.url ?? "/"}
              target={banner?.target ?? "_self"}
              className="absolute left-0 top-0 z-[49] h-full w-full bg-black bg-opacity-20 transition-all duration-500"
            >
              <div className="absolute right-[140px] top-1/2 flex -translate-y-1/2 transform flex-col items-center justify-center gap-[33px] text-center max-2xl:right-[100px] max-lg:right-24 max-md:left-1/2 max-md:top-1/2 max-md:w-[250px] max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:transform md:max-w-[600px] md:items-end md:justify-end md:text-right">
                {banner?.title && (
                  <h1
                    className="text-6xl font-light text-black max-2xl:text-5xl max-lg:text-3xl"
                    dangerouslySetInnerHTML={{ __html: banner?.title }}
                  />
                )}
                {banner?.subtitle && (
                  <h2
                    className="text-2xl font-light uppercase text-black max-lg:text-xl"
                    dangerouslySetInnerHTML={{ __html: banner?.subtitle }}
                  />
                )}
                {banner?.text && (
                  <p
                    className="text-xl font-light text-black max-2xl:text-lg max-lg:text-base md:max-w-[400px]"
                    dangerouslySetInnerHTML={{ __html: banner?.text }}
                  ></p>
                )}
                {banner?.button && (
                  <button className="border border-white bg-white px-8 py-3 text-xl font-normal uppercase text-black transition-all duration-300 hover:bg-primary hover:text-white max-2xl:text-base max-lg:flex max-lg:w-[250px] max-lg:items-center max-lg:justify-center max-lg:px-2 max-lg:py-2 max-lg:text-sm">
                    {banner?.button}
                  </button>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="max-md:hidden">
        <div className="absolute right-20 top-1/2 z-[50] -translate-y-1/2 max-2xl:right-12 max-lg:right-10">
          {banners?.map((banner, index) => (
            <div
              key={index}
              className={`mx-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full`}
              onClick={() => handleSlideChange(index)}
            >
              <div
                className={`h-[14px] w-[14px] rounded-full ${
                  currentSlide === index ? "!h-4 !w-4 bg-primary" : "bg-white"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RenderSlider;

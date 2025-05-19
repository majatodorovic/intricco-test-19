"use client";

import Image from "next/image";
import { Thumb } from "@/components/Thumb/Thumb";
import { Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import {
  useLandingPageBasicData,
  useLandingPageConditions,
  useLandingPageThumb,
} from "@/hooks/ecommerce.hooks";
import { Fragment, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const LandingPage = ({ slug }) => {
  const { data: basicData, isFetching: isFetchingBasicData } =
    useLandingPageBasicData({ slug: slug });
  const { data: thumb, isFetching: isFetchingThumb } = useLandingPageThumb({
    slug: slug,
  });
  const { data: products } = useLandingPageConditions({ slug: slug });

  return (
    <>
      <div className={`sectionWidth`}>
        <div className={`mt-[3rem]`}>
          <div className={`flex flex-col items-start justify-center`}>
            {isFetchingBasicData ? (
              <div className="mb-4 h-[50px] w-full animate-pulse bg-slate-300 object-cover"></div>
            ) : (
              <h1
                className={`mb-10 mt-3 w-full self-start border-b border-b-croonus-1 pb-2 text-2xl font-medium`}
              >
                {basicData?.name}
              </h1>
            )}
            <div className={`relative w-full`}>
              {isFetchingBasicData ? (
                <>
                  <div className="h-[350px] w-full animate-pulse bg-slate-300 object-cover max-md:h-[250px]"></div>
                </>
              ) : (
                basicData?.image && (
                  <div className={`relative`}>
                    <Image
                      src={basicData?.image}
                      alt={``}
                      width={1920}
                      height={400}
                      priority
                      quality={100}
                      style={{ objectFit: "cover" }}
                      className={`h-auto w-full`}
                    />
                  </div>
                )
              )}
            </div>
            {isFetchingBasicData ? (
              <div className="mt-5 h-[50px] w-full animate-pulse bg-slate-300 object-cover"></div>
            ) : (
              <>
                <div
                  className={`${
                    basicData?.gallery?.length > 0
                      ? `grid grid-cols-2 gap-x-5 gap-y-5`
                      : ``
                  } mt-10`}
                >
                  <div
                    className={`${
                      basicData?.gallery?.length > 0 && `deffont col-span-1`
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: basicData?.description,
                    }}
                  />

                  <div
                    className={`${
                      basicData?.gallery?.length > 0 ? `block` : `hidden`
                    } `}
                  >
                    <Swiper
                      style={{ width: "40%" }}
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                    >
                      {basicData?.gallery?.map((image, imageIndex) => {
                        return (
                          <SwiperSlide key={`imageIndex-${imageIndex}`}>
                            <Image
                              src={image?.image}
                              alt={``}
                              width={1920}
                              height={263}
                              priority
                              quality={100}
                              style={{ objectFit: "cover" }}
                              className={`h-auto w-full`}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              </>
            )}
            <div className="mt-16 w-full">
              <Swiper
                slidesPerView={2}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                fadeEffect={{ crossFade: true }}
                rewind={true}
                className="mySwiper3 w-full select-none"
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 2.5,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                  },
                  1680: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                  },
                }}
              >
                {products?.items?.map(({ id }) => {
                  return (
                    <Fragment key={id}>
                      <Suspense
                        fallback={
                          <SwiperSlide className="aspect-2/3 h-full w-full animate-pulse bg-slate-300" />
                        }
                      >
                        <SwiperSlide key={id} className="hoveredColor">
                          <Thumb id={id} slug={id} />
                        </SwiperSlide>
                      </Suspense>
                    </Fragment>
                  );
                })}
              </Swiper>
            </div>
            <div
              className={`mt-16 grid w-full grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-3 xl:grid-cols-4`}
            >
              {isFetchingThumb ? (
                <>
                  {Array.from({ length: 4 }, (x, i) => (
                    <div
                      key={i}
                      className="col-span-1 h-[500px] w-full animate-pulse bg-slate-300 object-cover max-md:h-[250px]"
                    ></div>
                  ))}
                </>
              ) : (
                thumb?.items?.map((thumbItem, thumbItemIndex) => {
                  return (
                    <div
                      key={`thumbItemIndex-${thumbItemIndex}`}
                      className={`col-span-1 flex flex-col items-center justify-center gap-3 rounded-2xl border border-croonus-1 p-5`}
                    >
                      {thumbItem?.name && (
                        <Link href={`${thumbItem?.url}`}>
                          {" "}
                          <h1 className={`text-2xl font-medium`}>
                            {thumbItem?.name}
                          </h1>
                        </Link>
                      )}
                      {thumbItem?.description && (
                        <p className={`text-center`}>
                          {thumbItem?.description}
                        </p>
                      )}
                      {thumbItem?.thumb_image && (
                        <Link href={`${thumbItem?.url}`}>
                          {" "}
                          <div className={``}>
                            <Image
                              src={thumbItem?.thumb_image}
                              alt={``}
                              width={500}
                              height={203}
                              priority
                              quality={100}
                              style={{ objectFit: "contain" }}
                              className={`h-auto w-full`}
                            />
                          </div>
                        </Link>
                      )}
                      {thumbItem?.button && (
                        <Link href={`${thumbItem?.url}`} className={`w-full`}>
                          <button
                            className={`mt-2 w-full rounded-[5rem] bg-croonus-2 p-2 text-white transition-all duration-500 hover:scale-105 hover:bg-opacity-90`}
                          >
                            {thumbItem?.button}
                          </button>
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

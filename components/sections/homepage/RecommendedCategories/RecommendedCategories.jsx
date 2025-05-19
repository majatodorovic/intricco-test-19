"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const RecommendedCategories = ({ categories }) => {
  return (
    <div
      className="mx-auto mt-8 max-md:w-[95%] md:px-[60px] lg:mt-12 lg:px-[100px]"
      data-aos="fade-up"
    >
      <div className="grid grid-cols-2 gap-3 max-[450px]:grid-cols-1 lg:grid-cols-[1fr,1fr,1fr]">
        {categories?.slice(0, 5)?.map((category, index) => (
          <Link
            key={category.id}
            className={`${
              index === 1 ? "h-full" : ""
            } relative aspect-[4/5] w-full overflow-hidden`}
            href={`/${category?.link?.link_path}`}
          >
            {category?.images?.image && (
              <Image
                src={category?.images?.image}
                alt="category"
                className="object-cover transition-all duration-700 ease-in-out hover:scale-110"
                fill
              />
            )}
            <div className="absolute bottom-8 left-0 z-10 flex w-full items-center justify-center px-3">
              <h3 className="text-center text-2xl font-normal text-whiteSmoke sm:text-3xl lg:text-4xl 2xl:text-5xl">
                {category?.basic_data?.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCategories;

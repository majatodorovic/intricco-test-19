import Link from "next/link";
import React from "react";
import SliderHeader from "./SliderHeader";

function HeaderTop() {
  return (
    <div className="flex h-8 w-full items-center justify-between bg-topHeader px-[5%] md:px-10 lg:px-20">
      <div>
        <Link
          href="https://www.facebook.com/intricco.arilje"
          className="activeCategoryHover relative w-fit text-sm font-normal text-whiteSmoke"
          target="_blank"
        >
          Facebook
        </Link>
        <span className="mx-2 text-whiteSmoke">-</span>
        <Link
          href="https://www.instagram.com/intricco.arilje"
          className="activeCategoryHover relative w-fit text-sm font-normal text-whiteSmoke"
          target="_blank"
        >
          Instagram
        </Link>
      </div>
      <SliderHeader />
      <div className="flex items-center gap-5">
        <Link
          href={`tel:${process.env.TELEPHONE}`}
          className="activeCategoryHover relative w-fit text-sm font-normal text-whiteSmoke"
        >
          {process.env.TELEPHONE}
        </Link>
        <Link
          href={`mailto:${process.env.EMAIL}`}
          className="activeCategoryHover relative w-fit text-sm font-normal text-whiteSmoke"
        >
          {process.env.EMAIL}
        </Link>
      </div>
    </div>
  );
}

export default HeaderTop;

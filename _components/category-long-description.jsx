"use client";

import { useCategory } from "@/hooks/ecommerce.hooks";
import React from "react";

export const CategoryLongDescription = ({ category_id }) => {
  const { data } = useCategory({ slug: category_id });

  if (data) {
    const {
      basic_data: { long_description },
    } = data;

    return (
      <div className={`mt-12 lg:mt-24`}>
        <div
          className="sectionWidth prose mx-auto max-w-full font-normal !text-black max-md:text-center"
          dangerouslySetInnerHTML={{ __html: long_description }}
        ></div>
      </div>
    );
  }
  return null;
};

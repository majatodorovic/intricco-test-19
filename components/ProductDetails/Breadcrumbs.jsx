"use client";

import Link from "next/link";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { get } from "@/api/api";

const Breadcrumbs = ({ id, categoryId }) => {
  const { data: breadcrumbs } = useSuspenseQuery({
    queryKey: ["breadcrumbs", id],
    queryFn: async () => {
      return await get(
        `/product-details/breadcrumbs/${id}?categoryId=${categoryId ?? "*"}`,
      ).then((res) => res?.payload);
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/`} className={`text-[0.95rem] font-normal text-[#000]`}>
        Intricco Underwear
      </Link>{" "}
      <>/</>
      {(breadcrumbs?.steps ?? [])?.map((breadcrumb, index, arr) => {
        return (
          <div className="flex items-center gap-2" key={breadcrumb?.id}>
            <Link
              href={`/${breadcrumb?.link?.link_path}`}
              className="text-[0.95rem] font-normal text-[#000]"
            >
              {breadcrumb?.name}
            </Link>
            {index !== arr.length - 1 && <>/</>}
          </div>
        );
      })}
      {breadcrumbs?.steps.length > 0 && <>/</>}
      <h1 className="text-[0.95rem] font-normal text-primary">
        {breadcrumbs?.end?.name}
      </h1>
    </div>
  );
};

export default Breadcrumbs;

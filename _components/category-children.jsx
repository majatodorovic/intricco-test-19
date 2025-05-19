"use client";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { get } from "@/api/api";

export const CategoryChildren = ({ slug }) => {
  const { data: categories } = useSuspenseQuery({
    queryKey: ["products", { slug }],
    queryFn: async () => {
      return await get(`/categories/product/tree/branch/parent/${slug}`).then(
        (response) => response?.payload,
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const currentSlug = categories?.slug;

  return (
    <div className="mt-[2rem] flex flex-wrap justify-center pl-2 md:gap-y-2">
      {categories?.childrens &&
        (categories?.childrens ?? [])?.map((child) => (
          <div className="mx-1.5 max-md:mx-1 max-md:my-1" key={child?.id}>
            {currentSlug === child?.slug ? (
              <div
                className={`primaryButton flex h-8 w-max cursor-pointer items-center justify-center whitespace-nowrap px-4 text-base font-normal`}
              >
                <p className="">{child?.basic_data?.name}</p>
              </div>
            ) : (
              <Link href={`/${child?.link?.link_path}`}>
                <div
                  className={`flex h-8 w-max items-center justify-center whitespace-nowrap bg-gray px-4 text-base font-normal transition-all duration-300 ease-in-out hover:bg-primary hover:text-whiteSmoke`}
                >
                  <p className="">{child?.basic_data?.name}</p>
                </div>
              </Link>
            )}
          </div>
        ))}
    </div>
  );
};

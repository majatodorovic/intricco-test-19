"use client";
import { useCategory } from "@/hooks/ecommerce.hooks";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/_functions";

export const SingleCategory = ({ slug, path, base_url, text = "" }) => {
  const { data: singleCategory } = useCategory({ slug });

  const breadcrumbs_schema = generateBreadcrumbSchema({
    parents: singleCategory?.parents,
    path,
    base_url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs_schema) }}
      />
      <div className="sectionWidth">
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={`/`}
            className="text-[0.95rem] font-normal text-[#191919]"
          >
            Intricco Underwear
          </Link>
          {singleCategory?.parents?.length > 0 && <>/</>}
          {singleCategory?.parents?.map((breadcrumb, index, arr) => {
            return (
              <div
                key={`category-parent-${index}`}
                className="flex items-center gap-2"
              >
                <Link
                  href={`/${breadcrumb?.link?.link_path}`}
                  className="text-[0.95rem] font-normal text-[#191919]"
                >
                  {breadcrumb?.name}
                </Link>
                {index !== arr.length - 1 && <>/</>}
              </div>
            );
          })}
          <>/</>
          <p className="text-[0.95rem] font-semibold text-primary">
            {singleCategory?.basic_data?.name}
          </p>
        </div>
      </div>
      <div className="sectionWidth mt-[30px] flex flex-col items-center justify-center md:mt-20">
        <div className="flex flex-row items-center justify-center">
          <h1 className="text-[23px] font-normal md:text-[29px]">
            {singleCategory?.basic_data?.name ?? text ?? ""}
          </h1>
        </div>
        {singleCategory?.basic_data?.short_description && (
          <p
            className="text-center font-normal max-md:mt-[15px] sm:mt-[25px]"
            dangerouslySetInnerHTML={{
              __html: singleCategory?.basic_data?.short_description,
            }}
          ></p>
        )}

        {singleCategory?.basic_data?.description && (
          <p
            className="text-center font-normal max-md:mt-[15px] sm:mt-[25px]"
            dangerouslySetInnerHTML={{
              __html: singleCategory?.basic_data?.description,
            }}
          ></p>
        )}
      </div>
    </>
  );
};

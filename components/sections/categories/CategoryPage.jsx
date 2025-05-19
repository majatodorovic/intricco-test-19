import { Suspense } from "react";
import { SingleCategory } from "@/components/CategoryPage/single-category";
import { CategoryProducts } from "@/components/CategoryPage/category-products";
import { CategoryChildren } from "@/_components/category-children";

const CategoryData = ({
  slug,
  sortDirection,
  sortField,
  filters,
  strana,
  allFilters,
  viewed,
  isSection = false,
  base_url,
  path,
  category_id,
}) => {
  const renderText = (slug) => {
    switch (slug) {
      case "recommendation":
        return (
          <div className="mt-[30px] flex flex-col items-center justify-center md:mt-[80px]">
            <h1 className="text-[23px] font-normal uppercase md:text-[29px]">
              Preporučujemo
            </h1>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <>
      <Suspense
        fallback={
          <>
            <div className={`mt-5 h-10 w-full animate-pulse bg-slate-300`} />
            <div className={`mt-10 h-20 w-full animate-pulse bg-slate-300`} />
          </>
        }
      >
        {isSection ? (
          renderText(slug)
        ) : (
          <SingleCategory slug={category_id} base_url={base_url} path={path} />
        )}
      </Suspense>
      <CategoryChildren slug={slug} />
      <CategoryProducts
        slug={category_id}
        viewed={viewed}
        sortDirection={sortDirection}
        sortField={sortField}
        filters={filters}
        strana={strana}
        isSection={isSection}
        allFilters={allFilters}
      />
    </>
  );
};

export default CategoryData;

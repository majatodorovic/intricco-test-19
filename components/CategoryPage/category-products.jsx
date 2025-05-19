"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  useCategoryFilters,
  useCategoryProducts,
} from "@/hooks/ecommerce.hooks";
import Filters from "@/components/sections/categories/Filters";
import { Thumb } from "@/components/Thumb/Thumb";
import FiltersMobile from "@/components/sections/categories/FilterMobile";
import { LoadMore, CategoryPagination } from "@/_components/pagination";
import { CategoryLongDescription } from "@/_components/category-long-description";

export const CategoryProducts = ({
  filters,
  viewed,
  sortDirection,
  sortField,
  allFilters = [],
  slug,
  isSection,
}) => {
  let pagination_type = process.env.PAGINATION_TYPE;

  const router = useRouter();
  const [productsPerViewMobile, setProductsPerViewMobile] = useState(2);
  const params = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  //params iz URL-a
  const filterKey = params?.get("filteri");
  const pageKey = Number(params?.get("strana"));
  const sortKey = params?.get("sort");

  const viewedKey = Number(viewed ?? process.env["PAGINATION_LIMIT"]);

  const [page, setPage] = useState(pageKey > 0 ? pageKey : 1);
  const [sort, setSort] = useState({
    field: sortField ?? "",
    direction: sortDirection ?? "",
  });
  const [selectedFilters, setSelectedFilters] = useState(filters ?? []);
  const [tempSelectedFilters, setTempSelectedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState(allFilters ?? []);
  const [changeFilters, setChangeFilters] = useState(false);
  const [lastSelectedFilterKey, setLastSelectedFilterKey] = useState("");

  // azuriramo query parametre sa selektovanim sortom, stranicom i filterima
  const updateURLQuery = (sort, selectedFilters, page) => {
    let sort_tmp;
    let filters_tmp;
    let page_tmp;
    let limit_tmp;

    if (sort?.field !== "" && sort?.direction !== "") {
      sort_tmp = `${sort?.field}_${sort?.direction}`;
    }

    if (selectedFilters?.length > 0) {
      filters_tmp = selectedFilters
        ?.map((filter) => {
          const selectedValues = filter?.value?.selected?.join("_");
          return `${filter?.column}=${selectedValues}`;
        })
        .join("::");
    } else {
      filters_tmp = "";
    }

    if (page > 1 && pagination_type === "pagination") {
      page_tmp = page;
    } else {
      page_tmp = 1;
    }

    if (pagination_type === "load_more") {
      limit_tmp = viewedKey ?? process.env.PAGINATION_LIMIT;
      if (page > 1) {
        limit_tmp = page * process.env.PAGINATION_LIMIT;
      }
    }

    return { sort_tmp, filters_tmp, page_tmp, limit_tmp };
  };

  const generateQueryString = (sort_tmp, filters_tmp, page_tmp, limit_tmp) => {
    let query_string = "";
    switch (pagination_type) {
      case "load_more":
      case "infinite_scroll":
        query_string = `?${filters_tmp ? `filteri=${filters_tmp}` : ""}${
          filters_tmp && (sort_tmp || limit_tmp) ? "&" : ""
        }${sort_tmp ? `sort=${sort_tmp}` : ""}${
          sort_tmp && limit_tmp ? "&" : ""
        }${limit_tmp ? `viewed=${limit_tmp}` : ""}`;
        break;
      default:
        query_string = `?${filters_tmp ? `filteri=${filters_tmp}` : ""}${
          filters_tmp && (sort_tmp || page_tmp) ? "&" : ""
        }${sort_tmp ? `sort=${sort_tmp}` : ""}${
          sort_tmp && page_tmp ? "&" : ""
        }${page_tmp > 1 ? `strana=${page_tmp}` : ""}`;
    }

    return query_string;
  };

  useEffect(() => {
    const { sort_tmp, filters_tmp, page_tmp, limit_tmp } = updateURLQuery(
      sort,
      selectedFilters,
      page,
    );

    const query_string = generateQueryString(
      sort_tmp,
      filters_tmp,
      page_tmp,
      limit_tmp,
    );
    router.push(query_string, { scroll: false });
  }, [sort, selectedFilters, page]);

  const getPage = (page) => {
    switch (pagination_type) {
      case "pagination":
        return pageKey ?? 1;
      case "load_more":
        return page;
      case "infinite_scroll":
        return page;
    }
  };
  //dobijamo proizvode za kategoriju sa api-ja
  const { data, isFetching, fetchNextPage, hasNextPage } = useCategoryProducts({
    slug,
    page: getPage(page),
    limit: viewedKey ?? process.env.PAGINATION_LIMIT,
    sort: sortKey ?? "_",
    setSelectedFilters: setSelectedFilters,
    filterKey: filterKey,
    setSort: setSort,
    render: false,
    isSection: isSection,
  });

  const mutateFilters = useCategoryFilters({
    slug,
    page,
    limit: 10,
    sort,
    selectedFilters: tempSelectedFilters,
    isSection: isSection,
  });

  //ako je korisnik dosao na stranicu preko linka sa prisutnim filterima u URL,onda se ti filteri selektuju i okida se api da azurira dostupne filtere
  useEffect(() => {
    if (filters?.length > 0) {
      mutateFilters.mutate({
        slug,
        selectedFilters: tempSelectedFilters,
        lastSelectedFilterKey,
        setAvailableFilters,
        availableFilters,
      });
    }
  }, []);

  //okidamo api za filtere na promenu filtera
  useEffect(() => {
    mutateFilters.mutate({
      slug,
      selectedFilters: tempSelectedFilters,
      lastSelectedFilterKey,
      setAvailableFilters,
      availableFilters,
    });
  }, [tempSelectedFilters?.length]);

  const getPaginationArray = (selectedPage, totalPages) => {
    const start = Math.max(1, selectedPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getItems = (pagination_type) => {
    switch (pagination_type) {
      case "infinite_scroll":
        return (data?.pages ?? [])?.flatMap((page) => page?.items);
      default:
        return data?.items;
    }
  };

  useEffect(() => {
    if (pagination_type === "infinite_scroll") {
      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;

        // Calculate the percentage scrolled
        const scrollPosition = (scrollTop + clientHeight) / scrollHeight;

        // Check if the scroll position is greater than or equal to 70%
        if (scrollPosition >= 0.7 && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      };

      // Add event listener for scroll
      window.addEventListener("scroll", handleScroll);

      // Cleanup the event listener when component unmounts
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pagination_type, hasNextPage, isFetching, fetchNextPage]);

  return (
    <>
      <div className="sectionWidth mt-20 max-md:hidden">
        <Filters
          selectedFilters={selectedFilters}
          availableFilters={availableFilters}
          setSelectedFilters={setSelectedFilters}
          setPage={setPage}
          setSort={setSort}
          changeFilters={changeFilters}
          pagination={data?.pagination}
          setTempSelectedFilters={setTempSelectedFilters}
          setLastSelectedFilterKey={setLastSelectedFilterKey}
          setChangeFilters={setChangeFilters}
        />
      </div>
      <div
        className={`sectionWidth sticky !top-[4rem] z-[51] mt-6 flex items-center gap-5 bg-white py-2 lg:hidden`}
      >
        <button
          className={`flex flex-1 items-center justify-center border py-2 text-center text-[0.9rem] md:text-[1.2rem]`}
          onClick={() => setFilterOpen(true)}
        >
          Filteri
        </button>
        <div className={`flex items-center gap-3 md:hidden`}>
          {/*a div 40px high and 40px wide*/}
          <div
            className={`h-[30px] w-[30px] border-2 ${
              productsPerViewMobile === 1 && "border-black"
            }`}
            onClick={() => setProductsPerViewMobile(1)}
          ></div>
          {/*a div 40px high and 40px wide that has 9 smaller squares inside*/}
          <div
            className={`grid h-[30px] w-[30px] grid-cols-2 border ${
              productsPerViewMobile === 2 && "border-black"
            }`}
            onClick={() => setProductsPerViewMobile(2)}
          >
            {Array.from({ length: 4 }, (_, i) => {
              return (
                <div
                  key={i}
                  className={`col-span-1 border ${
                    productsPerViewMobile === 2 && "border-black"
                  }`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
      {data?.items?.length > 0 || data?.pages?.length > 0 ? (
        <>
          <div className={`max-lg:hidden lg:mx-[80px]`}>
            <div
              className={`mt-5 grid grid-cols-3 gap-x-5 gap-y-10 xl:grid-cols-4`}
            >
              {getItems(pagination_type)?.map(({ id }) => {
                return (
                  <Suspense
                    key={`suspense-${id}`}
                    fallback={
                      <div
                        className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                      />
                    }
                  >
                    <Thumb slug={id} categoryId={slug ?? "*"} />
                  </Suspense>
                );
              })}
            </div>
          </div>
          <div className={`sectionWidth lg:hidden`}>
            <div
              className={`mt-[50px] grid grid-cols-${productsPerViewMobile} gap-x-[20px] gap-y-[36px] md:grid-cols-2`}
            >
              {getItems(pagination_type)?.map(({ id }) => {
                return (
                  <Suspense
                    key={`suspense-${id}`}
                    fallback={
                      <div
                        className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                      />
                    }
                  >
                    <Thumb slug={id} key={`$thumb-${id}`} />
                  </Suspense>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full items-center justify-center py-10 text-center">
          <h1 className="text-[1.1rem] text-[#191919]">
            U traženoj kategoriji nema proizvoda, ili izabrani filteri ne daju
            rezultate.
          </h1>
        </div>
      )}

      {data?.pagination?.total_pages > 1 &&
        process.env.PAGINATION_TYPE === "load_more" && (
          <LoadMore
            data={data}
            setPage={setPage}
            page={page}
            isFetching={isFetching}
          />
        )}

      {data?.pagination?.total_pages > 1 &&
        process.env.PAGINATION_TYPE === "pagination" && (
          <CategoryPagination
            generateQueryString={() => {
              const { sort_tmp, filters_tmp, page_tmp } = updateURLQuery(
                sort,
                selectedFilters,
                page,
              );
              return generateQueryString(sort_tmp, filters_tmp, page_tmp);
            }}
            data={data}
            page={page}
            slug={slug}
            setPage={setPage}
            getPaginationArray={getPaginationArray}
          />
        )}
      <Suspense
        fallback={
          <div className={`mt-10 h-10 w-full animate-pulse bg-slate-200`} />
        }
      >
        <CategoryLongDescription category_id={slug} />
      </Suspense>
      <div
        className={
          filterOpen
            ? `fixed left-0 top-0 z-[3000] h-[100dvh] w-full translate-x-0 bg-white duration-500`
            : `fixed left-0 top-0 z-[3000] h-[100dvh] w-full -translate-x-full bg-white duration-500`
        }
      >
        <FiltersMobile
          selectedFilters={selectedFilters}
          availableFilters={availableFilters}
          setSelectedFilters={setSelectedFilters}
          sort={sort}
          setPage={setPage}
          setSort={setSort}
          setFilterOpen={setFilterOpen}
          setTempSelectedFilters={setTempSelectedFilters}
          setChangeFilters={setChangeFilters}
          tempSelectedFilters={tempSelectedFilters}
          setLastSelectedFilterKey={setLastSelectedFilterKey}
        />
      </div>
    </>
  );
};

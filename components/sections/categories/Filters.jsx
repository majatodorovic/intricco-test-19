"use client";
import Filter from "./Filter";
import { sortKeys } from "@/helpers/const";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Filters = ({
  availableFilters,
  selectedFilters,
  setSelectedFilters,
  setSort,
  pagination,
  setTempSelectedFilters,
  setLastSelectedFilterKey,
  setChangeFilters,
  setPage,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [openSort, setOpenSort] = useState({
    open: false,
    key: {
      field: "",
      direction: "",
    },
  });
  const filterRef = useRef(null);

  const handleClickInsideAndOutside = (e) => {
    // Close the filter if the click occurred outside of it or if the user clicked on the filter

    if (
      (!filterRef?.current?.contains(e.target) ||
        e.target?.classList?.contains("filter")) &&
      openIndex !== null
    ) {
      setOpenIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickInsideAndOutside);
    return () => {
      document.removeEventListener("click", handleClickInsideAndOutside);
    };
  }, [openIndex]);

  const sortRef = useRef(null);

  const handleClickInsideAndOutsideSort = (e) => {
    if (
      (!sortRef?.current?.contains(e.target) ||
        e.target?.classList?.contains("sortref")) &&
      openSort !== false
    ) {
      setOpenSort({
        ...openSort,
        open: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickInsideAndOutsideSort);
    return () => {
      document.removeEventListener("click", handleClickInsideAndOutsideSort);
    };
  }, [openSort]);

  const params = useSearchParams();
  const sortParam = params?.get("sort") ?? "_";

  const keys = sortParam?.split("_");

  useEffect(() => {
    if (sortParam) {
      setSort({
        field: keys[0],
        direction: keys[1],
      });
    }
  }, [sortParam]);

  function getPaginationDisplay() {
    const start =
      (pagination.selected_page - 1) * pagination.items_per_page + 1;
    let end = pagination.selected_page * pagination.items_per_page;
    if (end > pagination.total_items) end = pagination.total_items;

    return `Prikaz: ${start}-${end} od ${pagination.total_items} rezultata`;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-[4.5rem]`}>
          {(availableFilters ?? []).map((filter, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={`${index}-filters`}
                className="relative filter max-lg:hidden"
              >
                <div
                  className="relative cursor-pointer select-none filter"
                  key={filter?.id}
                  onClick={() => {
                    setOpenIndex(openIndex === index ? null : index);
                  }}
                >
                  <div
                    className={`relative flex items-center gap-2 py-[0.65rem] filter`}
                  >
                    <h1 className="text-center text-base font-light filter">
                      {filter?.attribute?.name}
                    </h1>
                    <Image
                      className={`h-auto w-4 ${
                        isOpen
                          ? `rotate-180 filter transition-all duration-500`
                          : `rotate-0 filter transition-all duration-500`
                      }`}
                      src={`/icons/chevron.png`}
                      alt={`TFY Production`}
                      width={15}
                      height={15}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div
                    ref={filterRef}
                    className={`z-[20] ${
                      filter?.name === "Cena" && "w-[230px]"
                    } absolute left-0 top-[43px] w-[150px] border-b border-l border-r border-t border-[#f2f2f2] bg-white`}
                  >
                    <div className="pb-3.5 filter">
                      <Filter
                        filter={filter}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        setTempSelectedFilters={setTempSelectedFilters}
                        setLastSelectedFilterKey={setLastSelectedFilterKey}
                        setChangeFilters={setChangeFilters}
                        setPage={setPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {selectedFilters?.length > 0 && (
          <div
            className="relative ml-[6rem] mr-auto cursor-pointer select-none"
            onClick={() => {
              setSelectedFilters([]);
              setChangeFilters(true);
              setOpenIndex(null);
            }}
          >
            <div className={`relative flex items-center gap-2`}>
              <h1 className="text-center text-base font-light">
                Izbrišite sve
              </h1>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
        )}
        <div className={`flex items-center gap-10 max-lg:hidden`}>
          <div className="relative col-span-1 col-start-7 flex items-center justify-end"></div>
          <div className="relative col-span-1 col-start-8 flex items-center justify-end">
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() =>
                setOpenSort({
                  ...openSort,
                  open: !openSort.open,
                })
              }
            >
              <h1 className="text-center text-base font-light">Sortiranje</h1>
              <Image
                className={`h-auto w-4 ${
                  openSort.open
                    ? `rotate-180 transition-all duration-500`
                    : `rotate-0 transition-all duration-500`
                }`}
                src={`/icons/chevron.png`}
                alt={`TFY Production`}
                width={15}
                height={15}
              />
            </div>
            {openSort?.open && (
              <div
                ref={sortRef}
                className="sortref absolute right-[-100px] top-[33px] z-[2] flex w-[250px] flex-col items-center justify-end border border-[#f2f2f2]"
              >
                {sortKeys.map((key, index) => {
                  const isActive =
                    openSort?.key?.field === key?.field &&
                    openSort?.key?.direction === key?.direction;
                  return (
                    <div
                      key={`${index}-sortKey`}
                      className={`sortref flex w-full cursor-pointer items-center justify-start px-4 py-2 text-[0.875rem] text-black ${
                        isActive ? "" : "bg-white"
                      }`}
                      onClick={() =>
                        setSort({
                          field: key?.field,
                          direction: key?.direction,
                        })
                      }
                    >
                      <h1
                        className={`sortref ${
                          isActive ? `text-primary` : ``
                        } text-center text-[1rem] font-light hover:text-primary`}
                        onClick={() =>
                          setOpenSort({
                            open: false,
                            key: {
                              field: key?.field,
                              direction: key?.direction,
                            },
                          })
                        }
                      >
                        {key?.label}
                      </h1>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="relative col-span-1 col-start-9 flex items-center justify-end gap-3 md:hidden lg:flex">
            <h1 className="text-center text-base font-light">
              {getPaginationDisplay()}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;

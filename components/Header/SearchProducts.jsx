"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { list } from "@/api/api";
import Link from "next/link";
import { currencyFormat } from "@/helpers/functions";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import noImage from "../../public/images/placeholder.webp";

const SearchProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const searchRef = useRef(null);

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["searchData", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch?.length >= 3) {
        return await list(`/products/search/list`, {
          search: debouncedSearch,
        }).then((res) => {
          setLoading(false);
          return res?.payload;
        });
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm?.length >= 3) {
      router.push(`/search?search=${searchTerm}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative w-[400px] rounded-2xl bg-gray py-4 ${debouncedSearch?.length >= 3 && "!rounded-b-none"}`}
      ref={searchRef}
    >
      <form onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          placeholder="Pretraži proizvode"
          className="rounded-0 absolute left-0 top-0 h-full w-full border-0 bg-transparent px-5 text-sm font-normal text-black placeholder:text-black focus:border-0 focus:outline-none focus:ring-0"
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setLoading(true);
          }}
          value={searchTerm}
        />
        {searchTerm?.length >= 1 && searchTerm?.length < 3 ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 py-2">
            <span className={`text-[0.8rem] font-normal text-red-500`}>
              Unesite najmanje 3 karaktera.
            </span>
          </div>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 py-2">
            <Image
              src={"/icons/search.png"}
              width={18}
              height={18}
              className="object-cover"
              alt="search"
            />
          </div>
        )}
        {debouncedSearch?.length >= 3 && (
          <div className="hidescrollbar absolute right-0 top-[30px] z-[200] flex h-[420px] w-[400px] flex-col overflow-y-auto bg-gray">
            {searchData?.items?.length > 0 ? (
              <div className="mx-auto mt-5 w-[95%]">
                <p className="text-[1rem] font-normal">Rezultati pretrage</p>
                <div className="mt-3 flex flex-col gap-5 pb-5">
                  {searchData?.items?.slice(0, 6)?.map((item) => (
                    <Link
                      key={item?.link?.link_path}
                      href={`/${item?.link?.link_path}`}
                      onClick={() => setSearchTerm("")}
                    >
                      <div className="flex flex-row items-center gap-5">
                        <div className="relative h-[60px] w-[60px]">
                          <Image
                            src={item.image[0] || noImage}
                            alt=""
                            fill
                            sizes="100vw"
                            className="min-w-[60px] rounded-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.9rem] font-normal">
                            {item?.basic_data?.name}
                          </p>
                          <div className="flex w-fit gap-3 text-left text-[0.9rem] font-bold">
                            {item?.price?.min?.price_defined &&
                            item?.price?.max?.price_defined ? (
                              item.price.min.price.discount ===
                                item.price.max.price.discount &&
                              item.price.min.price.original ===
                                item.price.max.price.original ? (
                                // Ako su min i max potpuno isti (bilo da su discount ili original), prikazi samo jednu cenu
                                item.price.min.price.discount ? (
                                  <>
                                    {currencyFormat(
                                      item.price.min.price.discount,
                                    )}
                                    <del>
                                      {currencyFormat(
                                        item.price.min.price.original,
                                      )}
                                    </del>
                                  </>
                                ) : (
                                  currencyFormat(item.price.min.price.original)
                                )
                              ) : item.price.max.price.discount ? (
                                // Ako postoji discount, prikazi opseg za discount i original
                                <div className="flex flex-col gap-1">
                                  {currencyFormat(
                                    item.price.min.price.discount,
                                  )}{" "}
                                  -{" "}
                                  {currencyFormat(
                                    item.price.max.price.discount,
                                  )}
                                  <del>
                                    {currencyFormat(
                                      item.price.min.price.original,
                                    )}{" "}
                                    -{" "}
                                    {currencyFormat(
                                      item.price.max.price.original,
                                    )}
                                  </del>
                                </div>
                              ) : item.price.min.price.original ===
                                item.price.max.price.original ? (
                                // Ako su originalne cene iste, prikazi samo jednu cenu
                                currencyFormat(item.price.min.price.original)
                              ) : (
                                // Inace, prikazi opseg originalnih cena
                                <>
                                  {currencyFormat(
                                    item.price.min.price.original,
                                  )}{" "}
                                  -{" "}
                                  {currencyFormat(
                                    item.price.max.price.original,
                                  )}
                                </>
                              )
                            ) : item?.price?.price?.discount ? (
                              // Ako postoji pojedinacna cena sa discount-om
                              <>
                                <del>
                                  {currencyFormat(item.price.price.original)}
                                </del>
                                {currencyFormat(item.price.price.discount)}
                              </>
                            ) : (
                              // Ako postoji samo originalna pojedinacna cena
                              currencyFormat(item?.price?.price?.original)
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              !isFetching && (
                <div className="mx-auto mt-5 w-[95%]">
                  <span className="text-[0.9rem] font-normal">
                    Nema rezultata pretrage
                  </span>
                </div>
              )
            )}
            {loading && (
              <div className={`mx-auto mt-5 w-[95%] text-center`}>
                <i className={`fas fa-spinner fa-spin text-xl text-black`}></i>
              </div>
            )}
            {!loading && searchData?.items?.length > 0 && (
              <div
                className={`primaryButton sticky bottom-0 mt-auto w-full py-2 text-center`}
              >
                <button
                  onClick={(e) => {
                    handleSearch(e);
                  }}
                  className={`h-full w-full`}
                >
                  Prikaži sve rezultate (
                  {searchData?.pagination?.total_items > 10
                    ? `još ${searchData?.pagination?.total_items - 10}`
                    : `Pretraži`}
                  )
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchProducts;

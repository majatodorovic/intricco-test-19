"use client";
import { list } from "@/api/api";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { currencyFormat } from "@/helpers/functions";
import useDebounce from "@/hooks/useDebounce";
import SliderHeaderMobile from "../Header/SliderHeaderMobile";
import { useQuery } from "@tanstack/react-query";
import {
  useCartBadge,
  useCategoryTree,
  useLandingPages,
  useNewProducts,
} from "@/hooks/ecommerce.hooks";

const NavigationMobile = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: newProducts } = useNewProducts(true);
  const { data: categories } = useCategoryTree();
  const { data: landingPagesList } = useLandingPages();
  const { data: cartCount, refetch } = useCartBadge();

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeCategory, setActiveCategory] = useState({
    id: undefined,
    data: [],
    parentCategory: undefined,
    firstCategory: null,
  });
  // const [lastActiveCategory, setLastActiveCategory] = useState({
  //   id: undefined,
  //   data: [],
  //   parentCategory: undefined,
  // });
  let exActiveIds = [];
  // const [activeImage, setActiveImage] = useState();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm?.length >= 3) {
      router.push(`/search?search=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const scrollY = window.scrollY;

    if (searchOpen || menuOpen) {
      document.body.style.cssText = `
        position: fixed;
        top: -${scrollY}px;
        left: 0;
        right: 0;
        overflow: hidden;
        width: 100%;
      `;
      document.documentElement.style.overflow = "hidden";
    } else {
      const savedScrollY = document.body.style.top;
      document.body.removeAttribute("style");
      document.documentElement.style.overflow = "";
      window.scrollTo(0, parseInt(savedScrollY || "0") * -1);
    }
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    if (!pathname?.includes("/")) {
      setActiveCategory({
        id: categories[0]?.id ?? 0,
        data: categories[0]?.children ?? [],
        parentCategory: categories[0]?.id ?? 0,
        firstCategory: true,
      });
    }
  }, [categories]);

  // const [generateBreadcrumbs, setGenerateBreadcrumbs] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  // const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScrollIconDisappear = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 300) {
        setSearchVisible(true);
      } else {
        setSearchVisible(false);
      }
      // setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScrollIconDisappear);
    return () => {
      window.removeEventListener("scroll", handleScrollIconDisappear);
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes("/korpa/")) {
      refetch();
      router?.refresh();
    }
  }, [pathname]);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: searchData, isFetching } = useQuery({
    queryKey: ["searchData", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch?.length >= 3) {
        return await list(`/products/search/list`, {
          search: debouncedSearch,
        }).then((res) => {
          return res?.payload;
        });
      }
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const categoriesMain = [
    { name: "Početna", slug: "/" },
    { name: "Lokacije", slug: "/lokacije" },
    { name: "Kontakt", slug: "/kontakt" },
    ...(newProducts?.items?.length > 0
      ? [
          {
            name: "Novo",
            slug: "/novo",
            isCategory: false,
          },
        ]
      : []),
  ];

  return (
    <>
     <SliderHeaderMobile />
      <div className="sticky top-0 z-[2000] w-full bg-white bg-opacity-90 backdrop-blur-md xl:hidden">
        <div className="mx-auto flex w-[95%] items-center justify-between py-3">
          <div onClick={() => setMenuOpen(true)}>
            <Image
              alt={`HAMBURGER ICON`}
              src={"/icons/hamburger.png"}
              width={30}
              height={30}
            />
          </div>
          <Link href="/">
            <div className="relative">
              <Image
                alt={`logo`}
                src={"/images/logo/logo.png"}
                width={150}
                height={33}
                className="h-auto w-36"
              />
            </div>
          </Link>
          <div className="relative flex items-center gap-4">
            {" "}
            {pathname === "/" ? (
              <div
                className={
                  searchVisible
                    ? `visible opacity-100 transition-all duration-500`
                    : `invisible opacity-0 transition-all duration-500`
                }
              >
                <Image
                  src="/icons/search.png"
                  alt="search icon"
                  id="search"
                  width={20}
                  height={20}
                  onClick={() => setSearchOpen(true)}
                />
              </div>
            ) : (
              <div>
                <Image
                  src={"/icons/search.png"}
                  alt="search icon"
                  id="search"
                  width={20}
                  height={20}
                  onClick={() => setSearchOpen(true)}
                />
              </div>
            )}
            <Link href={`/login`}>
              <Image
                alt="user icon"
                src={"/icons/user.png"}
                width={20}
                height={20}
                className="h-auto w-5"
              />
            </Link>
            <Link href="/korpa">
              <div className="relative">
                <Image
                  alt="cart icon"
                  className="h-auto w-6"
                  src={"/icons/shopping-bag.png"}
                  width={20}
                  height={20}
                />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1.5 min-w-4 rounded-full bg-[#e10000] px-1 py-0 text-center text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>{" "}
      </div>
      <div
        className={
          searchVisible
            ? `text-white ${
                pathname === "/" ? `flex items-center justify-center` : `hidden`
              } invisible sticky top-[60px] z-[4000] bg-transparent opacity-0 transition-all duration-500 md:hidden`
            : `text-white ${
                pathname === "/" ? `flex items-center justify-center` : `hidden`
              } visible sticky top-[60px] z-[4000] bg-transparent opacity-100 transition-all duration-500 md:hidden`
        }
      >
        <form
          className="absolute mx-auto mt-14 flex h-12 w-[90%] items-center py-2"
          onClick={() => setSearchOpen(true)}
        >
          <div
            type="text"
            className="h-full w-full rounded-lg border border-white bg-transparent py-2 pl-8 text-xs text-white mix-blend-difference placeholder:text-xs placeholder:text-white focus:border-white focus:outline-none focus:ring-0"
            placeholder="Pretraga"
            onChange={(e) => setSearchTerm(e.target.value)}
            onMouseDown={() => setSearchOpen(true)}
          />
          <p className="absolute left-8 text-sm">Pretraga</p>
          <i className="fa-solid fa-search absolute left-2 top-5 text-xs text-white"></i>
        </form>
      </div>
      <div
        className={
          menuOpen
            ? `fixed left-0 top-0 z-[5000] flex h-screen w-full translate-x-0 flex-col bg-white transition-all duration-500`
            : `fixed left-0 top-0 z-[5000] flex h-screen w-full -translate-x-full flex-col bg-white transition-all duration-500`
        }
      >
        <div className="mx-auto flex w-[95%] items-center justify-between py-3.5">
          <Image
            src="/images/logo/logo.png"
            width={150}
            height={150}
            alt="logo"
            className="h-auto w-36"
          />
          <i
            className="fas fa-times text-2xl"
            onClick={() => setMenuOpen(false)}
          ></i>
        </div>
        <div className="mx-auto mt-5 flex w-[95%] flex-row gap-7 border-b border-b-[#e5e7eb] pb-2">
          {(categories ?? [])?.map((category) => {
            const isActive = activeCategory?.parentCategory === category?.id;
            return (
              <div
                className="flex flex-row items-center justify-between gap-5"
                key={category?.id}
              >
                <p
                  className={
                    isActive
                      ? `text-[0.9rem] font-bold uppercase`
                      : `text-[0.9rem] uppercase`
                  }
                  onClick={() => {
                    if (!category.children) {
                      router.push(`/${category.slug}`);
                      setMenuOpen(false);
                    }
                    setActiveCategory({
                      id: category?.id,
                      data: category?.children,
                      parentCategory: category?.id,
                      firstCategory: true,
                    });
                    // setActiveImage(category?.image);
                    // setGenerateBreadcrumbs(category?.name);
                  }}
                >
                  {category?.name}
                </p>
              </div>
            );
          })}
        </div>
        {activeCategory?.data?.length > 0 && (
          <div className="mx-auto mt-5 w-[95%]">
            <button
              className="flex w-full items-center justify-between gap-5"
              onClick={() => {
                let datatmp = [];
                // let imagetmp = "";
                categories?.map((category) => {
                  if (category?.id === activeCategory?.parentCategory) {
                    datatmp = category?.children;
                  }
                });
                // const image = categories?.map((category) => {
                //   if (category?.id === activeCategory?.parentCategory) {
                //     imagetmp = category?.image;
                //   }
                // });
                setActiveCategory({
                  id: activeCategory?.parentCategory,
                  data: datatmp,
                  parentCategory: activeCategory?.parentCategory,
                  firstCategory: true,
                });
                // setActiveImage(imagetmp);
                // setGenerateBreadcrumbs();
              }}
            >
              {!activeCategory?.firstCategory && (
                <div className={`flex w-full items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-chevron-left text-base"></i>
                    <p className="text-[0.9rem] font-normal">Nazad</p>
                  </div>
                </div>
              )}
            </button>
          </div>
        )}
        {activeCategory?.data?.length > 0 && (
          <div className="mx-auto mt-5 flex w-[95%] flex-col gap-5 overflow-y-auto">
            {activeCategory?.data?.length > 0 &&
              activeCategory?.data?.map((category) => {
                return (
                  <div
                    className="flex w-full flex-row items-center justify-between gap-5"
                    key={category?.id}
                  >
                    {category?.children?.length > 0 ? (
                      <div
                        className={`${
                          activeCategory.firstCategory
                            ? `flex w-full flex-row items-center justify-between uppercase`
                            : `flex w-full flex-row items-center justify-between uppercase`
                        } text-[0.9rem]`}
                        onClick={() => {
                          // setLastActiveCategory({
                          //   id: category?.id,
                          //   data: category?.children,
                          // });
                          setActiveCategory({
                            id: category?.id,
                            data: category?.children,
                            parentCategory: activeCategory?.parentCategory,
                          });
                          // setActiveImage(category?.image);
                          // setGenerateBreadcrumbs((prev) => {
                          //   if (prev) {
                          //     return `${prev} / ${category?.name}`;
                          //   } else {
                          //     return `${category?.name}`;
                          //   }
                          // });
                          exActiveIds.push(category?.id);
                        }}
                      >
                        <p>{category?.name}</p>
                        {category?.children?.length > 0 && (
                          <i className="fas fa-chevron-right"></i>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={`/${category?.link?.link_path}`}
                        className={`${
                          activeCategory.firstCategory
                            ? `w-full uppercase`
                            : `w-full`
                        } ${
                          pathname?.includes(category?.slug)
                            ? `text-[#e10000]`
                            : `text-black`
                        } text-[0.9rem]`}
                        onClick={() => {
                          setMenuOpen(false);
                          setActiveCategory({
                            id: categories[0]?.id,
                            data: categories[0]?.children,
                            parentCategory: categories[0]?.id,
                          });
                          // setActiveImage(categories[0]?.image);
                          // setGenerateBreadcrumbs();
                          // setLastActiveCategory({
                          //   id: categories[0]?.id,
                          //   data: categories[0]?.children,
                          // });
                        }}
                      >
                        {category?.name}
                      </Link>
                    )}
                  </div>
                );
              })}
          </div>
        )}
        <div className="mx-auto mt-10 flex w-[95%] flex-col gap-3">
          {(landingPagesList?.items ?? [])?.map((item) => {
            return (
              <Link
                key={item?.id}
                onClick={() => {
                  setMenuOpen(false);
                }}
                href={`/promo/${item?.slug}`}
                className="animate-pulse text-[1.2rem] uppercase text-red-500"
              >
                {item?.name}
              </Link>
            );
          })}
          {(categoriesMain ?? [])?.map((category) => (
            <Link
              key={category?.name}
              onClick={() => {
                setMenuOpen(false);
              }}
              href={`${category?.slug}`}
              className={`text-[1.2rem] uppercase`}
            >
              {category?.name}
            </Link>
          ))}
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed left-0 top-0 z-[4000] h-screen w-screen bg-black bg-opacity-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      {searchOpen && (
        <div className="fixed left-0 top-0 z-[10000] h-screen w-screen overflow-y-auto bg-white">
          <div className="mx-auto mt-6 flex w-[95%] items-center gap-2">
            <form onSubmit={handleSearch} className="relative w-[90%]">
              <input
                type="text"
                className="w-full rounded-lg border border-[#191919] pl-10 placeholder:text-base focus:border-[#191919] focus:outline-none focus:ring-0"
                placeholder="Unesite pojam za pretragu "
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-[#191919]"></i>
              {searchTerm?.length >= 1 && searchTerm?.length < 3 ? (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 py-2">
                  <span className={`text-[0.8rem] font-normal text-red-500`}>
                    Unesite najmanje 3 karaktera.
                  </span>
                </div>
              ) : null}
            </form>
            <p
              className="text-xs"
              onClick={() => {
                setSearchOpen(false);
                setSearchTerm("");
              }}
            >
              Otkaži
            </p>
          </div>
          {searchData?.items?.length > 0 && searchTerm?.length > 0 && (
            <div className="mx-auto mt-5 w-[95%]">
              <p className="text-[1rem] font-normal">Rezultati pretrage</p>
              <div className="mt-3 flex flex-col gap-5">
                {searchData?.items?.slice(0, 6)?.map((item) => {
                  return (
                    <Link
                      key={item?.id}
                      href={`/${item?.link?.link_path}`}
                      onClick={(e) => {
                        setSearchOpen(false);
                        handleSearch(e);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex flex-row items-center gap-5">
                        <div className="relative h-[60px] w-[60px]">
                          <Image
                            src={item.image[0]}
                            alt={``}
                            fill
                            sizes="100vw"
                            className={`rounded-full object-cover`}
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
                  );
                })}
                {searchData?.items?.length > 6 && (
                  <Link
                    href={`/search?search=${searchTerm}`}
                    className={`primaryButton mx-auto mt-4 w-full py-3 text-center`}
                    onClick={(e) => {
                      setSearchOpen(false);
                      handleSearch(e);
                      setSearchTerm("");
                    }}
                  >
                    {`Pogledaj sve rezultate ( još ${
                      searchData?.pagination?.total_items -
                      (searchData?.items?.length > 6
                        ? 6
                        : searchData?.items?.length)
                    } )`}
                  </Link>
                )}
              </div>
            </div>
          )}
          {searchData?.items?.length === 0 && (
            <div className="mx-auto mt-5 w-[95%]">Nema rezultata</div>
          )}
          {isFetching && (
            <div className={`mx-auto mt-5 w-[95%] text-center`}>
              <i className={`fas fa-spinner fa-spin text-xl text-black`}></i>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NavigationMobile;

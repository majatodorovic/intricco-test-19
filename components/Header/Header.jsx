"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import HeaderIcons from "./HeaderIcons";
import SearchProducts from "./SearchProducts";
import { usePathname, useRouter } from "next/navigation";
import {
  useCategoryTree,
  useLandingPages,
  useNewProducts,
} from "@/hooks/ecommerce.hooks";

const Header = () => {
  const { data: newProducts } = useNewProducts(true);
  const { data: categories } = useCategoryTree();
  const { data: landingPagesList } = useLandingPages();
  const router = useRouter();
  const categoriesMain = [
    { name: "Početna", slug: "/", isCategory: false, id: 0 },
    ...(categories ? categories : []),
    { name: "Lokacije", slug: "/lokacije", isCategory: false },
    { name: "Kontakt", slug: "/kontakt", isCategory: false },
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

  const [activeCategory, setActiveCategory] = useState({
    open: false,
    id: null,
    name: null,
    slug: null,
    data: [],
    image: null,
  });

  const [activeSubCategory, setActiveSubCategory] = useState({
    open: false,
    id: null,
    name: null,
    slug_path: null,
    data: [],
    image: null,
  });

  const resetActiveCategory = () => {
    setActiveCategory({
      open: false,
      id: null,
      name: null,
      slug: null,
      data: [],
      image: null,
    });
    setActiveSubCategory({
      open: false,
      id: null,
      name: null,
      slug: null,
      data: [],
      image: null,
    });
  };

  const [visible, setVisible] = useState("");
  useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY < 40)
        return setVisible(
          "sticky top-0 translate-y-0 transition-all duration-500",
        );
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) {
        setVisible(
          "sticky top-0 -translate-y-full transition-all duration-500",
        );
        resetActiveCategory();
      } else {
        setVisible("sticky top-0 translate-y-0 transition-all duration-500");
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const pathname = usePathname();

  return (
    <>
      <header
        className={`max-xl:hidden ${visible} relative z-[2000] w-full border-b-4 border-gray bg-white`}
        id="header"
      >
        <HeaderTop />
        <div className="sectionWidth flex items-center justify-between py-5">
          <div className={`flex items-center gap-6 md:mr-[20px]`}>
            <Link href="/">
              <Image
                src="/images/logo/logo.png"
                width={185}
                height={39}
                className="mr-10 object-cover"
                alt="logo"
              />
            </Link>
            {categoriesMain?.map((category, index) => {
              const isCategory = category?.isCategory ?? true;
              return isCategory ? (
                category?.children ? (
                  <button
                    key={index}
                    className={`${
                      category?.id === activeCategory?.id ||
                      pathname.includes(category?.slug)
                        ? "activeCategory"
                        : "font-normal"
                    } activeCategoryHover relative block w-fit text-sm text-black xl:text-base 2xl:text-lg`}
                    onClick={() => router.push(`/${category.slug}`)}
                    onMouseEnter={() => {
                      setActiveCategory({
                        id:
                          category?.id === activeCategory?.id
                            ? null
                            : category?.id,
                        name:
                          category?.name === activeCategory?.name
                            ? null
                            : category?.name,
                        slug:
                          category?.slug === activeCategory?.slug
                            ? null
                            : category?.slug,
                        data: category?.children ?? [],
                        image: category?.image ?? null,
                        open: true,
                      });
                    }}
                  >
                    {category?.name}
                  </button>
                ) : (
                  <Link
                    href={`/${category?.link?.link_path}`}
                    key={index}
                    onClick={() => resetActiveCategory()}
                  >
                    <span
                      className={`activeCategoryHover relative block w-fit text-sm text-black xl:text-base 2xl:text-lg ${
                        pathname?.includes(category?.slug) && category?.id !== 0
                          ? "activeCategory"
                          : ""
                      }`}
                    >
                      {category?.name}
                    </span>
                  </Link>
                )
              ) : (
                <Link
                  href={`${category?.slug}`}
                  key={index}
                  onClick={resetActiveCategory}
                >
                  <span
                    className={`activeCategoryHover relative block w-fit text-sm text-black xl:text-base 2xl:text-lg ${
                      pathname?.includes(category?.slug) && category?.id !== 0
                        ? "activeCategory"
                        : pathname === category?.slug && category?.id === 0
                          ? "activeCategory"
                          : ""
                    }`}
                  >
                    {category?.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-12">
            <SearchProducts />
            <HeaderIcons />
          </div>
        </div>
        {activeCategory?.open && (
          <div
            onMouseLeave={() => {
              setActiveCategory({
                id: null,
                name: null,
                slug: null,
                data: [],
                image: null,
                open: false,
              });
            }}
            className={`absolute right-0 top-[110px] z-[999999] w-full bg-gray max-lg:hidden`}
          >
            <div className="relative h-full min-h-[300px] px-20 py-6">
              <div className="flex h-full items-start justify-between">
                <div className="flex gap-x-[10rem]">
                  <div className={`flex flex-col items-start justify-start`}>
                    {landingPagesList?.items?.map((item, index) => {
                      return (
                        <Link
                          key={index}
                          onClick={resetActiveCategory}
                          href={`/promo/${item?.slug}`}
                          className="mb-1 block text-lg font-medium uppercase text-red-500 transition-all duration-300 hover:translate-x-5 hover:text-slate-500"
                        >
                          {item?.name}
                        </Link>
                      );
                    })}
                    {activeCategory?.data?.map((category, index) => {
                      return category?.children?.length > 0 ? (
                        <button
                          key={index}
                          className={`${
                            category?.id === activeSubCategory?.id ||
                            pathname.includes(category?.slug)
                              ? "font-bold !text-primary"
                              : "font-normal"
                          } flex items-center gap-2 text-lg text-black hover:underline`}
                          onClick={() => router.push(`${category.slug_path}`)}
                          onMouseEnter={() => {
                            setActiveSubCategory({
                              id:
                                category?.id === activeSubCategory?.id
                                  ? null
                                  : category?.id,
                              name:
                                category?.name === activeSubCategory?.name
                                  ? null
                                  : category?.name,
                              slug_path:
                                category?.link?.link_path ===
                                activeSubCategory?.link?.link_path
                                  ? null
                                  : category?.link?.link_path,
                              data:
                                category?.children === activeSubCategory?.data
                                  ? []
                                  : category?.children,
                              open: !activeSubCategory?.open,
                              image: category?.image ?? null,
                            });
                          }}
                        >
                          {category?.icon && (
                            <Image
                              src={category?.icon}
                              alt={category?.name}
                              width={32}
                              height={32}
                            />
                          )}
                          {category?.name}
                        </button>
                      ) : (
                        <Link
                          href={`/${category?.link?.link_path}`}
                          key={index}
                          className={`${
                            category?.id === activeCategory?.id
                              ? "activeCategory"
                              : "font-normal"
                          } flex items-center gap-2 text-lg text-black hover:underline`}
                          onClick={() => {
                            setActiveCategory({
                              id: null,
                              name: null,
                              slug: null,
                              data: [],
                              image: null,
                              open: false,
                            });
                          }}
                        >
                          {category?.icon && (
                            <Image
                              src={category?.icon}
                              alt={category?.name}
                              width={32}
                              height={32}
                            />
                          )}
                          {category?.name}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="h-full">
                    <h3 className="mb-4 text-[15px] font-bold uppercase text-black">
                      {activeSubCategory?.name}
                    </h3>
                    <div className="mt-3 flex h-full max-h-[180px] flex-col flex-wrap gap-x-[3.3rem] gap-y-[0.1rem]">
                      {activeSubCategory &&
                        activeSubCategory?.data?.map((childCategory) => (
                          <Link
                            href={`/${childCategory?.link?.link_path}`}
                            onClick={resetActiveCategory}
                            key={childCategory?.id}
                            className={`block text-[15px] text-black hover:underline ${
                              pathname?.includes(childCategory?.link?.link_path)
                                ? "font-bold !text-primary"
                                : "font-normal"
                            }`}
                          >
                            {childCategory.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
                <div className={`ml-auto`}>
                  <div className="relative aspect-[16/9] h-[200px]">
                    {(activeCategory?.image || activeSubCategory?.image) && (
                      <Image
                        src={
                          activeSubCategory?.image
                            ? activeSubCategory?.image
                            : activeCategory?.image
                        }
                        alt="img-modal"
                        fill
                        sizes="100vw"
                        priority
                        className="h-[200px] w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

"use client";
import { useState, forwardRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import ProductPrice from "@/components/ProductPrice/ProductPrice";
import { getColorByColorName } from "@/helpers/getColorByColorName";
import { truncateText } from "@/helpers/truncateText";
import noImage from "../../public/images/placeholder.webp";
import { useQuery } from "@tanstack/react-query";
import { get as GET } from "@/api/api";
import Link from "next/link";
import { pushToDataLayer } from "@/_services/data-layer";

export const ThumbByViewport = forwardRef(({ id, apiLink }, ref) => {
  const { data: product } = useQuery({
    queryKey: ["productThumbByViewport", id],
    queryFn: async () => {
      return await GET(apiLink).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  const [swiper, setSwiper] = useState(null);

  const variantOptionColor = product?.variant_options?.find((variant) => {
    return (
      variant?.attribute?.name === "boja" ||
      variant?.attribute?.name === "Boja" ||
      variant?.attribute?.name === "color" ||
      variant?.attribute?.name === "Color"
    );
  });

  const [selected, setSelected] = useState(
    variantOptionColor
      ? [
          {
            attribute_key: variantOptionColor.attribute.key,
            value_key: variantOptionColor.values[0].key,
          },
        ]
      : [],
  );

  const imageList = variantOptionColor?.values
    ? variantOptionColor?.values
    : product?.image.slice(0, 3).length > 0
      ? product.image.slice(0, 3)
      : [{ product_image: noImage }];

  let link = `${product?.slug_path}`;

  selected.length > 0 &&
    product?.variant_options?.forEach((option) => {
      if (option.attribute.key === selected[0].attribute_key) {
        const currentColor = option.values.find(
          (value) => value.key === selected[0].value_key,
        );
        if (currentColor) link += `-${currentColor.slug}`;
      } else {
        link += `-${option.values[0].slug}`;
      }
    });

  const discount_number = Math.abs(
    product?.price?.min?.price?.original - product?.price?.min?.price?.discount,
  );
  const discount_percent = Math.ceil(
    (discount_number / product?.price?.min?.price?.original) * 100,
  );

  return (
    <div
      key={id}
      className="item hoveredColor thumbComponent relative col-span-1"
    >
      <div className={`item relative aspect-[7/9] w-full`}>
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={true}
          rewind
          initialSlide={product?.image?.findIndex(
            (item) => item === product?.image[0],
          )}
          breakpoints={{
            320: {
              navigation: {
                enabled: false,
              },
            },
            1024: {
              navigation: {
                enabled: true,
              },
              pagination: {
                enabled: false,
              },
            },
          }}
          className={`categoryImageSwiper relative h-full w-full`}
          onSwiper={(swiperInstance) => {
            setSwiper(swiperInstance);
          }}
        >
          {imageList?.map((item, index) => {
            let url;
            if (item) {
              if (
                item.product_image &&
                typeof item.product_image === "string"
              ) {
                url = item.product_image;
              } else if (typeof item === "string") {
                url = item;
              }
            }

            return (
              <SwiperSlide key={`${id}-${index}`}>
                <Link
                  href={link}
                  className="cursor-pointer"
                  onClick={() => {
                    pushToDataLayer("view_item", product);
                  }}
                >
                  <Image
                    ref={ref}
                    src={url ? convertHttpToHttps(url) : noImage}
                    alt={product?.basic_data?.name}
                    sizes={
                      "(max-width: 639px) 100vw, (max-width: 767px) 100vw, (max-width: 1023px) 100vw, (max-width: 1279px) 100vw, (min-width: 1600px) 50vw"
                    }
                    fill
                    className={`h-full w-full object-cover transition-all duration-500 ease-in-out hover:scale-110`}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          id="thumb-onhover-actions"
          className="align-center chevrons absolute z-10 flex w-full justify-center bg-white"
          style={{
            width: "calc(100% - 12px)",
            margin: "0 6px",
            bottom: "6px",
            padding: "0",
          }}
        >
          <div
            className="group mx-3 my-1 cursor-pointer rounded-full p-2 hover:bg-primary"
            title="Kupi"
          >
            <Link href={link}>
              <Image
                src={"/icons/shopping-bag.png"}
                className="group-hover:invert"
                alt="buy"
                width={23}
                height={23}
              />
            </Link>
          </div>
        </div>
        {product?.price?.discount?.active ? (
          <div className="absolute right-5 top-5 z-[1] font-light text-whiteSmoke">
            <div className="bg-primary px-4 py-0.5 text-base 2xl:text-lg">
              -
              {(
                ((product?.price?.price?.original -
                  product?.price?.price?.discount) /
                  product?.price?.price?.original) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
        ) : product?.price?.min?.price?.original &&
          product.price?.min?.price?.discount ? (
          <div className="absolute right-5 top-5 z-[1] font-light text-whiteSmoke">
            <div className="bg-primary px-4 py-0.5 text-base 2xl:text-lg">
              -{discount_percent}%
            </div>
          </div>
        ) : null}
        {product?.stickers?.length > 0 && (
          <div
            className={`absolute left-5 top-5 z-[1] flex flex-col gap-2 text-center text-lg text-whiteSmoke`}
          >
            {product?.stickers?.map((sticker, index) => {
              return (
                <div
                  className={`bg-primary px-2 py-0.5 text-base font-light 2xl:px-4 2xl:text-lg`}
                  key={index}
                >
                  {sticker?.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="z-[50] mt-2 flex flex-col items-start gap-1.5">
        <div className="relative flex items-center justify-start">
          <Link
            href={link}
            className="relative cursor-pointer max-sm:line-clamp-1"
          >
            <h3
              className="text-left text-xl font-light"
              title={
                product?.basic_data?.name.length > 63
                  ? product?.basic_data?.name
                  : ""
              }
            >
              {truncateText(product?.basic_data?.name)}
            </h3>
          </Link>
        </div>
        {variantOptionColor?.values && (
          <div className="flex items-center justify-start gap-[0.5rem]">
            {variantOptionColor?.values?.map((item3, index) => {
              const variantAttributeKey = variantOptionColor?.attribute?.key;
              const isSelected = selected.find(
                (item) =>
                  item?.attribute_key === variantAttributeKey &&
                  item?.value_key === item3?.key,
              );
              const colorBySlug = getColorByColorName(item3?.slug);

              if (index > 2) {
                if (index === 3) {
                  return (
                    <div key="more-colors" className="text-sm">
                      + još boja
                    </div>
                  );
                }
                return null;
              }

              return (
                <div
                  key={item3?.key}
                  className={`${
                    !isSelected ? "hover:opacity-40" : ""
                  } relative flex h-[18px] w-[18px] min-w-[18px] cursor-pointer items-center justify-center rounded-full text-center text-xs transition-all duration-500`}
                  style={{
                    backgroundColor: item3?.image ? "" : colorBySlug,
                    border:
                      item3.name === "Bela" || item3.name === "BELA"
                        ? "1px solid black"
                        : "transparent",
                  }}
                  onClick={() => {
                    setSelected((prevSelected) => {
                      // Remove previous selections with the same variantAttributeKey
                      const filteredSelections = prevSelected.filter(
                        (selection) =>
                          selection.attribute_key !== variantAttributeKey,
                      );
                      return [
                        ...filteredSelections,
                        {
                          attribute_key: variantAttributeKey,
                          value_key: item3?.key,
                        },
                      ];
                    });

                    const imageIndex = variantOptionColor?.values.findIndex(
                      (value) => value?.product_image === item3?.product_image,
                    );

                    if (imageIndex !== -1 && swiper) {
                      swiper.slideTo(imageIndex);
                    }
                  }}
                >
                  {isSelected && (
                    <div
                      className={`absolute h-[16px] w-[16px] rounded-full border-2 bg-transparent ${
                        item3.name === "Bela" || item3.name === "BELA"
                          ? "border-black/20"
                          : "border-white"
                      } `}
                    ></div>
                  )}

                  {item3?.image && (
                    <Image
                      src={item3?.image}
                      alt="Boja"
                      className="rounded-full"
                      sizes="18px"
                      width={18}
                      height={18}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        <ProductPrice
          price={product?.price}
          inventory={product?.inventory}
          is_details={false}
        />
      </div>
    </div>
  );
});

ThumbByViewport.displayName = "ThumbByViewport";

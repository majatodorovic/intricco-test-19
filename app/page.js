import { get, list } from "@/api/api";
import { headers } from "next/headers";
import { generateOrganizationSchema } from "@/_functions";
import BannerWithProducts from "@/components/sections/homepage/BannerWithProducts/BannerWithProducts";
import BestSellerProducts from "@/components/sections/homepage/BestSellerProducts/BestSellerProducts";
import PromoBanner from "@/components/sections/homepage/PromoBanner/PromoBanner";
import SlimBanner from "@/components/sections/homepage/SlimBanner/SlimBanner";
import RecommendedCategories from "@/components/sections/homepage/RecommendedCategories/RecommendedCategories";
import Slider from "@/components/sections/homepage/Slider/Slider";
import Retails from "@/components/sections/homepage/Retails/Retails";

const getSliders = () => {
  return get("/banners/index_slider").then((res) => res?.payload);
};
const getMobileSliders = () => {
  return get("/banners/index_slider_mobile").then((res) => res?.payload);
};
const getSlimBanners = () => {
  return get("/banners/banner_1").then((res) => res?.payload);
};
const getMobileSlimBanners = () => {
  return get("/banners/banner_1_mobile").then((res) => res?.payload);
};
const getBannerBeforeProducts = () => {
  return get("/banners/banner_2").then((res) => res?.payload);
};
const getMobileBannerBeforeProducts = () => {
  return get("/banners/banner_2_mobile").then((res) => res?.payload);
};
const getPromoBanners = () => {
  return get("/banners/promo_page_banner").then((res) => res?.payload);
};

const getMobilePromoBanners = () => {
  return get("/banners/promo_page_banner_mobile").then((res) => res?.payload);
};
const getRecommendedProducts = () => {
  return list("/products/section/list/recommendation?limit=4").then(
    (res) => res?.payload?.items,
  );
};
const getBestSellProducts = () => {
  return list("/products/section/list/best_sell").then(
    (res) => res?.payload?.items,
  );
};
const getRecomendedCategories = () => {
  return list("/categories/section/recommended?limit=3").then(
    (res) => res?.payload,
  );
};

const Home = async () => {
  const sliders = await getSliders();
  const mobileSliders = await getMobileSliders();
  const slimBanners = await getSlimBanners();
  const mobileSlimBanners = await getMobileSlimBanners();
  const bannerBeforeProducts = await getBannerBeforeProducts();
  const mobileBannerBeforeProducts = await getMobileBannerBeforeProducts();
  const recommendedCategories = await getRecomendedCategories();
  const recommendedProducts = await getRecommendedProducts();
  const bestSellProducts = await getBestSellProducts();
  const promoBanners = await getPromoBanners();
  const mobilePromoBanners = await getMobilePromoBanners();

  let all_headers = headers();
  let base_url = all_headers.get("x-base_url");

  let schema = generateOrganizationSchema(base_url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="relative block overflow-hidden">
        <div className="relative block" id="slider">
          <Slider banners={sliders} mobileBanners={mobileSliders} />
        </div>
        <RecommendedCategories categories={recommendedCategories} />
        <SlimBanner banners={slimBanners} mobileBanners={mobileSlimBanners} />
        <BannerWithProducts
          banners={bannerBeforeProducts}
          mobileBanners={mobileBannerBeforeProducts}
          products={recommendedProducts}
        />
        <PromoBanner
          banners={promoBanners}
          mobileBanners={mobilePromoBanners}
        />
        {bestSellProducts?.length > 0 && (
          <BestSellerProducts products={bestSellProducts} />
        )}
        <Retails />
      </div>
    </>
  );
};

export default Home;

export const revalidate = 30;

const getSEO = () => {
  return get("/homepage/seo").then((response) => response?.payload);
};

export const generateMetadata = async () => {
  const data = await getSEO();
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: data?.meta_title ?? "Početna | Intricco Underwear",
    description:
      data?.meta_description ?? "Dobrodošli na Intricco Underwear Online Shop",
    alternates: {
      canonical: data?.meta_canonical_link ?? canonical,
    },
    robots: {
      index: data?.meta_robots?.index ?? true,
      follow: data?.meta_robots?.follow ?? true,
    },
    openGraph: {
      title: data?.social?.share_title ?? "Početna | Intricco Underwear",
      description:
        data?.social?.share_description ??
        "Dobrodošli na Intricco Underwear Online Shop",
      type: "website",
      images: [
        {
          url: data?.social?.share_image ?? "",
          width: 800,
          height: 600,
          alt: "Intricco Underwear",
        },
      ],
      locale: "sr_RS",
    },
  };
};

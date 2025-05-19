import RenderBannerWithProducts from "./RenderBannerWithProducts";

const BannerWithProducts = ({ banners, mobileBanners, products }) => {
  return (
    <div className="mx-auto mt-8 max-md:w-[95%] md:w-full md:px-[60px] lg:mt-12 lg:px-[100px]"
    data-aos="fade-up"
    >
      <div className={`max-md:hidden`}>
        {banners && (
          <RenderBannerWithProducts
            banners={banners}
            products={products}
            bannersMobile={mobileBanners}
          />
        )}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && (
          <RenderBannerWithProducts
            banners={banners}
            bannersMobile={mobileBanners}
            products={products}
          />
        )}
      </div>
    </div>
  );
};

export default BannerWithProducts;

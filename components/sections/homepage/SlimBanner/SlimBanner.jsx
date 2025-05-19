import RenderSlimBanner from "./RenderSlimBanner";

const SlimBanner = ({ banners, mobileBanners }) => {
  return (
    <div className="sectionWidth mt-8 lg:mt-12"
    data-aos="fade-up"
    >
      <div className={`max-md:hidden`}>
        {banners && <RenderSlimBanner banners={banners} />}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && <RenderSlimBanner banners={mobileBanners} />}
      </div>
    </div>
  );
};

export default SlimBanner;

import RenderPromoBanner from "./RenderPromoBanner";

const PromoBanner = ({ banners, mobileBanners }) => {
  return (
    <div className="sectionWidth mt-8 lg:mt-12 "
    data-aos="fade-up"
    >
      <div className={`max-md:hidden`}>
        {banners && <RenderPromoBanner banners={banners} />}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && <RenderPromoBanner banners={mobileBanners} />}
      </div>
    </div>
  );
};

export default PromoBanner;

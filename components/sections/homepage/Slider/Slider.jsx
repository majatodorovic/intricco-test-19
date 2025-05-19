import RenderSlider from "./RenderSlider";

const Slider = ({ banners, mobileBanners }) => {
  return (
    <div className="line2 sectionWidth mt-8 max-xl:mt-1" data-aos="fade-up">
      <div className={`max-md:hidden`}>
        {banners && <RenderSlider banners={banners} />}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && <RenderSlider banners={mobileBanners} />}
      </div>
    </div>
  );
};

export default Slider;

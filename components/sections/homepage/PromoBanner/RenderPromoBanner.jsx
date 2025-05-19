import Image from "next/image";
import Link from "next/link";

const RenderPromoBanner = ({ banners }) => {
  const sortedBanners = [...banners].sort((a, b) => b.id - a.id).slice(0, 1);

  return (
    <>
      {sortedBanners.length > 0 && (
        <div className="relative flex">
          {sortedBanners.map((banner, index) => {
            return (
              <Link href={banner.url ?? "/"} key={index} className="w-full">
                <Image
                  src={banner.image}
                  alt={`banner-${index}`}
                  width={0}
                  height={0}
                  className="h-auto w-full"
                />
                <div className="absolute left-5 top-1/2 z-[50] flex -translate-y-1/2 flex-col items-start gap-4 text-white md:left-[60px] md:gap-8 xl:left-[120px] xl:gap-10">
                  {banner?.title && (
                    <h1
                      className="text-left text-3xl font-light uppercase text-black xl:text-4xl 2xl:text-6xl"
                      dangerouslySetInnerHTML={{ __html: banner?.title }}
                    />
                  )}
                  {banner?.subtitle && (
                    <h2
                      className="text-left text-xl font-light uppercase text-black lg:text-2xl"
                      dangerouslySetInnerHTML={{ __html: banner?.subtitle }}
                    />
                  )}
                  {banner?.text && (
                    <p
                      className="text-left text-base font-light uppercase text-black md:max-w-[400px] lg:text-lg 2xl:text-xl"
                      dangerouslySetInnerHTML={{ __html: banner?.text }}
                    ></p>
                  )}
                  {banner?.button && (
                    <button className="flex items-center justify-center border border-white bg-white px-12 py-3 text-xl font-bold uppercase text-black transition-all duration-300 hover:bg-primary hover:text-white max-2xl:text-base max-lg:px-4 max-lg:py-2 max-lg:text-sm">
                      {banner?.button}
                    </button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default RenderPromoBanner;

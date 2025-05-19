import Image from "next/image";
import Link from "next/link";
import { ThumbForHome } from "@/components/Thumb/ThumbForHome";

const RenderBannerWithProducts = ({ banners, products, bannersMobile }) => {
  const sortedBanners = [...banners]?.sort((a, b) => b.id - a.id).slice(0, 1);
  const sortedBannersMobile = [...bannersMobile]
    ?.sort((a, b) => b.id - a.id)
    .slice(0, 1);

  return (
    <div className="flex gap-3 max-xl:flex-col">
      {sortedBanners.length > 0 && (
        <div className="relative flex aspect-[4/5] w-1/2 max-xl:hidden">
          {sortedBanners.map((banner, index) => {
            return (
              <Link
                href={banner.url ?? "/"}
                key={index}
                className="h-full w-full"
              >
                <Image
                  src={banner.image}
                  alt={`banner-${index}`}
                  width={0}
                  height={0}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-6 left-8 z-[50] flex flex-col items-start gap-1 text-black">
                  {banner?.title && (
                    <div className="font-light lg:text-3xl 2xl:text-4xl">
                      {banner?.title}
                    </div>
                  )}
                  {banner?.subtitle && (
                    <div className="text-2xl font-light">{banner?.title}</div>
                  )}
                  {banner?.text && (
                    <div className="text-xl font-light">{banner.text}</div>
                  )}
                  {banner?.button && (
                    <button className="mt-8 flex items-center justify-center border border-white bg-white px-8 py-3 text-xl font-bold uppercase text-black transition-all duration-300 hover:bg-primary hover:text-white max-2xl:text-base max-lg:px-4 max-lg:py-2 max-lg:text-sm">
                      {banner?.button}
                    </button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {sortedBannersMobile.length > 0 && (
        <div className="relative flex w-full xl:hidden">
          {sortedBannersMobile.map((banner, index) => {
            return (
              <Link href={banner.url ?? "/"} key={index} className="w-full">
                <Image
                  src={banner.image}
                  alt={`banner-${index}`}
                  width={0}
                  height={0}
                  className="h-auto w-full"
                />
                <div className="absolute bottom-5 left-5 z-[50] flex flex-col items-start gap-1 text-black">
                  {banner?.title && (
                    <h1
                      className="text-center text-3xl font-light text-black xl:text-4xl 2xl:text-6xl"
                      dangerouslySetInnerHTML={{ __html: banner?.title }}
                    />
                  )}
                  {banner?.subtitle && (
                    <h2
                      className="text-center text-xl font-light text-black lg:text-2xl"
                      dangerouslySetInnerHTML={{ __html: banner?.subtitle }}
                    />
                  )}
                  {banner?.text && (
                    <p
                      className="text-center text-base font-light text-black md:max-w-[400px] lg:text-lg 2xl:text-xl"
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
      <div className="grid !aspect-[4/5] w-1/2 grid-cols-2 gap-3 max-xl:w-full max-sm:grid-cols-1">
        {products.map((product, index) => {
          return <ThumbForHome key={index} id={product.id} slug={product.id} />;
        })}
      </div>
    </div>
  );
};

export default RenderBannerWithProducts;

import Image from "next/image";
import Link from "next/link";

const RenderSlimBanner = ({ banners }) => {
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
                <div className="absolute left-1/2 top-1/2 z-[50] flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 p-5 text-white">
                  {banner?.title && (
                    <div className="text-center text-2xl uppercase lg:text-3xl 2xl:text-4xl">
                      {banner.title}
                    </div>
                  )}
                  {banner?.text && (
                    <div className="text-center text-base lg:text-lg 2xl:text-xl">
                      {banner.text}
                    </div>
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

export default RenderSlimBanner;

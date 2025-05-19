import Link from "next/link";
import Image from "next/image";

const PageInConstruction = () => {
  return (
    <>
      <div className="constructionHolder mt-[0rem] flex flex-col items-center lg:mt-[9rem]">
        <div className="positionImage relative z-[49] col-span-1 h-[300px] w-[300px] rounded-lg">
          <Image
            src={`/icons/under-construction.png`}
            alt="Croonus"
            height={150}
            width={150}
            style={{ objectFit: "contain" }}
            className="object-scale-down max-sm:w-[100%]"
          />
        </div>
        <div className="constructionText flex h-full w-full flex-col items-center justify-center rounded-lg bg-opacity-50 text-center">
          <p className="font-medium">
            Izvinite, stranica je trenutno u izradi.
          </p>
          <Link
            href="/"
            className="mt-10 bg-[#2bc48a] px-10 py-4 font-medium text-white hover:bg-opacity-80"
          >
            Idite na početnu
          </Link>
        </div>
      </div>
    </>
  );
};

export default PageInConstruction;

export const metadata = {
  title: "Stranica u izradi | Intricco Underwear",
  description: "Stranica u izradi | Intricco Underwear",
};

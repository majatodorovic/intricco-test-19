"use client";
import Image from "next/image";
import Link from "next/link";
export const metadata = () => {
  return {
    title: "404 - croonus.com - Farmerke, Muške farmerke, Muška odeća",
    description: "Dobrodošli na croonus.com Online Shop",
    keywords: [
      "Croonus",
      "online",
      "shop",
      "croonus.com",
      "farmerke",
      "trenerke",
      "dukserice",
      "Croonus obuca",
      "obuca",
      "Croonus online",
    ],
  };
};
const notFound = () => {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center max-md:mt-[13rem] max-md:w-[95%] lg:mt-[13rem]">
      <div className="flex flex-col items-center justify-center gap-5 border border-gray p-10 text-center shadow">
        <Image src={"/icons/404.png"} alt="404" width={100} height={100} />
        <h1 className="text-[18px] font-bold">
          Stranica koju tražite ne postoji ili je premeštena.
        </h1>
        <h2 className="mt-3 text-[15px] font-normal">
          Proverite da li ste uneli ispravan URL.
        </h2>
        <Link href="/">
          <button className="primaryButton mt-5 px-10 py-4">
            Vrati se na početnu stranu
          </button>
        </Link>
      </div>
    </div>
  );
};

export default notFound;

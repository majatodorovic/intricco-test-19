import Link from "next/link";
import { headers } from "next/headers";
import { LokacijePage } from "@/components/LokacijePage/LokacijePage";

const Lokacije = () => {
  return (
    <>
      <div className={`sectionWidth mt-5 text-left`}>
        <div className={`flex items-center gap-2`}>
          <Link className={`text-[0.95rem]`} href={`/`}>
            Intricco Underwear
          </Link>
          <span className={`text-[0.95rem]`}>/</span>
          <span className={`text-[0.95rem] font-bold text-primary`}>
            Lokacije
          </span>
        </div>
        <h1
          className={`mt-5 w-full border-b pb-2 text-[23px] font-normal md:text-[29px]`}
        >
          Lokacije
        </h1>
      </div>
      <LokacijePage />
    </>
  );
};

export default Lokacije;

export const generateMetadata = async () => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Lokacije | Intricco Underwear`,
    description: "Dobrodošli na Intricco Underwear Online Shop",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Lokacije | Intricco Underwear`,
      description: "Dobrodošli na Intricco Underwear Online Shop",
      type: "website",
      locale: "sr_RS",
    },
  };
};

import SearchPage from "@/components/SearchPage/SearchPage";
import { Suspense } from "react";
import { headers } from "next/headers";

const Search = () => {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
};

export default Search;

export const generateMetadata = async ({ searchParams: { search } }) => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Pretraga: ${search} | Intricco Underwear`,
    description: "Dobrodošli na Intricco Underwear Online Shop",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Pretraga: ${search} | Intricco Underwear`,
      description: "Dobrodošli na Intricco Underwear Online Shop",
      type: "website",
      locale: "sr_RS",
    },
  };
};

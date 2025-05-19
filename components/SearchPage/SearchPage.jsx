"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Thumb } from "../Thumb/Thumb";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/hooks/ecommerce.hooks";

const SearchPage = () => {
  const params = useSearchParams();

  const search = params.get("search");

  const { data: returnedProducts, isFetching: loading } = useSearch({
    searchTerm: search,
    isSearchPage: true,
  });

  return (
    <>
      {returnedProducts?.length > 0 && !loading ? (
        <div className="sectionWidth mt-5 grid grid-cols-2 gap-x-5 gap-y-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className={`flex items-center gap-2`}>
            <Link className={`text-[0.95rem]`} href={`/`}>
              Intricco Underwear
            </Link>
            <span className={`text-[0.95rem]`}>/</span>
            <span className={`text-[0.95rem] font-bold text-primary`}>
              Pretraga
            </span>
          </div>
          <h1 className="col-span-2 mb-5 border-b pb-2 text-[23px] font-normal md:col-span-2 md:text-[29px] lg:col-span-3 xl:col-span-4">
            Rezultati pretrage za termin &quot;{search}&quot;
          </h1>
          {returnedProducts.map((product, index) => (
            <Suspense
              key={index}
              fallback={
                <div
                  className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                />
              }
            >
              <Thumb slug={product?.id} key={product?.id} />
            </Suspense>
          ))}
        </div>
      ) : (
        !loading && (
          <>
            <div className="mx-auto mt-[1.2rem] flex items-center justify-center py-10 text-center max-md:w-[95%] lg:mt-[13rem]">
              <div className="flex flex-col items-center gap-4 border border-gray p-6 shadow">
                <div>
                  <Image
                    src={"/icons/no-results.png"}
                    alt="404"
                    width={130}
                    height={130}
                  />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Vaša pretraga nije dala nikakve rezultate.
                  </p>
                  <p className="text-sm">
                    Trenutno ne postoji rezultat za Vašu pretragu &quot;{search}
                    &quot;.
                  </p>
                  <p className="mt-4 text-lg font-medium">Pomoć u pretrazi:</p>
                  <ul className="text-sm">
                    <li className="mt-2">• Proverite greške u kucanju.</li>
                    <li className="mt-2">
                      • Koristite više generčkih termina za pretragu.
                    </li>
                    <li className="mt-2">
                      • Proizvod ili kategorija koju tražite možda nisu još uvek
                      dostupni na našoj online prodavnici.
                    </li>
                    <li className="mt-2">
                      • Ukoliko Vam je potrebna pomoć, u svakom trenutku nas
                      možete kontaktirati pozivom na broj call centra
                    </li>
                  </ul>
                </div>
                <div>
                  <Link href="/">
                    <button className="primaryButton mt-10 px-10 py-4">
                      Vrati se na početnu stranu
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default SearchPage;

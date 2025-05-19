"use client";
import { Thumb } from "@/components/Thumb/Thumb";
import Link from "next/link";
import { useNewProductsSuspense } from "@/hooks/ecommerce.hooks";
import { Suspense } from "react";

const NewProductsPage = () => {
  const { data: newProducts } = useNewProductsSuspense(true);

  return (
    <div className={`sectionWidth mt-5`}>
      <div className={`flex items-center gap-2`}>
        <Link className={`text-[0.95rem]`} href={`/`}>
          Intricco Underwear
        </Link>
        <span className={`text-[0.95rem]`}>/</span>
        <span className={`text-[0.95rem] font-bold text-primary`}>
          Novo u ponudi
        </span>
      </div>
      <h1
        className={`mt-5 w-full border-b pb-2 text-[23px] font-normal md:text-[29px]`}
      >
        Novo u ponudi
      </h1>
      {newProducts?.items?.length > 0 ? (
        <>
          <div className="mt-10 grid gap-[11px] gap-y-[40px] max-md:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            {newProducts?.items?.map(({ id }) => {
              return (
                <Suspense
                  key={id}
                  fallback={
                    <div
                      className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                    />
                  }
                >
                  <Thumb slug={id} />
                </Suspense>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mx-auto flex w-full flex-col items-center justify-center max-md:mt-[13rem] max-md:w-[95%] lg:mt-[13rem]">
          <div className="flex flex-col items-center justify-center gap-5 border border-gray p-10 text-center shadow">
            <h1 className="text-[18px] font-bold">
              Trenutno nema novih proizvoda.
            </h1>
            <h2 className="mt-3 text-[15px] font-normal">Proverite kasnije.</h2>
            <Link href="/">
              <button className="primaryButton mt-5 px-10 py-4">
                Vrati se na početnu stranu
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductsPage;

import { Suspense } from "react";
import NewProductsPage from "@/components/NewProductsPage/NewProductsPage";

const Novo = () => {
  return (
    <Suspense
      fallback={
        <div className="grid gap-[11px] gap-y-[40px] max-md:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="col-span-1 aspect-2/3 w-full animate-pulse bg-slate-300 object-cover"
                />
              );
            })}
          </>
        </div>
      }
    >
      <NewProductsPage />
    </Suspense>
  );
};

export default Novo;

export const metadata = {
  title: "Novo | Intricco Underwear",
  description: "Dobrodošli na Intricco Underwear Online Shop",
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

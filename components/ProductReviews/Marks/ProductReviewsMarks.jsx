"use client";
import AddProductReviewMarksForm from "./Form/AddProductReviewMarksForm";
import DisplayReviewMarks from "./DisplayReviewMarks";
import { get } from "@/api/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useIsLoggedIn } from "@/hooks/ecommerce.hooks";
import Link from "next/link";

const ProductReviewsMarks = ({ id_product }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["reviewsMarksOptions"],
    queryFn: async () => {
      const response = await get(
        `product-details/reviews/marks/options/product_review_marks`
      );
      const data = response?.payload;
      if (data) {
        const field = data.fields.fields.find((field) => field.key === "mark");
        if (field) {
          const rules = field.fields_rule.split("|");
          const minRule = rules.find((rule) => rule.startsWith("min:"));
          const maxRule = rules.find((rule) => rule.startsWith("max:"));

          const min = minRule ? parseInt(minRule.split(":")[1], 10) : 1;
          const max = maxRule ? parseInt(maxRule.split(":")[1], 10) : 1;

          const options = Array.from(
            { length: max - min + 1 },
            (_, i) => i + min
          );

          return { ...data, options };
        } else {
          return {
            options: [1, 2, 3, 4],
          };
        }
      }
    },
    keepPreviousData: true,
  });
  const { data: loggedIn } = useIsLoggedIn();

  if (data && data.active !== "1") return <></>;

  return (
    <>
      <DisplayReviewMarks id_product={id_product} marksOptions={data.options} />
      {data && data.guest_allowed !== "1" && !loggedIn ? (
        <div className="mt-[2rem] max-md:w-[95%] max-md:mx-auto mx-[3rem] flex flex-col justify-center items-center border border-gray-300 bg-slate-200">
          <h2 className="text-[1.5rem] text-center font-light max-md:text-[1.1rem] mt-4 mb-4">
            Ukoliko zelis da ostavis recenziju (Ocena), moras se ulogovati.
          </h2>
          <Link href="/login" className="text-center w-[140px] mb-3">
            Uloguj se
          </Link>
        </div>
      ) : (
        <AddProductReviewMarksForm
          id_product={id_product}
          marksOptions={data.options}
        />
      )}
    </>
  );
};

export default ProductReviewsMarks;

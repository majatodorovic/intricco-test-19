"use client";
import DisplayProductQuestions from "./DisplayProductQuestions";
import AddProductQuestionsForm from "./Form/AddProductQuestionsForm";
import { get } from "@/api/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useIsLoggedIn } from "@/hooks/ecommerce.hooks";
import Link from "next/link";

const ProductQuestions = ({ id_product }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["reviewsQuestionOptions"],
    queryFn: async () => {
      const response = await get(
        `product-details/reviews/questions-and-answers/options/product_review_questions_and_answers`
      );
      return response?.payload;
    },
  });
  const { data: loggedIn } = useIsLoggedIn();

  if (data && data.active !== "1") return <></>;

  return (
    <>
      <DisplayProductQuestions id_product={id_product} />
      {data && data.guest_allowed !== "1" && !loggedIn ? (
        <div className="mt-[2rem] max-md:w-[95%] max-md:mx-auto mx-[3rem] flex flex-col justify-center items-center border border-gray-300 bg-slate-300">
          <h2 className="text-[1.5rem] text-center font-light max-md:text-[1.1rem] mt-4 mb-4">
            Ukoliko zelis da ostavis recenziju (Q&A), moras se ulogovati.
          </h2>
          <Link href="/login" className="text-center w-[140px] mb-3">
            Uloguj se
          </Link>
        </div>
      ) : (
        <AddProductQuestionsForm id_product={id_product} />
      )}
    </>
  );
};

export default ProductQuestions;

"use client";
import { useRecommendedProducts } from "@/hooks/ecommerce.hooks";
import ProductSlider from "./ProductSlider";

const RecommendedProducts = ({ text = "Možda će Vas zanimati", id }) => {
  const { data: productDetails } = useRecommendedProducts({ id });

  return (
    <>
      {productDetails?.items?.length > 0 && (
        <ProductSlider text={text} productDetails={productDetails} />
      )}
    </>
  );
};

export default RecommendedProducts;

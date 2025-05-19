"use client";
import { useCrossSellProducts } from "@/hooks/ecommerce.hooks";
import ProductSlider from "./ProductSlider";

const CrosselProducts = ({ text = "Možda će Vam biti potrebno", id }) => {
  const { data: productDetails } = useCrossSellProducts({ id });

  return (
    <>
      {productDetails?.items?.length > 0 && (
        <ProductSlider text={text} productDetails={productDetails} />
      )}
    </>
  );
};

export default CrosselProducts;

"use client";
import { useRelatedProducts } from "@/hooks/ecommerce.hooks";
import ProductSlider from "./ProductSlider";

const RelatedProducts = ({ text = "Slični proizvodi", id }) => {
  const { data: productDetails } = useRelatedProducts({ id });
  return (
    <>
      {productDetails?.items?.length > 0 && (
        <ProductSlider text={text} productDetails={productDetails} />
      )}
    </>
  );
};

export default RelatedProducts;

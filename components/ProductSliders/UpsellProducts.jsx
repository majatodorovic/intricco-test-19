import { useUpSellProducts } from "@/hooks/ecommerce.hooks";
import ProductSlider from "./ProductSlider";

const UpsellProducts = ({ text = "Preporučujemo", id }) => {
  const { data: productDetails } = useUpSellProducts({ id });

  return (
    <>
      {productDetails?.items?.length > 0 && (
        <ProductSlider text={text} productDetails={productDetails} />
      )}
    </>
  );
};

export default UpsellProducts;

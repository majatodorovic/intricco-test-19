"use client";
import { Suspense, useEffect } from "react";
import { ProductInfo } from "@/components/ProductDetails/ProductInfo";
import Breadcrumbs from "@/components/ProductDetails/Breadcrumbs";
import UpsellProducts from "@/components/ProductSliders/UpsellProducts";
import CrosssellProducts from "@/components/ProductSliders/CrosssellProducts";
import RelatedProducts from "@/components/ProductSliders/RelatedProducts";
import RecommendedProducts from "@/components/ProductSliders/RecommendedProducts";
// import ProductReviewsMarks from "@/components/ProductReviews/Marks/ProductReviewsMarks";
// import ProductComments from "@/components/ProductReviews/Comments/ProductComments";
// import ProductQuestions from "@/components/ProductReviews/Questions/ProductQuestions";

const ProductContainer = ({
  digitalProduct,
  basic_data,
  product_gallery,
  path,
  category_id,
  id,
}) => {
  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <div className="sectionWidth mb-10 mt-6 max-md:mt-[1rem] lg:mb-[80px]">
        <Suspense
          fallback={<div className="h-2 w-full animate-pulse bg-slate-300" />}
        >
          <Breadcrumbs id={id} categoryId={category_id} />
        </Suspense>
      </div>

      <ProductInfo
        productGallery={product_gallery}
        path={path?.[path?.length - 1]}
        id={id}
        product={basic_data}
        digitalProduct={digitalProduct}
      />

      <UpsellProducts id={id} />
      <CrosssellProducts id={id} />
      <RecommendedProducts id={id} />
      <RelatedProducts id={id} />
    </>
  );
};

export default ProductContainer;

"use client";
// import DeliveryInfo from "@/components/ProductDetails/DeliveryInfo";
import SizeHelpInfo from "@/components/ProductDetails/SizeHelpInfo";
import { Suspense, useState } from "react";
import { useIsLoggedIn } from "@/hooks/ecommerce.hooks";
import Specifications from "@/components/ProductDetails/Specifications";
import DigitalProductInfo from "@/components/ProductDetails/DigitalProductInfo";
import AddToCart from "@/components/ProductDetails/AddToCart";
import ProductPrice from "@/components/ProductPrice/ProductPrice";
import Variants from "@/components/Variants/Variants";
import GuestPurchasingDisabled from "@/components/ProductDetails/GuestPurchasingDisabled";
import { getDataFromCurrentProduct } from "@/components/ProductDetails/helpers/productInfo";
import { ProductGallery } from "@/components/ProductDetails/ProductGallery";
import { currencyFormat } from "@/helpers/functions";
import { formatDate } from "@/helpers/convertDate";

export const ProductInfo = ({
  id,
  path,
  product,
  digitalProduct,
  productGallery,
}) => {
  const { data: loggedIn } = useIsLoggedIn();
  const itemBasicData = product?.data?.item?.basic_data;
  const selected_item = product?.data?.variant_items.find((item) =>
    item.slug_path.includes(path),
  );
  const [productVariant, setProductVariant] = useState(
    selected_item ? selected_item : product?.data?.variant_items[0],
  );
  const [tempError, setTempError] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);

  const { behaviours, inventory, selectedProduct, sku, digital_data, price } =
    getDataFromCurrentProduct({
      productVariant,
      product,
    });

  const discount_number = Math.abs(
    price?.price?.original - price?.price?.discount,
  );

  return (
    <div className="sectionWidth mt-[2rem] grid grid-cols-4 gap-x-[3.063rem] max-md:mt-[1.01rem] max-md:w-[95%]">
      <ProductGallery
        productGallery={productGallery}
        variantKeyArray={productVariant?.variant_key_array}
        id={id}
      />

      <div className="mt-[2rem] max-lg:col-span-4 lg:col-span-2">
        <div className="flex flex-col max-lg:mt-3">
          <Suspense fallback={<Loader />}>
            <h1 className="text-[1.563rem] font-bold max-md:text-[1.1rem]">
              {itemBasicData?.name}
            </h1>
            <h2 className="mb-5 mt-3 text-base font-normal text-primary">
              {selectedProduct && sku ? `Šifra proizvoda: ${sku}` : <>&nbsp;</>}
            </h2>

            <ProductPrice
              selectedProduct={selectedProduct}
              displayComponent={
                loggedIn ||
                behaviours?.customer_settings?.product_price?.display_to_guest
              }
              is_details
              price={price}
              inventory={inventory}
              className={
                price?.discount?.active
                  ? `py-0.5 text-[21px] font-bold`
                  : `py-0.5 text-[1.172rem] font-bold`
              }
            />

            {price.discount.active && (
              <>
                <div className="mt-1 flex w-full flex-col gap-6">
                  <p className="font-semibold text-primary">
                    Ušteda: &nbsp;{currencyFormat(discount_number)}
                  </p>
                  <p className="font-normal text-[#666]">
                    Akcijska cena važi od:{" "}
                    {formatDate(price?.discount?.campaigns[0]?.duration?.from)}{" "}
                    do{" "}
                    {formatDate(
                      price?.discount?.campaigns[0]?.duration?.to,
                    )}{" "}
                  </p>
                </div>
                <div className="mt-1 h-[2px] w-3/5 bg-primary max-xl:w-full"></div>
              </>
            )}
            {itemBasicData?.short_description && (
              <p className={`my-5 max-w-full text-sm md:max-w-[90%]`}>
                {itemBasicData?.short_description}
              </p>
            )}

            <Variants
              setTempError={setTempError}
              displayComponent={product?.product_type === "variant"}
              firstVariantOption={!productVariant}
              product={product}
              productVariant={productVariant}
              setProductVariant={setProductVariant}
              setQuantity={
                behaviours
                  ? () =>
                      setProductQuantity(
                        behaviours?.cart?.default_loop_quantity,
                      )
                  : false
              }
            />
          </Suspense>
        </div>

        <SizeHelpInfo disabled={digital_data?.is_digital} />

        <GuestPurchasingDisabled
          displayComponent={
            !loggedIn &&
            !behaviours?.customer_settings?.purchase?.allow_purchase_to_guest
          }
        />

        <AddToCart
          displayComponent={
            loggedIn ||
            behaviours?.customer_settings?.purchase?.allow_purchase_to_guest
          }
          productVariant={productVariant}
          productQuantity={productQuantity}
          product={product}
          tempError={tempError}
          setTempError={setTempError}
        />

        {/* <DeliveryInfo /> */}

        <DigitalProductInfo digital_product={digitalProduct} />

        <Specifications id={id} />
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <div className={`mt-5`}>
      <div className={`h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-10 h-2 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-10 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
    </div>
  );
};

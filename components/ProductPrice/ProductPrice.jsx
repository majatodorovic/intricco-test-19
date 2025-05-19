"use client";
import {
  checkIsInStock,
  checkPrices,
  getPriceStatus,
  renderDefaultPrices,
  renderDiscountPrices,
} from "@/components/ProductPrice/price";

const ProductPrice = ({
  price,
  inventory,
  is_details = false,
  displayComponent = true,
  selectedProduct,
}) => {
  if (!displayComponent) return <></>;
  let status = getPriceStatus(price);
  let is_in_stock = checkIsInStock(inventory);
  let prices = checkPrices(price);

  let data = {
    status: status,
    is_in_stock: is_in_stock,
    price_defined: prices?.price_defined,
    is_price_range: selectedProduct ? false : prices?.price_range,
    price: price,
    is_details: is_details,
  };

  if (!data.price_defined && selectedProduct) {
    return <p className={`!text-lg font-light`}>Cena na upit</p>;
  }

  switch (data?.status) {
    case "default":
      return renderDefaultPrices({ ...data });
    case "discount":
      return renderDiscountPrices({ ...data });
  }
};

export default ProductPrice;

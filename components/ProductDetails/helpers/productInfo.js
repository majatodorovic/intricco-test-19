export const getDataFromCurrentProduct = ({ productVariant, product }) => {
  let behaviours;
  let inventory;
  let selectedProduct = false;
  let sku;
  let barcode;
  let digital_data;
  let price;
  if (
    product?.data?.variant_items &&
    product?.data?.variant_items?.length > 0
  ) {
    if (Array.isArray(productVariant) && productVariant.length > 0) {
      return;
    } else if (productVariant && !Array.isArray(productVariant)) {
      selectedProduct = true;

      barcode = productVariant.basic_data.barcode;
      sku = productVariant.basic_data.sku;
      behaviours = productVariant?.behaviours;
      inventory = productVariant?.inventory;
      digital_data = productVariant?.digital_data;
      price = productVariant?.price;
    } else {
      behaviours = product?.data?.item?.behaviours;
      inventory = product?.data?.item?.inventory;
      sku = product?.data?.item?.basic_data?.sku;
      barcode = product?.data?.item?.basic_data?.barcode;
      digital_data = product?.data?.item?.digital_data;
      price = product?.data?.item?.price;
    }
  } else {
    selectedProduct = true;

    inventory = product?.data?.item?.inventory;
    behaviours = product?.data?.item?.behaviours;
    sku = product?.data?.item?.basic_data?.sku;
    barcode = product?.data?.item?.basic_data?.barcode;
    digital_data = product?.data?.item?.digital_data;
    price = product?.data?.item?.price;
  }

  return {
    behaviours,
    inventory,
    selectedProduct,
    sku,
    barcode,
    digital_data,
    price,
  };
};

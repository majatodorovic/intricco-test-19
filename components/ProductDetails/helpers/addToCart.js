import { checkIsInStock, checkPrices } from "@/components/ProductPrice/price";

export const checkIsAddableToCart = ({ price, inventory }) => {
  let addable_data = {};

  let is_in_stock = checkIsInStock(inventory);
  let { price_defined } = checkPrices(price);
  if (is_in_stock && price_defined) {
    addable_data.addable = true;
    addable_data.text = "DODAJ U KORPU";
  } else {
    addable_data.addable = false;
    addable_data.text = "POŠALJI UPIT";
  }

  return addable_data;
};

export const cartTextBySelectedVariant = ({ selectedOptions, product }) => {
  let text = "";
  if (selectedOptions && product?.product_type === "variant") {
    let options_length = product?.data?.variant_options?.length;
    let selected_options_length = selectedOptions?.length;

    if (options_length !== selected_options_length) {
      let not_selected_attributes = [];

      let selected_attributes = (selectedOptions ?? [])?.map(
        ({ attribute_key }) => attribute_key
      );

      (product?.data?.variant_options ?? [])?.forEach((option) => {
        if (!selected_attributes?.includes(option?.attribute?.key)) {
          not_selected_attributes.push(option?.attribute?.name);
        }
      });

      not_selected_attributes = (not_selected_attributes ?? [])?.map(
        (attribute) => {
          if (attribute?.[attribute?.length - 1] === "a") {
            return attribute?.slice(0, -1)?.toLowerCase() + "u";
          } else {
            return attribute;
          }
        }
      );

      switch (true) {
        case not_selected_attributes?.length === 1:
          text = `Odaberite ${not_selected_attributes?.[0]}`;
          text = "Odaberite varijantu";
          break;
        case not_selected_attributes?.length > 1:
          text = `Odaberite ${(not_selected_attributes ?? [])?.map((item) => {
            return item;
          })}`;
          text = "Odaberite varijantu";
      }
    }
  }
  return text;
};

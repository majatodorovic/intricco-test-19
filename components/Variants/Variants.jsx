"use client";
import { useState } from "react";
import OptionColor from "./OptionColor";
import OptionButton from "./OptionButton";

export default function Variants({
  productVariant,
  setTempError,
  product,
  setProductVariant,
  displayComponent,
  setQuantity,
}) {
  if (!displayComponent) return <></>;
  let variant_options = product?.data?.variant_options;
  let variant_items = product?.data?.variant_items;
  const [selected, setSelected] = useState(
    productVariant ? productVariant.variant_key_array : [],
  ); // niz selektovanih varianti

  /*
   *Iz selektovanih varianti stvara key. Proverava postoji li takav key u listi variant proizvoda
   * Ako postoji, izbacuje tu variantu tj taj proizvod
   **/
  const getCurrentProductFromPathname = (selectedItems) => {
    const currentItem = variant_items.find((item) => {
      const variant_key_array = item?.variant_key_array;

      if (variant_key_array?.length !== selectedItems?.length) {
        return false;
      }
      // Provera da li su svi elementi iz selectedItems prisutni u variant_key_array
      const allItemsMatch = selectedItems.every((selectedItem) =>
        variant_key_array.some(
          (variant) =>
            variant.attribute_key === selectedItem.attribute_key &&
            variant.value_key === selectedItem.value_key,
        ),
      );

      return allItemsMatch;
    });

    return currentItem;
  };

  // onChangeHandler funkcija za selektovanje variant nakon odabira vrednosti
  const onChangeHandler = (attribute_key, value_key) => {
    let temp_selected = [...selected];

    let temp_selected_item = {
      attribute_key: attribute_key,
      value_key: value_key,
    };

    let temp_index = temp_selected.findIndex(
      (x) => x.attribute_key == temp_selected_item.attribute_key,
    );

    if (temp_index > -1) {
      temp_selected[temp_index] = temp_selected_item;
    } else {
      temp_selected.push(temp_selected_item);
    }

    setSelected(temp_selected);
    if (setQuantity) setQuantity();

    const currentItem = getCurrentProductFromPathname(temp_selected);
    setProductVariant(currentItem ?? []);

    if (currentItem) {
      window?.history?.replaceState(null, null, `${currentItem.slug_path}`);
      setTempError(null);
    }
  };

  return (
    <div className="py-[2rem] max-md:py-[1.5rem]">
      <div className="flex flex-col gap-[25px] max-lg:w-full max-md:gap-7">
        {variant_options?.map((item, itemIndex) => {
          const currentSelectedData = selected.find(
            (select) => select?.attribute_key == item.attribute.key,
          );

          const currentValue = item.values.find(
            (val) => val.key == currentSelectedData?.value_key,
          );

          return (
            <div key={itemIndex} className="flex flex-col items-start gap-4">
              <label
                htmlFor={item.id}
                className="min-w-[5.619rem] text-[16px] font-normal max-lg:text-left"
              >
                {item.attribute.name} :
                {currentValue ? <span>&nbsp;{currentValue?.name}</span> : null}
              </label>
              <form
                key={item.id}
                id={item.id}
                name={item.attribute.key}
                className="flex flex-row flex-wrap gap-[1rem] max-md:px-0"
              >
                {item?.attribute?.name === "Boja"
                  ? item.values.map((value) => (
                      <OptionColor
                        key={value.id}
                        value={value}
                        item={item}
                        selected={selected}
                        onChangeHandler={onChangeHandler}
                      />
                    ))
                  : item.values.map((value) => (
                      <OptionButton
                        key={value.id}
                        value={value}
                        item={item}
                        selected={selected}
                        onChangeHandler={onChangeHandler}
                      />
                    ))}
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

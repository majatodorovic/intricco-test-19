"use client";

import Image from "next/image";
import {
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/hooks/ecommerce.hooks";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/helpers/functions";
import PlusMinusInput from "@/components/PlusMinusInput";
import Link from "next/link";

const CheckoutItems = ({
  behaviours,
  name,
  sku,
  price,
  image,
  slug_path,
  inventory,
  refreshCart,
  quantity,
  brand_name,
  id_product,
  refreshSummary,
  isClosed,
  cart_item_id,
  is_digital,
  displayQuantityField,
  variant_key_array,
  setIsClosed,
  setRemoveId,
  setSureCheck,
}) => {
  const { isSuccess: isRemoved } = useRemoveFromCart();
  const { mutate: updateCart, isSuccess: isUpdated } = useUpdateCartQuantity();

  const [productQuantity, setProductQuantity] = useState(Number(quantity));
  const boja = variant_key_array.find((attr) => attr.attribute.slug === "boja")
    ?.value.name;
  const velicina = variant_key_array.find(
    (attr) => attr.attribute.slug === "velicina",
  )?.value.name;

  useEffect(() => {
    if (Number(quantity) !== productQuantity) {
      updateCart({
        id: cart_item_id,
        quantity: productQuantity,
      });
    }
  }, [productQuantity]);

  useEffect(() => {
    setProductQuantity(Number(quantity));
  }, [quantity]);

  useEffect(() => {
    if (isUpdated || isRemoved) {
      refreshCart();
      refreshSummary();
    }
  }, [isRemoved, isUpdated]);

  return (
    <>
      <div
        className={`relative grid grid-cols-[110px_1fr] items-start justify-start gap-5 sm:grid-cols-[150px_1fr]`}
      >
        <button
          className={`absolute right-0 top-0 z-10 w-8 cursor-pointer ${
            isClosed && !inventory?.inventory_defined && "text-white"
          } text-lg hover:text-red-500`}
          onClick={() => {
            setSureCheck({
              id: id_product,
              price: price,
              name,
              productQuantity: quantity,
              brand_name,
            });
            setIsClosed(false);
            setRemoveId(cart_item_id);
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <Link href={`/${slug_path}`} className="w-full">
          <Image
            src={image?.[0] ?? "/images/placeholder.webp"}
            alt={`Placeholder`}
            width={0}
            height={0}
            sizes={`90vw`}
            className={`bg-gray-100 h-44 w-full object-cover hover:object-contain sm:h-56`}
          />
        </Link>
        <div
          className={`mb-auto ml-2 flex flex-col items-start gap-2 pr-9 pt-2`}
        >
          <h4 className={`text-[15px] font-medium`}>{name}</h4>
          {is_digital && (
            <>
              <p className="text-gray-500 text-sm">
                Digitalni proizvod - Za ovaj prozvod nema troškove dostave i ne
                ulazi u obračun za dostavu.
              </p>
            </>
          )}
          <p className={`text-sm font-normal`}>Šifra:&nbsp;{sku}</p>
          {boja && <p className="text-sm font-normal">Boja:&nbsp;{boja}</p>}
          {velicina && (
            <p className="text-sm font-normal">Veličina:&nbsp;{velicina}</p>
          )}
          <PlusMinusInput
            label="Količina:"
            displayComponent={displayQuantityField}
            behaviours={behaviours}
            maxAmount={+inventory?.amount}
            quantity={productQuantity}
            setQuantity={setProductQuantity}
            quantityError={() => {
              return false;
            }}
          />
          <p className={`text-sm font-normal`}>
            Ukupan iznos:&nbsp;{currencyFormat(price?.per_item?.total)}
          </p>
          {!!price?.cost?.discount_amount && (
            <p className={`text-sm font-normal text-red-500`}>
              Uštedeli ste:&nbsp;
              {currencyFormat(price?.cost?.discount_amount)}
            </p>
          )}
        </div>
        {isClosed && !inventory?.inventory_defined && (
          <div
            className={`absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black/40`}
          ></div>
        )}
      </div>
    </>
  );
};

export default CheckoutItems;

import { useEffect, useState } from "react";
import Image from "next/image";
import { useGlobalAddToCart } from "@/api/globals";
import { useGlobalRemoveFromCart } from "@/api/globals";
import { currencyFormat } from "../helpers/functions";
// import PlusMinusInputOne from "./PlusMinusInputOne";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import Link from "next/link";

const CartProductItem = ({ item }) => {
  // const [productAmount, setProductAmount] = useState(
  //   Number(item.cart.quantity)
  // );

  const productAmount = Number(item.cart.quantity);

  const removeFromCart = useGlobalRemoveFromCart();

  const addToCart = useGlobalAddToCart(true);

  useEffect(() => {
    if (productAmount != item.cart.quantity) {
      addToCart(item?.product?.id, productAmount, true);
    }
  }, [productAmount, addToCart, item.cart.quantity, item?.product?.id]);

  const total = item?.product?.price?.cost;
  const currency = item?.product?.price?.currency;
  const [sureCheck, setSureCheck] = useState(false);

  return (
    <>
      <div className="relative col-span-2 mt-1 grid grid-cols-3 gap-x-10">
        <div className="relative col-span-1 flex w-full items-center">
          <div className="relative xl:h-[186px] xl:w-[139px]">
            <Link href={`/${item?.product?.slug}`}>
              <Image
                src={convertHttpToHttps(item?.product?.image[0])}
                width={250}
                height={250}
                alt=""
                className="h-full object-cover"
              />
            </Link>
            {item?.product?.price?.per_item?.discount?.active && (
              <div
                className={`absolute right-2 top-2 rounded-lg bg-[#c23d27] px-[0.85rem] py-0.5 text-xs font-thin text-white`}
              >
                -
                {(
                  ((item?.product?.price?.per_item?.price_with_vat -
                    item?.product?.price?.per_item?.price_discount) /
                    item?.product?.price?.per_item?.price_with_vat) *
                  100
                ).toFixed(0)}
                %
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2 flex flex-col">
          <Link href={`/${item?.product?.slug}`}>
            <span className="text-[15px] font-bold">
              {item?.product?.basic_data?.name}
            </span>
          </Link>
          <div className="flex flex-col gap-2">
            <span className="mt-5">
              Šifra: {item?.product?.basic_data?.sku}
            </span>
            <div className="flex items-center gap-3 max-md:hidden">
              <span>Količina</span>
              {/* <PlusMinusInputOne
                setCount={setProductAmount}
                count={productAmount}
                amount={productAmount}
                maxAmount={+item?.product?.inventory?.amount}
              /> */}
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <span>Količina:</span>
              {productAmount}
            </div>
            <span>Ukupan iznos: {currencyFormat(total?.total, currency)}</span>
            {item?.product?.price?.per_item?.discount?.active && (
              <span className="font-semibold text-[#e10000]">
                Uštedeli ste:{" "}
                {currencyFormat(
                  item?.product?.price?.cost?.discount_amount,
                  currency,
                )}
              </span>
            )}
          </div>
        </div>
        <span
          className="absolute -top-4 right-2 cursor-pointer"
          onClick={() => setSureCheck(true)}
        >
          X
        </span>
      </div>
      {sureCheck && (
        <div
          className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSureCheck(false)}
        >
          <div className="rounded-lg bg-white p-5">
            <span className="text-[15px] font-bold">
              Da li ste sigurni da želite da uklonite proizvod iz korpe?
            </span>
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                className="rounded-lg bg-[#E5E5E5] px-5 py-2 hover:bg-red-500 hover:text-white"
                onClick={() => setSureCheck(false)}
              >
                Ne
              </button>
              <button
                className="rounded-lg bg-[#E5E5E5] px-5 py-2 hover:bg-green-500 hover:text-white"
                onClick={() => removeFromCart(item?.product?.id)}
              >
                Da
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartProductItem;

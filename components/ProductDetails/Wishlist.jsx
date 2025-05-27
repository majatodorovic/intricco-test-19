import Image from "next/image";
import React, { useEffect } from "react";
import {
  useAddToWishlist,
  useIsInWishlist,
  useRemoveFromWishlist,
} from "@/hooks/ecommerce.hooks";
import { pushToDataLayer } from "@/_services/data-layer";

const Wishlist = ({ product }) => {
  const { mutate: addToWishlist, isSuccess: isAdded } = useAddToWishlist();

  const { mutate: removeFromWishlist, isSuccess: isRemoved } =
    useRemoveFromWishlist();

  const { data, refetch: reCheck } = useIsInWishlist({
    id: product?.data?.item?.basic_data?.id_product,
  });

  const isInWishlist = data?.exist;
  const wishlist_id = data?.wishlist_item_id;

  useEffect(() => {
    reCheck();
  }, [isAdded, isRemoved]);

  return (
    <div
      className={`${
        !isInWishlist && "hover:bg-red-500"
      } group scale-90 cursor-pointer rounded-full p-2`}
      onClick={() => {
        if (isInWishlist) {
          removeFromWishlist({ id: wishlist_id });
          pushToDataLayer("remove_from_wishlist", product);
        } else {
          addToWishlist({
            id: product?.data?.item?.basic_data?.id_product,
            name: product?.data?.item?.basic_data?.name,
          });
          pushToDataLayer("add_to_wishlist", product);
        }
      }}
    >
      {isInWishlist ? (
        <Image
          src={`/icons/heart-active.png`}
          alt="wishlist"
          width={39}
          height={39}
          className={`h-auto w-10`}
        />
      ) : (
        <Image
          src={"/icons/heart.png"}
          alt="wishlist"
          width={39}
          height={39}
          className={`favorite h-auto w-10 ${
            !isInWishlist && "group-hover:invert"
          }`}
        />
      )}
    </div>
  );
};

export default Wishlist;

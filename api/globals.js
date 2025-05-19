"use client";
import { useCartContext } from "./cartContext";
import { deleteMethod, post } from "./api";

/**
 * Hook wrapper for global add to cart so context can be used
 */
export const useGlobalAddToCart = (type = false) => {
  const [, mutateCart] = useCartContext();
  return (productId, quantity) => {
    post("/cart", {
      id_product: productId,
      quantity,
      id_product_parent: null,
      description: null,
      status: null,
      quantity_calc_type: type ? "replace" : "calc",
    }).then(() => {
      mutateCart();
    });
  };
};

/**
 * Hook wrapper for global add to cart so context can be used
 */
export const useGlobalRemoveFromCart = () => {
  const [, mutateCart] = useCartContext();

  return (productId) => {
    post("/cart", {
      id_product: productId,
      quantity: 0,
      id_product_parent: null,
      description: null,
      status: null,
    })
      .then(() => {
        mutateCart();
      })
      .catch((error) => console.warn(error));
  };
};

/**
 * Hook wrapper for global add to wishlist so context can be used
 */
export const useGlobalAddToWishList = () => {
  const [, , , mutateWishList] = useCartContext();

  return (productId) => {
    post("/wishlist", {
      id: null,
      id_product: productId,
      quantity: 1,
      id_product_parent: null,
      description: null,
      status: null,
    }).then(() => {
      mutateWishList();
    });
  };
};

/**
 * Hook wrapper for global remove from wishlist so context can be used
 */
export const useGlobalRemoveFromWishlist = () => {
  const [, , , mutateWishList] = useCartContext();

  return (id) => {
    deleteMethod(`/wishlist/${id}`)
      .then(() => {
        mutateWishList();
      })
      .catch((error) => console.warn(error));
  };
};

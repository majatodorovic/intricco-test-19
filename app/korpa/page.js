import { headers } from "next/headers";
import { get, list, fetch } from "@/api/api";
import { CheckoutPage } from "@/components/CheckoutPage/CheckoutPage";

const getPaymentOptions = async () => {
  return await get("/checkout/payment-options").then(
    (response) => response?.payload,
  );
};
const getDeliveryOptions = async () => {
  return await get("/checkout/delivery-options").then(
    (response) => response?.payload,
  );
};
const getRecommendedProducts = async () => {
  return await list("/products/section/list/recommendation").then(
    (res) => res?.payload?.items,
  );
};
const getCountries = async () => {
  return await get(`/checkout/ddl/id_country`).then((res) => res?.payload);
};

const getAllowedCheckoutToGuest = async () => {
  return await fetch(`b2c/checkout/options/one_page.`).then(
    (res) => res?.payload,
  );
};

const getIsLoggedIn = async () => {
  return await get(`/customers/sign-in/login-status`).then(
    (res) => res?.payload,
  );
};

const Cart = async () => {
  const [
    payment_options,
    delivery_options,
    recommended_products,
    countries,
    // isAllowedCheckoutToGuest,
    // isLoggedIn,
  ] = await Promise.all([
    getPaymentOptions(),
    getDeliveryOptions(),
    getRecommendedProducts(),
    getCountries(),
    getAllowedCheckoutToGuest(),
    getIsLoggedIn(),
  ]);

  return (
    <CheckoutPage
      payment_options={payment_options}
      delivery_options={delivery_options}
      recommendedProducts={recommended_products}
      countries={countries}
    />
  );
};

export default Cart;

export const revalidate = 30;

export const generateMetadata = async () => {
  const header_list = headers();
  let canonical = header_list?.get("x-pathname");
  return {
    title: `Korpa | Intrrico Underwear`,
    description: "Dobrodošli na Intrrico Underwear Online Shop",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Korpa | Intrrico Underwear`,
      description: "Dobrodošli na Intrrico Underwear Online Shop",
      type: "website",
      locale: "sr_RS",
    },
  };
};

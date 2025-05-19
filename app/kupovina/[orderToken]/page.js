import { get } from "@/api/api";
import OrderSuccess from "@/components/OrderToken/OrderToken";

const userOrderToken = async (orderToken) => {
  return await get(`/checkout/info/${orderToken}`).then(
    (response) => response?.payload,
  );
};
const orderToken = async ({ params: { orderToken } }) => {
  const order = await userOrderToken(orderToken);

  return <OrderSuccess order={order} />;
};

export default orderToken;

export const metadata = {
  title: "Kupovina | Intricco Underwear",
  description: "Dobrodošli na Intricco Underwear Online Shop",
  keywords: [
    "Intricco Underwear",
    "online",
    "shop",
    "Intricco Underwear.com",
    "farmerke",
    "trenerke",
    "dukserice",
    "Intricco Underwear obuca",
    "obuca",
    "Intricco Underwear online",
  ],
};

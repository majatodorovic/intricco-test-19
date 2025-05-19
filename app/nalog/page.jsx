import { permanentRedirect as redirect } from "next/navigation";
import { Account } from "@/_pages/account/account";
import { getLoginURL } from "@/_redirect-handlers";
import { getLoggedInStatus } from "@/_functions";
import { cookies } from "next/headers";

const Nalog = async () => {
  let url = getLoginURL(null, "login");
  let customer_token = cookies().get("customer_token")?.value;
  let is_logged_in = await getLoggedInStatus(customer_token);

  switch (true) {
    case is_logged_in:
      return <Account />;
    default:
      redirect(`${url}`);
  }
};

export default Nalog;

export const metadata = {
  title: "Nalog | Intricco Underwear",
  description: "Intricco Underwear",
  robots: {
    index: false,
    follow: false,
  },
};

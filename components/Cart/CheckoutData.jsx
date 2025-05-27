"use client";

import { useContext, useEffect, useState } from "react";
import {
  useBillingAddresses,
  useCheckout,
  useForm,
  useGetAddress,
  useIsLoggedIn,
  useRemoveFromCart,
  useGetAccountData,
} from "@/hooks/ecommerce.hooks";
import { handleCreditCard, handleSetData } from "@/components/Cart/functions";
import { useRouter } from "next/navigation";
import { handleResetErrors, SelectInput } from "@/_components/shared/form";
import Image from "next/image";
import CheckoutUserInfo from "@/components/Cart/CheckoutUserInfo";
import CheckoutOptions from "@/components/Cart/CheckoutOptions";
import CheckoutTotals from "@/components/Cart/CheckoutTotals";
import CheckoutItems from "@/components/Cart/CheckoutItems";
import Link from "next/link";
import fields from "./shipping.json";
import Spinner from "@/components/UI/Spinner";
import { userContext } from "@/context/userContext";
import noImage from "../../public/images/placeholder.webp";
import { pushToDataLayer } from "@/_services/data-layer";
import FreeDeliveryScale from "./FreeDeliveryScale";

export const CheckoutData = ({
  className,
  formData,
  payment_options,
  delivery_options,
  summary,
  items,
  options,
  totals,
  refreshCart,
  refreshSummary,
}) => {
  const {
    data: dataTmp,
    setData: setDataTmp,
    errors: errorsTmp,
    setErrors: setErrorsTmp,
  } = useForm(formData);

  const [selected, setSelected] = useState({
    id: null,
    use_same_data: true,
  });

  const { loggedIn: userLoggedIn } = useContext(userContext);

  const { data: loggedIn } = useIsLoggedIn();

  const { data: billing_addresses } = userLoggedIn ? useBillingAddresses() : [];

  const { data: user_billing_addresses } = userLoggedIn
    ? useGetAccountData({ api: `/customers/billing-address`, method: "list" })
    : [];

  const { data: form, isLoading } = useGetAddress(
    billing_addresses?.length > 1 && selected?.id
      ? selected?.id
      : billing_addresses?.[0]?.id,
    "billing",
    loggedIn && Boolean(billing_addresses?.length),
  );

  const [postErrors, setPostErrors] = useState({
    fields: [],
  });

  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sureCheck, setSureCheck] = useState(false);
  const [removeId, setRemoveId] = useState();

  const {
    data,
    mutate: checkOut,
    isPending,
    isSuccess: isCheckoutSuccess,
  } = useCheckout({
    formData: dataTmp,
    setPostErrors: setPostErrors,
    setLoading: setLoading,
  });

  const [required, setRequired] = useState([
    "payment_method",
    "delivery_method",
    "first_name_shipping",
    "last_name_shipping",
    "phone_shipping",
    "email_shipping",
    "address_shipping",
    "town_name_shipping",
    "zip_code_shipping",
    "object_number_shipping",
    "accept_rules",
    "first_name_billing",
    "last_name_billing",
    "phone_billing",
    "email_billing",
    "address_billing",
    "town_name_billing",
    "zip_code_billing",
    "object_number_billing",
  ]);

  useEffect(() => {
    if (formData?.delivery_method === "in_store_pickup") {
      setRequired((prevRequired) => [
        ...prevRequired,
        "delivery_method_options",
      ]);
    } else {
      setRequired((prevRequired) =>
        prevRequired.filter((item) => item !== "delivery_method_options"),
      );
    }
  }, [formData?.delivery_method]);

  useEffect(() => {
    const defaultAddress = user_billing_addresses?.items?.find(
      (address) => address.set_default === 1,
    );
    if (defaultAddress) {
      const { id: billing_id } = defaultAddress;
      setSelected((prev) => ({
        ...prev,
        id: billing_id,
      }));
    }
  }, [user_billing_addresses?.items]);

  const router = useRouter();

  //Function to switch api use of country depending on user logged in status
  const formatCountry = (fields) => {
    fields.map((field) => {
      if (field.name === "id_country_shipping") {
        return {
          ...field,
          fill: userLoggedIn
            ? `/customers/shipping-address/ddl/id_country`
            : `checkout/ddl/id_country`,
        };
      }
    });
  };
  //Function to switch field from input to select and changing api depending on user logged in status
  // const formatCheckoutFields = (fields, data) => {
  //   if (data && Number(data?.id_country_shipping) === 193) {
  //     return fields
  //       ?.map((field) => {
  //         if (field?.name === "town_name_shipping") {
  //           return {
  //             ...field,
  //             name: "id_town_shipping",
  //             type: "select",
  //             fill: userLoggedIn
  //               ? "/customers/shipping-address/ddl/id_town?id_country=${data?.id_country}"
  //               : `checkout/ddl/id_town?id_country=${data?.id_country_shipping}`,
  //           };
  //         }
  //         return field;
  //       })
  //       .filter(Boolean); // Remove null fields from the array
  //   }
  //   return fields;
  // };

  const filterOutProductsOutOfStock = (data) => {
    const productsOutOfStock = [];
    data?.forEach((item) => {
      if (!item?.product?.inventory?.inventory_defined) {
        productsOutOfStock.push({
          cart: {
            id: null,
            cart_item_id: item?.cart?.cart_item_id,
          },
          product: {
            name: item?.product?.basic_data?.name,
            sku: item?.product?.basic_data?.sku,
            slug: item?.product?.slug,
            image: item?.product?.image,
            id: item?.product?.id,
          },
        });
      }
    });
    setPostErrors((prevErrors) => ({
      ...prevErrors,
      fields: productsOutOfStock,
    }));
  };

  useEffect(() => {
    if (items && !isClosed) {
      filterOutProductsOutOfStock(items);
    }
  }, [items]);

  const { mutate: removeFromCart, isSuccess } = useRemoveFromCart();

  useEffect(() => {
    if (isSuccess) {
      refreshCart();
      refreshSummary();
    }
  }, [isSuccess, refreshCart, refreshSummary]);

  useEffect(() => {
    if (isCheckoutSuccess && data) {
      const { credit_card } = data;
      switch (true) {
        case credit_card === null:
          return router.push(`/korpa/kupovina/${data?.order?.order_token}`);
        case credit_card !== null:
          return handleCreditCard(data);
        default:
          break;
      }
    }
  }, [isCheckoutSuccess, data, router]);

  useEffect(
    () => {
      if (!isLoading) {
        handleSetData("default_data", form, dataTmp, setDataTmp);
      }
    },
    [selected?.id, form?.[0]],
    isLoading,
  );

  useEffect(() => {
    formatCountry(fields);
    if (selected?.use_same_data) {
      return handleSetData("same_data", form, dataTmp, setDataTmp);
    } else {
      return handleSetData("different_data", form, dataTmp, setDataTmp);
    }
  }, [selected?.id, selected?.use_same_data]);

  useEffect(() => {
    setRequired((prevRequired) =>
      selected?.use_same_data
        ? prevRequired.filter(
            (item) =>
              item !== "floor_shipping" && item !== "apartment_number_shipping",
          )
        : [...prevRequired, "floor_shipping", "apartment_number_shipping"],
    );
  }, [selected?.use_same_data]);

  const show_options = process.env.SHOW_CHECKOUT_SHIPPING_FORM;
  return (
    <div className={`mt-5 grid grid-cols-6 gap-10 2xl:grid-cols-5 2xl:gap-16`}>
      <div className={`col-span-6 flex flex-col lg:col-span-3`}>
        {show_options === "false" && billing_addresses?.length > 1 && (
          <SelectInput
            className={`!w-fit`}
            errors={errorsTmp}
            placeholder={`Izaberite adresu plaćanja`}
            options={billing_addresses}
            onChange={(e) => {
              if (e.target.value !== "none") {
                setSelected((prev) => ({
                  ...prev,
                  id: e.target.value,
                }));
                handleResetErrors(setErrorsTmp);
              }
            }}
            value={selected?.id}
          />
        )}
        <h2 className="mb-5 text-lg font-medium">Informacije za dostavu</h2>
        <CheckoutUserInfo
          errors={errorsTmp}
          selected={selected}
          setErrors={setErrorsTmp}
          setFormData={setDataTmp}
          formData={dataTmp}
        />
        <CheckoutOptions
          errors={errorsTmp}
          setErrors={setErrorsTmp}
          delivery_options={delivery_options}
          payment_options={payment_options}
          setFormData={setDataTmp}
          formData={dataTmp}
          className={className}
          summary={summary}
          options={options}
          totals={totals}
        />
      </div>

      <div
        className={`col-span-6 flex flex-col gap-3 md:col-span-4 lg:col-span-3 2xl:col-span-2`}
      >
        <h2 className="text-lg font-medium">Proizvodi u korpi</h2>
        <div
          className={`customScroll mb-16 mt-7 flex max-h-[400px] flex-col gap-5 overflow-y-auto pr-2 sm:mb-10`}
        >
          {(items ?? [])?.map(
            ({
              product: {
                basic_data: { id_product, name, sku, brand_name },
                price,
                inventory,
                image,
                link: { link_path: slug_path },
                digital_data: { is_digital },
                behaviours: { checkout },
                variant_key_array,
              },
              cart: { quantity, cart_item_id },
            }) => (
              <CheckoutItems
                behaviours={checkout}
                brand_name={brand_name}
                key={id_product}
                id_product={id_product}
                image={image}
                sku={sku}
                inventory={inventory}
                slug_path={slug_path}
                refreshCart={refreshCart}
                name={name}
                price={price}
                isClosed={isClosed}
                refreshSummary={refreshSummary}
                quantity={quantity}
                cart_item_id={cart_item_id}
                is_digital={is_digital}
                displayQuantityField={checkout.display.quantity_field}
                variant_key_array={variant_key_array}
                setSureCheck={setSureCheck}
                setRemoveId={setRemoveId}
                setIsClosed={setIsClosed}
              />
            ),
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium">Vrednost vaše korpe:</h2>
          <div className={`mt-5 bg-gray px-8 py-10`}>
            <CheckoutTotals
              totals={totals}
              summary={summary}
              className={className}
            />
          </div>
        </div>
        <div className={`flex flex-col`}>
          <div className="relative flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="accept_rules"
              name="accept_rules"
              onChange={(e) => {
                setDataTmp({
                  ...dataTmp,
                  accept_rules: e?.target?.checked,
                });
                setErrorsTmp(
                  errorsTmp?.filter((error) => error !== "accept_rules"),
                );
              }}
              checked={dataTmp?.accept_rules}
              className="h-5 w-5 rounded-full bg-white text-primary focus:border-none focus:outline-none focus:ring-0"
            />
            <label
              htmlFor="agreed"
              className={`text-base font-light ${className} ${
                errorsTmp?.includes("accept_rules") ? `text-red-500` : ``
              }`}
            >
              Saglasan sam sa opštim{" "}
              <a
                className={`underline`}
                href={`/strana/uslovi-koriscenja`}
                target={`_blank`}
              >
                <span>uslovima korišćenja</span>
              </a>{" "}
              Intricco Underwear
            </label>
          </div>
          {errorsTmp?.includes("accept_rules") && (
            <p className={`text-xs text-red-500`}>
              Molimo Vas da prihvatite uslove korišćenja.
            </p>
          )}
        </div>
        <button
          disabled={isPending}
          className={`ml-auto mt-2 w-1/2 max-lg:w-full ${
            isPending && "!bg-white !text-primary opacity-50"
          } h-[3rem] text-center uppercase text-white ${className} primaryButton py-2 font-medium`}
          onClick={() => {
            let err = [];
            (required ?? [])?.forEach((key) => {
              //Error handling for countries
              if (
                dataTmp.id_country_shipping == "-" ||
                dataTmp.id_country_shipping == 0
              ) {
                err = [...err, "id_country_shipping"];
              } else if (dataTmp.id_town_shipping === "") {
                err = [...err, "id_town_shipping"];
              } else {
                if (!dataTmp[key] || dataTmp[key]?.length === 0) {
                  err.push(key);
                }
              }
            });
            setErrorsTmp(err);
            if (err?.length === 0) {
              pushToDataLayer("begin_checkout", items);

              const timeout = setTimeout(() => {
                checkOut();
              }, 100);

              return () => clearTimeout(timeout);
            } else {
              window.scrollTo(0, 0);
            }
          }}
        >
          {isPending ? "OBRADA..." : "Potvrdi porudžbinu"}
        </button>
        <FreeDeliveryScale summary={summary} />
      </div>
      <NoStockModal
        className={className}
        postErrors={postErrors}
        setPostErrors={setPostErrors}
        removeFromCart={removeFromCart}
        setIsClosed={setIsClosed}
      />
      {isCheckoutSuccess && data?.credit_card === null && loading && (
        <div
          className={`fixed left-0 top-0 z-[100] flex h-[100dvh] w-screen flex-col items-center justify-center bg-black/50 opacity-100 backdrop-blur-md transition-all duration-500`}
        >
          <Spinner className={`!scale-125`} />
        </div>
      )}
      {sureCheck && (
        <div
          className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSureCheck(false)}
        >
          <div className="rounded-lg bg-white p-5">
            <span className="text-[15px]">
              Da li ste sigurni da želite da uklonite proizvod iz korpe?
            </span>
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                className="rounded-lg bg-[#E5E5E5] px-5 py-2 hover:bg-red-500 hover:text-white max-md:text-[15px]"
                onClick={() => setSureCheck(false)}
              >
                Ne
              </button>
              <button
                className="rounded-lg bg-[#E5E5E5] px-5 py-2 hover:bg-green-500 hover:text-white max-md:text-[15px]"
                onClick={() => {
                  pushToDataLayer("remove_from_cart", {
                    price: sureCheck.price,
                    id: sureCheck.id,
                    name: sureCheck.name,
                    brand_name: sureCheck.brand_name,
                    productQuantity: Number(sureCheck.productQuantity),
                  });
                  removeFromCart({ id: removeId });
                }}
              >
                Da
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NoStockModal = ({
  postErrors,
  setPostErrors,
  removeFromCart,
  setIsClosed,
  className,
}) => {
  return (
    <div
      className={
        postErrors?.fields?.length > 0
          ? `visible fixed left-0 top-0 z-[100] flex h-[100dvh] w-screen flex-col items-center justify-center bg-black/50 opacity-100 backdrop-blur-md transition-all duration-500`
          : `invisible fixed left-0 top-0 z-[100] flex h-[100dvh] w-screen flex-col items-center justify-center bg-black/50 opacity-0 backdrop-blur-md transition-all duration-500`
      }
    >
      <div
        className={`relative inset-0 m-auto h-fit w-fit rounded-md bg-white p-[1rem] max-sm:mx-2`}
      >
        <div className={`mt-[3rem] px-[0.25rem] md:px-9`}>
          <h3 className={`mt-4 text-center text-xl font-semibold ${className}`}>
            U korpi su proizvodi koji trenutno nisu na stanju.
          </h3>
          <p className={`mt-2 text-left text-base font-normal ${className}`}>
            Kako bi završili porudžbinu, morate izbrisati sledeće artikle iz
            korpe:
          </p>
          <div
            className={`divide-y-black mt-[0.85rem] flex flex-col divide-y px-5`}
          >
            {(postErrors?.fields ?? [])?.map(
              ({
                cart: { id, cart_item_id },
                product: { id: id_product, name, sku, slug, image },
                errors,
              }) => {
                let deleted_items_count = 0;
                //ako je deleted_items_count jednak broju proizvoda koji nisu na lageru, gasimo modal
                if (deleted_items_count === postErrors?.fields?.length) {
                  setPostErrors(null);
                }

                return (
                  <div
                    key={id}
                    className={`flex items-start gap-2 py-[1.55rem]`}
                  >
                    <Link href={`/${slug}`}>
                      <Image
                        src={image?.[0] ?? noImage}
                        alt={name ?? sku ?? slug ?? "Ecommerce"}
                        width={60}
                        height={100}
                        className={`aspect-2/3 max-h-[72px]`}
                      />
                    </Link>
                    <div className={`flex flex-col`}>
                      <Link
                        href={`/${slug}`}
                        className={`text-sm font-normal ${className}`}
                      >
                        {name}
                      </Link>
                      <ul className={`flex flex-col gap-1`}>
                        {(errors ?? ["Trenutno nije na stanju."])?.map(
                          (error) => (
                            <li
                              key={error}
                              className={`text-[13px] font-bold text-[#e10000] ${className}`}
                            >
                              {error}
                            </li>
                          ),
                        )}
                      </ul>
                      <button
                        onClick={async () => {
                          await removeFromCart({ id: cart_item_id });
                          //nakon brisanja, iz postErrors.fields filtriramo taj item i izbacujemo ga
                          let arr = [];
                          arr = (postErrors?.fields ?? [])?.filter(
                            (item) => item.product.id !== id_product,
                          );
                          setPostErrors({
                            ...postErrors,
                            fields: arr,
                          });
                        }}
                        className={`mt-1 flex w-[10rem] items-center justify-between bg-[#000] px-2 py-[0.225rem] font-normal text-white transition-all duration-300 hover:bg-[#e10000] hover:bg-opacity-80 ${className}`}
                      >
                        Ukloni iz korpe{" "}
                        <i className="fa-solid fa-trash ml-auto"></i>
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
        <div className={`mt-2 flex items-center justify-end`}>
          <button
            className={`primaryButton ml-auto mt-1 px-12 py-2`}
            onClick={() => {
              setPostErrors(null);
              setIsClosed(true);
            }}
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

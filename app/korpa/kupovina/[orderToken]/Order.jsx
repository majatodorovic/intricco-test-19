"use client";
import { useEffect } from "react";
import { useOrder } from "@/hooks/ecommerce.hooks";
import Image from "next/image";
import Link from "next/link";
import { currencyFormat } from "@/helpers/functions";
import { notFound } from "next/navigation";
import { pushToDataLayer } from "@/_services/data-layer";

const Order = ({ orderToken, className }) => {
  const { data, isSuccess } = useOrder({ order_token: orderToken });
  if (data === null) notFound();

  const {
    order,
    order: { credit_card } = {},
    deliveries,
    items,
    shipping_address,
  } = data || {};

  const renderContent = () => {
    switch (true) {
      case isSuccess && !credit_card:
        return (
          <Success
            data={data}
            items={items}
            order={order}
            deliveries={deliveries}
            shipping_address={shipping_address}
            className={className}
          />
        );
      case isSuccess && credit_card:
        return <></>;
    }
  };

  return (
    <>
      <div
        className={`container mx-auto mt-[4rem] px-2 2xl:px-[2rem] 3xl:px-[3rem] 4xl:px-[9.5rem]`}
      >
        {renderContent()}
      </div>
    </>
  );
};

export default Order;

const Success = ({
  data,
  order: { slug, payment_method_name },
  deliveries,
  items,
  shipping_address,
  className,
}) => {
  useEffect(() => {
    pushToDataLayer("purchase", data);
  }, []);

  return (
    <>
      <div className={`sectionWidth flex flex-col items-center justify-center`}>
        <h1 className={`text-center ${className} text-3xl font-normal`}>
          <i
            className={`fas fa-check-circle mx-auto mb-5 text-[2rem] text-green-500`}
          ></i>
          &nbsp; Porudžbina <span className={`underline`}>{slug}</span>
        </h1>
        <h2 className={`text-center ${className} mt-2 text-base font-light`}>
          Hvala Vam na ukazanom poverenju. Vaša porudžbina je uspešno kreirana.
          U nastavku možete videti detalje Vaše porudžbine.
        </h2>
      </div>
      <div
        className={`sectionWidth mt-20 grid grid-cols-2 gap-16 xl:grid-cols-3`}
      >
        <div className={`col-span-2 xl:col-span-2`}>
          <h3 className={`${className} text-xl font-normal`}>
            Poručeni artikli
          </h3>
          <div
            className={`mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2`}
          >
            {items?.map(
              ({
                basic_data: { id_product: id, name, slug, image, quantity },
                price: { price },
              }) => {
                return (
                  <div key={id} className={`col-span-1`}>
                    <Link href={`/${slug}`}>
                      <Image
                        src={image ?? "/images/placeholder.webp"}
                        alt={`${name} - ${slug}`}
                        width={0}
                        height={0}
                        sizes={`100vw`}
                        className={`aspect-[7/9] w-full object-cover`}
                      />
                    </Link>
                    <h2
                      className={`mt-2 ${className} text-center text-base font-light`}
                    >
                      {+quantity}x {name}
                    </h2>
                    <p
                      className={`mt-1 ${className} text-center text-sm font-normal`}
                    >
                      {currencyFormat(price)}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
        <div className={`col-span-2 xl:col-span-1`}>
          <h3 className={`${className} text-xl font-normal`}>
            Detalji porudžbine
          </h3>
          <div
            className={`mt-10 flex flex-col gap-2 rounded-lg bg-[#f7f7f7] p-2`}
          >
            <h3 className={`${className} text-base font-light`}>
              Artikle poručio:{" "}
              <span className={`font-normal`}>
                {shipping_address?.first_name?.charAt(0).toUpperCase() +
                  shipping_address?.first_name?.slice(1)}{" "}
                {shipping_address?.last_name?.charAt(0).toUpperCase() +
                  shipping_address?.last_name?.slice(1)}
              </span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Način dostave:{" "}
              <span className={`font-normal`}>
                {deliveries[0].format_data.full_name}
              </span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Način plaćanja:{" "}
              <span className={`font-normal`}>{payment_method_name}</span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Adresa za dostavu:{" "}
              <span className={`font-normal`}>
                {shipping_address?.address?.charAt(0).toUpperCase() +
                  shipping_address?.address?.slice(1)}{" "}
                {shipping_address?.object_number}, {shipping_address?.zip_code}
              </span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Telefon:{" "}
              <span className={`font-normal`}>{shipping_address?.phone}</span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Grad:{" "}
              <span className={`font-normal`}>
                {shipping_address?.town_name?.charAt(0).toUpperCase() +
                  shipping_address?.town_name?.slice(1)}
              </span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Email:{" "}
              <span className={`font-normal`}>{shipping_address?.email}</span>
            </h3>
          </div>
          <div
            className={`mt-5 flex flex-col gap-2 rounded-lg bg-[#f7f7f7] p-2`}
          >
            <h3 className={`${className} text-base font-light`}>
              Prodavac:{" "}
              <span className={`font-normal`}>{process.env.NAME}</span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              PIB: <span className={`font-normal`}>{process.env.PIB}</span>
            </h3>
            <h3 className={`${className} text-base font-light`}>
              Adresa:{" "}
              <span className={`font-normal`}>{process.env.ADDRESS}</span>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

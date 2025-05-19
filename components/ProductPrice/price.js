import { currencyFormat } from "@/helpers/functions";

/**
 * Returns
 * status
 * of
 * the
 * price
 * @param {object} price -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {string}
 *     -
 *     The
 *     status
 *     of
 *     the
 *     price.
 */
export const getPriceStatus = (price) => {
  let status = "default";

  if (price?.discount?.active && price?.rebate?.active) {
    status = "discount_rebates";
  }
  if (
    (price?.discount?.active && !price?.rebate?.active) ||
    ((price?.min?.discount?.active || price?.min?.discount?.active) &&
      !price?.rebate?.active)
  ) {
    status = "discount";
  }
  if (price?.rebate?.active && !price?.discount?.active) {
    status = "rebates";
  }

  return status;
};

/**
 * Returns
 * are
 * prices
 * equal
 * @param {object} price -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {boolean}
 *     -
 *     Are
 *     prices
 *     equal.
 */
export const getArePricesEqual = (price) => {
  return price?.min?.price?.original === price?.max?.price?.original;
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} inventory -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     inventory
 *     data.
 * @returns {boolean}
 *     -
 *     The
 *     status
 *     of
 *     the
 *     inventory
 *     -
 *     is
 *     in
 *     stock
 *     or
 *     not.
 */
export const checkIsInStock = (inventory) => {
  return inventory?.inventory_defined && Number(inventory?.amount) > 0;
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} price -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {object}
 *     -
 *     The
 *     status
 *     of
 *     the
 *     price
 *     -
 *     is
 *     it
 *     defined
 *     and
 *     is
 *     it
 *     the
 *     range
 *     of
 *     prices.
 */
export const checkPrices = (price) => {
  let data = {};

  data.price_defined = !!(price?.price_defined && price?.price?.original > 0);

  data.price_range =
    price?.min?.price?.original > 0 && price?.max?.price?.original > 0;

  return data;
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} data -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {JSX.Element}
 *     -
 *     Default
 *     prices,
 *     without
 *     rebates
 *     or
 *     discounts.
 */
export const renderDefaultPrices = (data = {}) => {
  let is_range = data?.is_price_range;
  let price = data?.price;

  if (is_range) {
    let are_range_prices_equal = getArePricesEqual(price);
    if (are_range_prices_equal) {
      return (
        <p
          className={`!font-light ${
            data?.is_details ? "!text-xl" : "!text-base"
          }`}
        >
          {currencyFormat(price?.min?.price?.original)}
        </p>
      );
    } else {
      return (
        <p
          className={`!font-light ${
            data?.is_details ? "!text-2xl !font-semibold" : "!text-base"
          }`}
        >
          {currencyFormat(price?.min?.price?.original)} -{" "}
          {currencyFormat(price?.max?.price?.original)}
        </p>
      );
    }
  } else {
    return (
      <p
        className={`!font-light ${data?.is_details ? "!text-2xl !font-semibold" : "!text-base"}`}
      >
        {currencyFormat(price?.price?.original)}
      </p>
    );
  }
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} data -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {JSX.Element}
 *     -
 *     Prices
 *     after
 *     discount.
 */
export const renderDiscountPrices = (data = {}) => {
  let is_range = data?.is_price_range;
  let price = data?.price;

  const discount_number = Math.abs(
    price?.min?.price?.original - price?.min?.price?.discount,
  );
  const discount_percent = Math.ceil(
    (discount_number / price?.min?.price?.original) * 100,
  );

  if (is_range) {
    let are_range_prices_equal = getArePricesEqual(price);

    if (are_range_prices_equal) {
      return (
        <div
          className={`flex flex-wrap items-start ${data?.is_details && "!items-center !gap-2"}`}
        >
          <p
            className={`mr-2 text-base font-light ${data?.is_details && "!text-2xl !font-semibold"}`}
          >
            {currencyFormat(price?.min?.price?.discount)}
          </p>
          {data?.is_details && <div className="h-[20px] w-[1px] bg-black" />}
          <div
            className={`group relative text-base font-light line-through ${data?.is_details && "!text-2xl"}`}
          >
            {currencyFormat(price?.min?.price?.original)}
            {data?.is_details && (
              <span className="invisible absolute -top-12 left-0 rounded bg-primary p-[6px] text-[10px] font-normal text-white opacity-0 transition group-hover:visible group-hover:opacity-100">
                Važeća MP cena
                <svg
                  className="absolute left-[45%] z-50 h-6 w-6 -translate-x-1/2 -translate-y-[2px] transform fill-current stroke-current text-primary"
                  width="8"
                  height="8"
                >
                  <rect
                    x="12"
                    y="-10"
                    width="8"
                    height="8"
                    transform={"rotate(45)"}
                  />
                </svg>
              </span>
            )}
          </div>
          {data?.is_details && (
            <div className="ml-2 bg-primary px-5 py-[3px] text-whiteSmoke">
              -{discount_percent}%
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={`flex flex-col items-start ${data?.is_details && "!flex-row !flex-wrap !items-center !gap-2"}`}
        >
          <p
            className={`mr-2 text-base font-light ${data?.is_details && "!text-2xl !font-semibold"}`}
          >
            {currencyFormat(price?.min?.price?.discount)} -{" "}
            {currencyFormat(price?.max?.price?.discount)}
          </p>
          {data?.is_details && <div className="h-[20px] w-[1px] bg-black" />}
          <div
            className={`group relative text-base font-light line-through ${data?.is_details && "!text-2xl"}`}
          >
            {currencyFormat(price?.min?.price?.original)} -{" "}
            {currencyFormat(price?.max?.price?.original)}
            {data?.is_details && (
              <span className="invisible absolute -top-12 left-0 rounded bg-primary p-[6px] text-[10px] font-normal text-white opacity-0 transition group-hover:visible group-hover:opacity-100">
                Važeća MP cena
                <svg
                  className="absolute left-[45%] z-50 h-6 w-6 -translate-x-1/2 -translate-y-[2px] transform fill-current stroke-current text-primary"
                  width="8"
                  height="8"
                >
                  <rect
                    x="12"
                    y="-10"
                    width="8"
                    height="8"
                    transform={"rotate(45)"}
                  />
                </svg>
              </span>
            )}
          </div>
          {data?.is_details && (
            <div className="ml-2 bg-primary px-5 py-[3px] text-whiteSmoke">
              -{discount_percent}%
            </div>
          )}
        </div>
      );
    }
  } else {
    const discount_number_other = Math.abs(
      price?.price?.original - price?.price?.discount,
    );

    const discount_percent_other = Math.ceil(
      (discount_number_other / price?.price?.original) * 100,
    );
    return (
      <div
        className={`flex flex-wrap items-start ${data?.is_details && "!items-center !gap-2"}`}
      >
        <p
          className={`mr-2 text-base font-light ${data?.is_details && "!text-2xl !font-semibold"}`}
        >
          {currencyFormat(price?.price?.discount)}
        </p>
        {data?.is_details && <div className="h-[20px] w-[1px] bg-black" />}
        <div
          className={`group relative text-base font-light line-through ${data?.is_details && "!text-2xl"}`}
        >
          {currencyFormat(price?.price?.original)}
          {data?.is_details && (
            <span className="invisible absolute -top-12 left-0 rounded bg-primary p-[6px] text-[10px] font-normal text-white opacity-0 transition group-hover:visible group-hover:opacity-100">
              Važeća MP cena
              <svg
                className="absolute left-[45%] z-50 h-6 w-6 -translate-x-1/2 -translate-y-[2px] transform fill-current stroke-current text-primary"
                width="8"
                height="8"
              >
                <rect
                  x="12"
                  y="-10"
                  width="8"
                  height="8"
                  transform={"rotate(45)"}
                />
              </svg>
            </span>
          )}
        </div>
        {data?.is_details && (
          <div className="ml-2 bg-primary px-5 py-[3px] text-whiteSmoke">
            -{Math.floor(discount_percent_other)}%
          </div>
        )}
      </div>
    );
  }
};

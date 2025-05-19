import { currencyFormat } from "@/helpers/functions";

const CheckoutTotals = ({ className, totals, summary }) => {
  return (
    <div className={`flex flex-col pl-2`}>
      <div className={`flex items-center justify-between py-2`}>
        <p className={`${className} text-base font-normal`}>
          Ukupna vrednost korpe:
        </p>
        <p className={`${className} text-base font-light`}>
          {currencyFormat(totals?.with_vat)}
        </p>
      </div>
      <div
        className={`flex items-center justify-between border-t border-t-primary py-2`}
      >
        <p className={`${className} text-base font-normal`}>Popust:</p>
        <p className={`${className} text-base font-light`}>
          {totals?.items_discount_amount + totals?.cart_discount_amount > 0 && (
            <span>-</span>
          )}
          {currencyFormat(
            totals?.items_discount_amount + totals?.cart_discount_amount,
          )}
        </p>
      </div>
      {totals?.promo_code_amount > 0 && (
        <div
          className={`flex items-center justify-between border-t border-t-primary py-2`}
        >
          <p className={`${className} text-base font-normal`}>
            Iznos promo koda:
          </p>
          <p className={`${className} text-base font-light`}>
            -{currencyFormat(totals?.promo_code_amount)}
          </p>
        </div>
      )}
      <div
        className={`flex items-center justify-between border-t border-t-primary py-2`}
      >
        <p className={`${className} text-base font-normal`}>Dostava:</p>
        <p className={`${className} text-base font-light`}>
          {/* Checkout if the delivery is free */}
          {totals?.cart_discount >
          summary?.options?.delivery?.free_delivery?.amount ? (
            <span>Besplatna dostava</span>
          ) : (
            <span>{currencyFormat(totals?.delivery_amount)}</span>
          )}
        </p>
      </div>
      <div
        className={`flex items-center justify-between border-t border-t-primary py-2`}
      >
        <p className={`${className} text-base font-medium`}>
          Ukupno za naplatu:
        </p>
        <p className={`${className} text-base font-medium`}>
          {currencyFormat(totals?.total)}
        </p>
      </div>
    </div>
  );
};

export default CheckoutTotals;

import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/ecommerce.hooks";
import {
  checkIsAddableToCart,
  cartTextBySelectedVariant,
} from "./helpers/addToCart";
import { pushToDataLayer } from "@/_services/data-layer";

const AddToCart = ({
  displayComponent,
  selectedOptions,
  productQuantity,
  productVariant,
  product,
  tempError,
  setTempError,
}) => {
  if (!displayComponent) return <></>;
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();

  const productItem = product?.data?.item;

  const isAddableToCart = checkIsAddableToCart({
    price: productVariant?.id ? productVariant?.price : productItem?.price,
    inventory: productVariant?.id
      ? productVariant?.inventory
      : productItem?.inventory,
  });

  const handleAddToCart = () => {
    switch (product?.product_type) {
      case "single": {
        let is_addable = checkIsAddableToCart({
          price: productItem?.price,
          inventory: productItem?.inventory,
        });
        if (is_addable?.addable) {
          addToCart({
            id: productItem?.basic_data?.id_product,
            quantity: productQuantity,
          });
          pushToDataLayer("add_to_cart", productItem, productQuantity);
          return true;
        } else {
          router.push(
            `/kontakt?proizvodIme=${productItem?.basic_data.name}&sifra=${productItem?.basic_data?.sku.split(" ")[0]}`,
          );
        }
        break;
      }
      case "variant": {
        if (productVariant?.id) {
          let is_addable = checkIsAddableToCart({
            price: productVariant?.price,
            inventory: productVariant?.inventory,
          });

          if (is_addable?.addable) {
            addToCart({
              id: productVariant?.id,
              quantity: productQuantity,
            });
            pushToDataLayer("add_to_cart", productVariant, productQuantity);
            return true;
          } else {
            router.push(
              `/kontakt?proizvodIme=${productItem?.basic_data.name}&sifra=${productVariant?.basic_data?.sku.split(" ")[0]}&atribut=${productVariant?.basic_data?.attributes_text}`,
            );
          }
        } else {
          let text = cartTextBySelectedVariant({ selectedOptions, product });
          setTempError(text);
        }
        break;
      }
      default:
        break;
    }
    return false;
  };

  return (
    <div className="mt-[1.6rem] flex items-center gap-3 max-md:mt-[1rem]">
      <button
        disabled={isPending}
        className={`primaryButton relative flex h-[3.25rem] items-center justify-center text-sm font-bold uppercase max-sm:w-[8.5rem] sm:w-[15.313rem] ${
          tempError ? `bg-red-500` : `bg-primary`
        }`}
        onClick={() => {
          handleAddToCart();
        }}
      >
        {isPending
          ? "DODAJEM..."
          : tempError
            ? tempError
            : isAddableToCart?.text}
      </button>
      {isAddableToCart?.addable && !tempError && (
        <button
          className={`max-sm:w-[8.5rem] ${
            tempError ? `bg-red-500` : `bg-[#c3c2c2]`
          } flex h-[3.25rem] items-center justify-center border border-[#c3c2c2] bg-[#c3c2c2] text-sm font-bold uppercase text-whiteSmoke transition-all duration-300 ease-in-out hover:bg-whiteSmoke hover:text-[#c3c2c2] sm:w-[15.313rem]`}
          onClick={() => {
            if (handleAddToCart()) {
              router.push("/korpa");
            }
          }}
        >
          Kupi odmah
        </button>
      )}
    </div>
  );
};

export default AddToCart;

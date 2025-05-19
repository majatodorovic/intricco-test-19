import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import Image from "next/image";
import { Suspense } from "react";

const OptionColor = ({
  value,
  item,
  selected,
  onChangeHandler,
  setSelectedColor,
}) => {
  const isSelected = selected.some(
    (x) => x.attribute_key === item.attribute.key && x.value_key === value.key,
  );
  let display = "show";

  return (
    <div className={display === "show" ? `block` : `hidden`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onChangeHandler(item.attribute.key, value.key);
          setSelectedColor(value.key);
        }}
        value={value.key}
        selected={value.selected}
        style={display ? { display: display } : {}}
        className={`button-with-tooltip block text-[0.875rem]`}
        aria-label={value.name}
      >
        {(value?.product_image || value?.image) && (
          <div
            className={`${
              isSelected ? `border-2 border-primary` : `border border-[#191919]`
            } h-[40px] w-[40px] rounded-full`}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Image
                src={convertHttpToHttps(value?.product_image ?? value?.image)}
                width={40}
                height={40}
                alt={`Boja`}
                priority={true}
                className="h-full rounded-full object-cover"
              />
            </Suspense>
          </div>
        )}
        <div
          className={`tooltip ${
            isSelected
              ? `flex items-center gap-2 bg-primary text-left text-white`
              : `bg-primary`
          } !text-xs transition-all duration-500`}
        >
          {value.name}
          <svg
            className="absolute left-[45%] top-0 z-50 h-6 w-6 -translate-x-1/2 -translate-y-[6px] transform fill-current stroke-current text-primary"
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
        </div>
      </button>
    </div>
  );
};

export default OptionColor;

import { Input } from "@/_components/shared/form/input";
import { icons } from "@/_lib/icons";

export const Form = ({
  handleSubmit,
  fields,
  data,
  errors,
  isPending,
  showOptions,
  handleInputChange,
  button_text,
  className,
  buttonClassName,
  fieldLayout = "grid grid-cols-1 md:grid-cols-2 gap-4",
}) => {
  return (
    <>
      <form
        className={`mt-5 ${
          showOptions ? "border-b" : ""
        } relative ${className} ${fieldLayout}`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        {(fields ?? [])?.map(
          ({
            id,
            name,
            type,
            required,
            options,
            fill,
            placeholder,
            className,
          }) => {
            return (
              <Input
                onChange={(e) => handleInputChange(e)}
                value={data?.[name]}
                key={id}
                data={data}
                type={type}
                placeholder={placeholder}
                name={name}
                fill={fill}
                options={options}
                id={id ? id : name}
                errors={errors}
                required={required}
                className={className}
              />
            );
          },
        )}
        <div className={`col-span-full`}>
          <div className={`${showOptions ? "mb-5" : ""}`}>
            <button
              disabled={isPending}
              type={`submit`}
              className={`primaryButton w-full px-4 py-2 ${buttonClassName}`}
            >
              {isPending ? (
                <div
                  className={`mx-auto flex w-fit animate-spin justify-center text-center`}
                >
                  {icons.loading}
                </div>
              ) : (
                (button_text ?? "Prijavite se")
              )}
            </button>
          </div>
        </div>
        {showOptions && (
          <div
            className={`absolute -bottom-3 left-0 right-0 mx-auto w-fit bg-white px-2`}
          >
            ili
          </div>
        )}
      </form>
    </>
  );
};

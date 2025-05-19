import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetch as FETCH } from "@/api/api";
import { Form, createOptionsArray } from "@/_components/form";

const CheckoutOptions = ({
  formData,
  setFormData,
  className,
  payment_options,
  delivery_options,
  errors,
  setErrors,
}) => {
  const queryClient = useQueryClient();
  const { data: delivery_form } = useQuery({
    queryKey: [
      "delivery-option-form",
      {
        delivery_method: formData?.delivery_method,
      },
    ],
    queryFn: async () => {
      return await FETCH(
        `checkout/delivery-option-form/${formData?.delivery_method}`,
        {
          order_data: {},
        },
      ).then((res) => res?.payload);
    },
  });

  const onChange = ({ value, prop_name, selected }) => {
    let data = {};
    if (value) {
      let method_id = formData?.delivery_method;
      let method_name = (delivery_options ?? [])?.find(
        (o) => o?.id === formData?.delivery_method,
      )?.name;

      data = {
        delivery_method_id: method_id,
        delivery_method_name: method_name,
        prop_name,
        selected,
      };

      const arr = createOptionsArray(data);
      setErrors(errors?.filter((error) => error !== "delivery_method_options"));
      setFormData({
        ...formData,
        delivery_method_options: arr,
      });
      queryClient.fetchQuery({
        queryKey: ["summary", formData],
        queryFn: async () => {
          return await FETCH(`checkout/summary`, {
            ...formData,
            delivery_method_options: arr,
          }).then((res) => res?.payload);
        },
      });
    }
  };

  return (
    <>
      <div className={`col-span-2 lg:col-span-1`}>
        <div className={`flex flex-col gap-10`}>
          <div>
            <h2 className="text-lg font-medium">Način dostave</h2>
            <div className={`mt-5 flex flex-col gap-1 bg-gray px-8 py-10`}>
              {(delivery_options ?? [])?.map(({ id, name }) => {
                return (
                  <div className={`flex flex-col gap-2 pl-2.5`} key={id}>
                    <div className={`flex items-center gap-3`} key={id}>
                      <input
                        type={`radio`}
                        className="peer hidden"
                        name={`delivery_method`}
                        id={`delivery_method_${id}`}
                        value={id}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            delivery_method: e.target.value,
                          });
                          setErrors(
                            errors?.filter(
                              (error) => error !== "delivery_method",
                            ),
                          );
                        }}
                      />
                      <label
                        htmlFor={`delivery_method_${id}`}
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-black bg-white peer-checked:bg-primary"
                      ></label>
                      <label
                        htmlFor={`delivery_method_${id}`}
                        className={`cursor-pointer text-[0.965rem] font-light ${className}`}
                      >
                        {name}
                      </label>
                    </div>
                    {formData?.delivery_method === id &&
                      delivery_form?.status &&
                      delivery_form?.fields?.length > 0 && (
                        <Form
                          errors={errors}
                          fields={delivery_form?.fields}
                          onChange={onChange}
                        />
                      )}
                  </div>
                );
              })}
            </div>
            {errors?.includes("delivery_method") && (
              <div className={`mt-1 text-xs text-red-500`}>
                Ovo polje je obavezno.
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium">Način plaćanja</h2>
            <div className={`mt-5 flex flex-col gap-1 bg-gray px-8 py-10`}>
              {(payment_options ?? [])?.map(({ id, name }) => {
                return (
                  <div className={`flex items-center gap-3 pl-2.5`} key={id}>
                    <input
                      type={`radio`}
                      className="peer hidden"
                      name={`payment_method`}
                      id={`payment_method_${id}`}
                      value={id}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        });
                        setErrors(
                          errors?.filter((error) => error !== "payment_method"),
                        );
                      }}
                    />
                    <label
                      htmlFor={`payment_method_${id}`}
                      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-black bg-white peer-checked:bg-primary"
                    ></label>
                    <label
                      htmlFor={`payment_method_${id}`}
                      className={`cursor-pointer text-[0.965rem] font-light ${className}`}
                    >
                      {name}
                    </label>
                  </div>
                );
              })}
            </div>
            {errors?.includes("payment_method") && (
              <div className={`mt-1 text-xs text-red-500`}>
                Ovo polje je obavezno.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutOptions;

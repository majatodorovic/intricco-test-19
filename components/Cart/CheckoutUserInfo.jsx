import {
  Form,
  handleInputChange,
  handleSubmit,
} from "@/_components/shared/form";
import billing from "./billing.json";

const CheckoutUserInfo = ({
  selected,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const onChange = (e, use_same_data, setFormData, setErrors) => {
    switch (true) {
      case use_same_data:
        {
          const { value: typed_value, name } = e?.target || {};
          Object?.entries(formData)?.forEach(() => {
            if (name?.includes("billing")) {
              let shipping_key = name?.replace("billing", "shipping");
              setFormData((prev) => ({
                ...prev,
                [name]: typed_value,
                [shipping_key]: typed_value,
              }));
            }
          });
          setErrors((prev) => prev.filter((error) => error !== name));
        }
        break;
      case !use_same_data:
        return handleInputChange(e, setFormData, setErrors);
    }
  };

  return (
    <div className={`col-span-2 flex w-full flex-col gap-6 lg:col-span-1`}>
      <Form
        errors={errors}
        data={formData}
        handleInputChange={(e) => {
          onChange(e, selected?.use_same_data, setFormData, setErrors);
        }}
        buttonClassName={`!hidden`}
        handleSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, formData, setFormData, () => {}, billing, setErrors);
        }}
        fields={billing}
        showOptions={false}
        isPending={false}
        fieldLayout="grid grid-cols-4 gap-6 !mt-0 max-sm:[&>div]:col-span-4"
      />
    </div>
  );
};

export default CheckoutUserInfo;

"use client";
import { useState } from "react";
import { Form } from "@/_components/shared/form/form";
import { useAddReviewMark } from "@/hooks/productReviews.hooks";
import { convertFileToBase64 } from "@/helpers/convertFileToBase64";
import formFields from "../_jsons/formFields.json";

const ProductMarkForm = ({ id_product, marksOptions }) => {
  // Initial form data structure
  const defaultFormData = {
    name: "Aleksandar",
    email: "tigarriba@gmail.com",
    message: "",
    saveInfo: false,
    rating: false,
    mark_images: [],
    mark_videos: [],
    is_anonymous: 0,
  };
  const [submitedMarks, setSubmitedMarks] = useState(false);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState([]);
  const { mutate: addReviewMark, isPending } = useAddReviewMark();

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = [];
    if (!formData.message) {
      newErrors.push("message");
    } else if (formData.message.length > 511) {
      newErrors.push("message");
    }
    if (!formData.rating) newErrors.push("rating");
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert media files to Base64
    const [base64Images, base64Video] = await Promise.all([
      convertFileToBase64(formData.mark_images),
      convertFileToBase64(formData.mark_videos),
    ]);

    if (base64Images && base64Video) {
      addReviewMark(
        {
          id_product,
          email: formData.email,
          name: formData.name,
          mark: formData.rating,
          comment: formData.message,
          title: null,
          images: base64Images,
          videos: base64Video,
          is_anonymous: formData.is_anonymous,
        },
        {
          onSuccess: () => {
            resetForm();
            setSubmitedMarks(true);
          },
          onError: () => resetForm(),
        }
      );
    }
  };

  // Reset the form to its default state
  const resetForm = () => {
    setFormData({ ...defaultFormData });
    setErrors([]);
  };

  return (
    <>
      {submitedMarks ? (
        <div className="flex items-center justify-center h-full">
          <div
            className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
            role="alert"
          >
            <span className="font-medium">Hvala Vam za ostavljenu ocenu</span>
          </div>
        </div>
      ) : (
        <Form
          className="w-full"
          handleSubmit={handleSubmit}
          fields={formFields.map((field) =>
            field.name == "rating" ? { ...field, options: marksOptions } : field
          )}
          data={formData}
          errors={errors}
          isPending={isPending}
          handleInputChange={handleInputChange}
          button_text="Submit mark"
          buttonClassName="mt-0 !w-[180px] uppercase"
        />
      )}
    </>
  );
};

export default ProductMarkForm;

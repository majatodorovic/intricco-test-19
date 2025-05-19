"use client";
import React, { useState } from "react";
import { Form } from "@/_components/shared/form/form";
import { useAddReviewComment } from "@/hooks/productReviews.hooks";
import { convertFileToBase64 } from "@/helpers/convertFileToBase64";
import formFields from "./jsonData/addProductCommentFormFields";

/**
 * Component for submitting a product review with a comment, and optional media files.
 *
 * @param {string} props.id_product - The ID of the product being reviewed.
 */
const AddProductCommentsForm = ({ id_product }) => {
  // Initial form data structure
  const defaultFormData = {
    name: "",
    email: "",
    message: "",
    saveInfo: false,
    comment_images: [],
    comment_videos: [],
    is_anonymous: 0,
  };

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState([]);
  const { mutate: addReviewComment, isPending } = useAddReviewComment();

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
    if (!formData.name) newErrors.push("name");
    if (!formData.email) newErrors.push("email");
    if (!formData.message) {
      newErrors.push("message");
    } else if (formData.message.length > 511) {
      newErrors.push("message");
    }
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
      convertFileToBase64(formData.comment_images),
      convertFileToBase64(formData.comment_videos),
    ]);

    if (base64Images && base64Video) {
      addReviewComment(
        {
          id_product,
          email: formData.email,
          name: formData.name,
          comment: formData.message,
          title: null,
          images: base64Images,
          videos: base64Video,
          is_anonymous: formData.is_anonymous,
        },
        {
          onSuccess: () => resetForm(),
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
    <div className="max-md:mt-[1.01rem] mt-[3rem] max-md:w-[95%] max-md:mx-auto mx-[3rem]">
      <h2 className="text-[1.5rem] font-bold max-md:text-[1.1rem] mb-4">
        Leave a comment
      </h2>

      <Form
        handleSubmit={handleSubmit}
        fields={formFields}
        data={formData}
        errors={errors}
        isPending={isPending}
        handleInputChange={handleInputChange}
        button_text="Submit comment"
        className="py-4"
        buttonClassName="mt-0 !w-[180px] uppercase"
      />
    </div>
  );
};

export default AddProductCommentsForm;

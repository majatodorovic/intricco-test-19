import React, { useState } from "react";
import { Form } from "@/_components/shared/form/form";
import { useAddReplayOnReviewQuestion } from "@/hooks/productReviews.hooks";
import formFields from "./jsonData/replyOnProductFormFields";

/**
 * Component for submitting a reply to a product review question.
 *
 * @param {string} props.id - The review ID to which the reply is being added.
 * @param {Function} props.setActiveReply - Function to toggle the active reply state.
 * @param {string|null} props.activeReply - Currently active reply ID.
 */
const ReplyOnProductQuestionForm = ({ id, setActiveReply, activeReply }) => {
  // Initial form data structure
  const defaultFormData = {
    id,
    name: "",
    email: "",
    comment: "",
  };

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState([]);
  const { mutate: addReplayOnReviewQuestion, isPending } =
    useAddReplayOnReviewQuestion();

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = [];
    if (!formData.name) newErrors.push("name");
    if (!formData.email) newErrors.push("email");
    if (!formData.comment) newErrors.push("comment");
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    addReplayOnReviewQuestion(
      {
        id,
        email: formData.email,
        name: formData.name,
        comment: formData.comment,
      },
      {
        onSuccess: () => resetForm(),
        onError: () => resetForm(),
      }
    );
  };

  // Reset the form to its default state
  const resetForm = () => {
    setFormData({ ...defaultFormData });
    setErrors([]);
    setActiveReply(activeReply === id ? null : id);
  };

  return (
    <div className="rounded-lg">
      <Form
        handleSubmit={handleSubmit}
        fields={formFields}
        data={formData}
        errors={errors}
        isPending={isPending}
        handleInputChange={handleInputChange}
        button_text="Submit answer"
        className=""
        buttonClassName="mt-3 !w-[180px] uppercase"
      />
    </div>
  );
};

export default ReplyOnProductQuestionForm;

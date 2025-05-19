"use client";
import { useMutation } from "@tanstack/react-query";
import { post as POST } from "@/api/api";
import { toast } from "react-toastify";

const toastConfiguration = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const handleSuccess = (res) => {
  switch (res?.code) {
    case 200:
      toast.success(res?.payload?.message, { ...toastConfiguration });
      break;
    default: {
      const message = res?.payload?.message
        ? res?.payload?.message
        : res?.message
        ? res?.message
        : "Došlo je do greške.";
      toast.error(message, { ...toastConfiguration });
      return "ERROR";
    }
  }
};

const handleError = (error) => {
  return error;
};

export const useAddReviewMark = () => {
  return useMutation({
    mutationKey: ["addReviewMarks"],
    mutationFn: async (data) => {
      return await POST(
        `/product-details/reviews/marks?form_section=product_review_marks`,
        {
          ...data,
          positive_comment: data.positive_comment || null,
          negative_comment: data.negative_comment || null,
        }
      );
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useLikeReviewMark = () => {
  return useMutation({
    mutationKey: ["likeReviewMark"],
    mutationFn: async ({ id }) => {
      return await POST(`/product-details/reviews/marks/like`, { id });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useDislikeReviewMark = () => {
  return useMutation({
    mutationKey: ["dislikeReviewMark"],
    mutationFn: async ({ id }) => {
      return await POST(`/product-details/reviews/marks/dislike`, { id });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useAddReplayOnReviewMark = () => {
  return useMutation({
    mutationKey: ["addReplayOnReviewMark"],
    mutationFn: async ({ id, name, email, comment }) => {
      return await POST(`/product-details/reviews/marks/reply`, {
        id,
        name,
        email,
        comment,
        is_anonymous: 0,
      });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useAddReviewComment = () => {
  return useMutation({
    mutationKey: ["addReviewComment"],
    mutationFn: async (data) => {
      return await POST(
        `/product-details/reviews/comments?form_section=product_review_comments`,
        {
          ...data,
          positive_comment: data.positive_comment || null,
          negative_comment: data.negative_comment || null,
        }
      );
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useLikeReviewComment = () => {
  return useMutation({
    mutationKey: ["likeReviewComment"],
    mutationFn: async ({ id }) => {
      return await POST(`/product-details/reviews/comments/like`, { id });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useDislikeReviewComment = () => {
  return useMutation({
    mutationKey: ["dislikeReviewComment"],
    mutationFn: async ({ id }) => {
      return await POST(`/product-details/reviews/comments/dislike`, { id });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useAddReplayOnReviewComment = () => {
  return useMutation({
    mutationKey: ["addReplayOnReviewComment"],
    mutationFn: async ({ id, name, email, comment }) => {
      return await POST(`/product-details/reviews/comments/reply`, {
        id,
        name,
        email,
        comment,
        is_anonymous: 0,
      });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useAddReviewQuestion = () => {
  return useMutation({
    mutationKey: ["addReviewQuestion"],
    mutationFn: async (data) => {
      return await POST(
        `/product-details/reviews/questions-and-answers?form_section=product_review_questions_and_answers`,
        {
          ...data,
          positive_comment: data.positive_comment || null,
          negative_comment: data.negative_comment || null,
        }
      );
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useLikeReviewQuestion = () => {
  return useMutation({
    mutationKey: ["likeReviewQuestion"],
    mutationFn: async ({ id }) => {
      return await POST(`/product-details/reviews/questions-and-answers/like`, {
        id,
      });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useDislikeReviewQuestion = () => {
  return useMutation({
    mutationKey: ["dislikeReviewQuestion"],
    mutationFn: async ({ id }) => {
      return await POST(
        `/product-details/reviews/questions-and-answers/dislike`,
        { id }
      );
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

export const useAddReplayOnReviewQuestion = () => {
  return useMutation({
    mutationKey: ["addReplayOnReviewQuestion"],
    mutationFn: async ({ id, name, email, comment }) => {
      return await POST(
        `/product-details/reviews/questions-and-answers/reply`,
        {
          id,
          name,
          email,
          comment,
          is_anonymous: 0,
        }
      );
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};

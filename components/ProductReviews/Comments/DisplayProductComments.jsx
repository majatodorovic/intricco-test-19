"use client";
import React, { useState, useMemo, useEffect } from "react";
import ReplyOnProductCommentForm from "./Form/ReplyOnProductCommentForm";
import { useSuspenseQuery } from "@tanstack/react-query";
import { list as LIST } from "@/api/api";
import {
  useLikeReviewComment,
  useDislikeReviewComment,
} from "@/hooks/productReviews.hooks";
import {
  DisplayMedia,
  DisplayReplies,
  DisplayUserActions,
  DisplayLoadMoreReviews,
  ReviewsImageGallery,
  SortBy,
} from "../_components";
import { formatDate } from "@/helpers/convertDate";
import { ReadMoreText } from "@/components/displayText";
import { getMediaList } from "../helpers/index";

/**
 * Component to display product comments with functionalities to like, dislike, reply, and view replies.
 * @param {string} props.id_product - Product ID for fetching comments and related data.
 */
const DisplayProductComments = ({ id_product }) => {
  const [activeReply, setActiveReply] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeReplies, setActiveReplies] = useState([]);
  const [sort, setSort] = useState({ field: "new", direction: "desc" });

  // Fetch reviews for the product
  const { data } = useSuspenseQuery({
    queryKey: ["productCommentList", id_product, sort.field],
    queryFn: async () => {
      const response = await LIST(
        `product-details/reviews/comments/${id_product}?page=1`,
        {
          limit: 5,
          sort: {
            field: `${sort.field ? sort.field : ""}`,
            direction: `${sort.direction ? sort.direction : ""}`,
          },
        }
      );

      return response?.payload;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) setReviews(data);
  }, [data]);

  // Handler for sort data
  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  // Hooks for liking and disliking comment
  const { mutate: likeReviewComment } = useLikeReviewComment();
  const { mutate: dislikeReviewComment } = useDislikeReviewComment();

  // Fetch replies for a specific review
  const fetchReplies = async (productID, commentID, page) => {
    const response = await LIST(
      `product-details/reviews/comments/${productID}/${commentID}/replies?page=${page}`
    );
    return response?.payload || [];
  };

  // Render individual reviews
  const renderedReviews = useMemo(() => {
    return (
      <>
        {reviews &&
          reviews.items &&
          reviews.items.length > 0 &&
          reviews.items.map((review) => {
            const currentReply = activeReplies.find(
              (reply) => reply.id === review.id
            );
            const medias = getMediaList(review);

            return (
              <div key={review.id} className="mb-6">
                <h3 className="font-semibold mb-2">{review.display_name}</h3>
                <ReadMoreText text={review.display_comment} maxLength={250} />

                <p className="text-gray-700 text-[12px] mb-2">
                  Datum: {formatDate(review.created_at)}
                </p>
                {medias.length > 0 && <DisplayMedia medias={medias} />}

                {review.total_replies > 0 && (
                  <DisplayReplies
                    fetchReplies={fetchReplies}
                    currentReply={currentReply}
                    review={review}
                    activeReplies={activeReplies}
                    setActiveReplies={setActiveReplies}
                    id_product={id_product}
                  />
                )}

                <DisplayUserActions
                  activeReply={activeReply}
                  setActiveReply={setActiveReply}
                  reviews={reviews}
                  review={review}
                  setReviews={setReviews}
                  likeAction={likeReviewComment}
                  dislikeAction={dislikeReviewComment}
                />

                {activeReply === review.id && (
                  <ReplyOnProductCommentForm
                    id={review.id}
                    activeReply={activeReply}
                    setActiveReply={setActiveReply}
                  />
                )}

                <hr className="mt-6" />
              </div>
            );
          })}

        {reviews &&
          reviews.pagination &&
          reviews.pagination.total_pages > reviews.pagination.selected_page && (
            <DisplayLoadMoreReviews
              reviews={reviews}
              setReviews={setReviews}
              sort={sort}
              api={`product-details/reviews/comments/${id_product}`}
            />
          )}
      </>
    );
  }, [reviews, activeReply, activeReplies]);

  return (
    <div className="max-md:w-[95%] max-md:mx-auto mx-[3rem] mt-12">
      <h2 className="text-[1.5rem] font-bold max-md:text-[1.1rem] mb-4">
        Comments
      </h2>
      <div className="w-full grid grid-cols-1 gap-6">
        <div>
          <ReviewsImageGallery
            api={`/product-details/reviews/comments/files/${id_product}`}
          />
          <SortBy handleSortChange={handleSortChange} sort={sort} />
          <hr className="my-8" />
          {renderedReviews}
        </div>
      </div>
    </div>
  );
};

export default DisplayProductComments;

"use client";
import React, { useState, useMemo, useEffect } from "react";
import ReplyOnProductReviewMarkForm from "./Form/ReplyOnProductReviewMarkForm";
import { useSuspenseQuery } from "@tanstack/react-query";
import { list as LIST } from "@/api/api";
import {
  useLikeReviewMark,
  useDislikeReviewMark,
} from "@/hooks/productReviews.hooks";
import {
  DisplayMedia,
  DisplayStars,
  DisplayReplies,
  DisplayUserActions,
  DisplayLoadMoreReviews,
  SortBy,
  ReviewsImageGallery,
} from "../_components";
import { formatDate } from "@/helpers/convertDate";
import { ReadMoreText } from "@/components/displayText";
import MarksSummary from "./MarksSummary";
import { getMediaList } from "../helpers/index";

/**
 * Component to display product reviews with functionalities to like, dislike, reply, and view replies.
 * @param {string} id_product - Product ID for fetching reviews and related data.
 * @param {array} marksOptions - marks options
 */
const DisplayReviewMarks = ({ id_product, marksOptions }) => {
  const [activeReply, setActiveReply] = useState(null);
  const [reviews, setReviews] = useState();
  const [activeReplies, setActiveReplies] = useState([]);
  const [sort, setSort] = useState({ field: "new", direction: "desc" });

  // Fetch reviews for the product
  const { data } = useSuspenseQuery({
    queryKey: ["reviewsMarksList", id_product, sort.field],
    queryFn: async () => {
      const response = await LIST(
        `product-details/reviews/marks/${id_product}?page=1`,
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

  // Hooks for liking and disliking reviews
  const { mutate: likeReviewMark } = useLikeReviewMark();
  const { mutate: dislikeReviewMark } = useDislikeReviewMark();

  // Fetch replies for a specific review
  const fetchReplies = async (productID, markID, page) => {
    const response = await LIST(
      `product-details/reviews/marks/${productID}/${markID}/replies?page=${page}`
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
                <div className="flex items-center mb-2">
                  <DisplayStars
                    mark={review.mark}
                    marksOptions={marksOptions}
                  />
                </div>
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
                  reviews={reviews}
                  review={review}
                  setReviews={setReviews}
                  likeAction={likeReviewMark}
                  dislikeAction={dislikeReviewMark}
                />

                {activeReply === review.id && (
                  <ReplyOnProductReviewMarkForm
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
              api={`product-details/reviews/marks/${id_product}`}
            />
          )}
      </>
    );
  }, [reviews, activeReply, activeReplies]);

  return (
    <div className="max-md:w-[95%] max-md:mx-auto mx-[3rem] mt-12">
      <h2 className="text-[1.5rem] font-bold max-md:text-[1.1rem] mb-4">
        Marks
      </h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <MarksSummary id_product={id_product} marksOptions={marksOptions} />

        <div>
          <ReviewsImageGallery
            api={`/product-details/reviews/marks/files/${id_product}`}
          />
          <SortBy handleSortChange={handleSortChange} sort={sort} />
          <hr className="my-8" />
          {renderedReviews}
        </div>
      </div>
    </div>
  );
};

export default DisplayReviewMarks;

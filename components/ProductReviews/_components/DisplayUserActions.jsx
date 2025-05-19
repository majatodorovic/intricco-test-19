import { useState } from "react";

/**
 * Component for displaying user actions (like, dislike, and reply) for a review.
 *
 * @param {boolean|number} [activeReply=false] - Currently active reply ID, or false if none.
 * @param {function|boolean} [setActiveReply=false] - Function to set the active reply.
 * @param {Object} reviews - Current reviews data, including items and pagination.
 * @param {Object} review - Individual review data with ID and likes/dislikes count.
 * @param {function} setReviews - Function to update the reviews state.
 * @param {function} likeAction - Function to handle the "like" action.
 * @param {function} dislikeAction - Function to handle the "dislike" action.
 *
 * Manages liking, disliking, and toggling reply input for a specific review.
 */

const DisplayUserActions = ({
  activeReply = false,
  setActiveReply = false,
  reviews,
  review,
  setReviews,
  likeAction,
  dislikeAction,
}) => {
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  return (
    <div className="flex items-center mb-2 mt-4">
      <button
        className="text-gray-500 text-sm"
        onClick={() => {
          if (isProcessingAction) return;
          setIsProcessingAction(true);
          likeAction(
            { id: review.id },
            {
              onSuccess: (e) => {
                if (e.success === false) return;

                const updatedItems = reviews.items.map((item) =>
                  item.id === review.id
                    ? {
                        ...item,
                        ...{ total_likes: item.total_likes + 1 },
                      }
                    : item
                );
                setReviews({
                  items: updatedItems,
                  pagination: reviews.pagination,
                });

                setIsProcessingAction(false);
              },
              onError: setIsProcessingAction(false),
            }
          );
        }}
      >
        👍 ({review.total_likes || 0})
      </button>
      <button
        className="text-gray-500 text-sm ml-2"
        onClick={() => {
          if (isProcessingAction) return;
          setIsProcessingAction(true);
          dislikeAction(
            { id: review.id },
            {
              onSuccess: (e) => {
                if (e.success === false) return;

                const updatedItems = reviews.items.map((item) =>
                  item.id === review.id
                    ? {
                        ...item,
                        ...{ total_dislikes: item.total_dislikes + 1 },
                      }
                    : item
                );
                setReviews({
                  items: updatedItems,
                  pagination: reviews.pagination,
                });

                setIsProcessingAction(false);
              },
              onError: setIsProcessingAction(false),
            }
          );
        }}
      >
        👎 ({review.total_dislikes || 0})
      </button>
      {setActiveReply && (
        <p
          className="text-gray-500 text-sm ml-3 cursor-pointer hover:underline"
          onClick={() =>
            setActiveReply(activeReply === review.id ? null : review.id)
          }
        >
          Reply
        </p>
      )}
    </div>
  );
};

export default DisplayUserActions;

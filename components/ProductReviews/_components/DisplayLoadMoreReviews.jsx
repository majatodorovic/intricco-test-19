import { list as LIST } from "@/api/api";

/**
 * Component for rendering a "Load More" button to fetch and append more reviews.
 *
 * @param {Object} reviews - Current reviews data, including items and pagination.
 * @param {function} setReviews - Function to update the reviews state.
 * @param {string} api - API endpoint for fetching more reviews.
 *
 * Functionality:
 * - Fetches additional reviews from the API when the button is clicked.
 * - Appends new reviews to the current list if the next page exists.
 * - Updates the reviews state with the newly fetched reviews and updated pagination.
 */

const DisplayLoadMoreReviews = ({ reviews, setReviews, api, sort }) => {
  return (
    <div className="mt-2 flex justify-center">
      <button
        className="mt-5 text-gray-500 border border-gray-500 rounded px-2 py-1 text-sm"
        onClick={async () => {
          const newReviewsList = await LIST(
            `${api}?page=${reviews.pagination.selected_page + 1}`,
            {
              limit: 5,
              sort: {
                field: `${sort.field ? sort.field : ""}`,
                direction: `${sort.direction ? sort.direction : ""}`,
              },
            }
          );

          if (newReviewsList?.payload) {
            if (
              newReviewsList.payload.pagination.selected_page >
              reviews.pagination.selected_page
            ) {
              const newItems = newReviewsList?.payload?.items || [];
              const items = [...reviews.items, ...newItems];

              setReviews({
                items,
                pagination: newReviewsList?.payload.pagination,
              });
            }
          }
        }}
      >
        Load more
      </button>
    </div>
  );
};

export default DisplayLoadMoreReviews;

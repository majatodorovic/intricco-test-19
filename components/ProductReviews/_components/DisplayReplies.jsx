/**
 * Component for rendering and managing replies for a specific review.
 *
 * @param {function} fetchReplies - Function to fetch replies for a given review.
 * @param {Object|null} currentReply - Current reply data for the active review.
 * @param {Object} review - Review data, including ID and total replies count.
 * @param {Array} activeReplies - Array of all currently active replies with their state.
 * @param {function} setActiveReplies - Function to update the state of active replies.
 * @param {string|number} id_product - The product ID associated with the reviews.
 *
 * Handles toggling reply visibility, fetching new replies if needed, and supporting paginated reply loading.
 */


const DisplayReplies = ({
  fetchReplies,
  currentReply,
  review,
  activeReplies,
  setActiveReplies,
  id_product,
}) => {
  // Toggle replies for a specific review
  const handleViewReplies = async (reviewId, page = 1) => {
    const existingReply = activeReplies.find((reply) => reply.id === reviewId);

    if (existingReply) {
      setActiveReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.id === reviewId ? { ...reply, opened: !reply.opened } : reply
        )
      );
    } else {
      const replies = await fetchReplies(id_product, reviewId, page);
      setActiveReplies((prevReplies) => [
        ...prevReplies,
        { ...replies, id: reviewId, opened: true },
      ]);
    }
  };

  return (
    <>
      <button
        className="text-gray-500 text-sm ml-10"
        onClick={() => handleViewReplies(review.id)}
      >
        {currentReply && currentReply.opened
          ? `Hide replies (${review.total_replies})`
          : `View replies (${review.total_replies})`}
      </button>
      {currentReply && currentReply.opened && (
        <div className="reply mb-2 pl-10 md:mr-[70px] max-h-[380px] overflow-x-auto customScroll">
          {currentReply.items.map((reply) => (
            <div key={reply.id} className="mt-2 pr-2">
              <h3 className="text-sm font-semibold">{reply.name}</h3>
              <p
                className="text-gray-700 text-sm"
                dangerouslySetInnerHTML={{
                  __html: reply.comment,
                }}
              ></p>
              <hr className="mt-3" />
            </div>
          ))}
          {currentReply &&
            currentReply.pagination &&
            currentReply.pagination.total_pages >
              currentReply.pagination.selected_page && (
              <div className="mt-2 flex justify-center">
                <button
                  className="mt-5 text-gray-500 border border-gray-500 rounded px-2 py-1 text-sm"
                  onClick={async () => {
                    const replies = await fetchReplies(
                      id_product,
                      review.id,
                      currentReply.pagination.selected_page + 1
                    );
                    const updatedActiveReplies = activeReplies.map(
                      (activeReply) => {
                        if (activeReply.id === review.id) {
                          let items = [...activeReply.items, ...replies.items];

                          return {
                            ...activeReply,
                            items,
                            pagination: replies.pagination,
                          };
                        }
                        return activeReply;
                      }
                    );

                    setActiveReplies(updatedActiveReplies);
                  }}
                >
                  Load more replies
                </button>
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default DisplayReplies;

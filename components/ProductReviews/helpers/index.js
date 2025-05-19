/**
 * Function to extract a list of media (images and videos) from a review object.
 * @param {Object} review - The review object containing media data.
 *
 * Example of returned output:
 * [
 *   { url: 'image1.jpg', type: 'image' },
 *   { url: 'video1.mp4', type: 'video' }
 * ]
 */
export const getMediaList = (review) => {
  let medias = [];
  if (review.images?.urls) {
    const imageList = review.images?.urls.map((url) => ({
      url,
      type: "image",
    }));
    medias = [...medias, ...imageList];
  }
  if (review.videos?.urls) {
    const videoList = review.videos?.urls.map((url) => ({
      url,
      type: "video",
    }));
    medias = [...medias, ...videoList];
  }

  return medias;
};

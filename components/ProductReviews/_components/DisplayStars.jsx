/**
 * Component for rendering a star rating display.
 *
 * @param {number|string} props.mark - The rating value used to render stars.
 * @param {array} marksOptions - Mark options
 */
const DisplayStars = ({ mark, marksOptions = [1, 2, 3, 4, 5] }) => {
  const parsedMark = parseFloat(mark);

  return marksOptions.map((star) => {
    if (parsedMark >= star) {
      return (
        <span key={star} className="text-2xl text-yellow-500">
          ★
        </span>
      );
    } else if (parsedMark > star - 1 && parsedMark < star) {
      return (
        <span key={star} className="text-2xl text-gray-300 relative">
          <span
            className="absolute inset-0 text-yellow-500 overflow-hidden"
            style={{ width: "50%" }}
          >
            ★
          </span>
          <span className="text-gray-300">★</span>
        </span>
      );
    } else {
      return (
        <span key={star} className="text-2xl text-gray-300">
          ★
        </span>
      );
    }
  });
};

export default DisplayStars;

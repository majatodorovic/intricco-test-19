import Image from "next/image";

/**
 * Component for rendering media items (images and videos).
 *
 * @param {Array} props.medias - Array of media objects to be displayed.
 * @param {string} props.medias[].type - Type of the media item ('image' or 'video').
 * @param {string} props.medias[].url - URL of the media item.
 */

const DisplayMedia = ({ medias }) => {
  return (
    <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
      {medias.map((item, index) => (
        <div key={index} className="mb-2 relative">
          {item.type === "image" ? (
            <Image
              fill
              src={item.url}
              alt={item.url}
              className="max-w-full border rounded-md object-cover !relative"
            />
          ) : (
            <video
              controls
              src={item.url}
              className="max-w-full border rounded-md h-[100px]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayMedia;

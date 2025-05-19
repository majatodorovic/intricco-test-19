"use client";
import { formatDate } from "@/helpers/convertDate";

const DigitalMaterialList = ({ digitalMaterial }) => {
  if (digitalMaterial.items.length === 0) {
    return (
      <div className={`max-sm:w-[95%] mt-10 sm:mx-[3rem] mx-auto`}>
        <p className="text-center">Nema digitalnih materijala</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-sm:w-[95%] mt-10 sm:mx-[3rem] mx-auto`}
    >
      {digitalMaterial.items &&
        digitalMaterial.items.map((item) => {
          return (
            <div key={item.id}>
              <h3 className={`text-xl`}>{item.title}</h3>
              {item._details.download_file_path &&
                (item._details.download_file_path.startsWith("data:video/") ? (
                  <video controls className="w-full h-auto mt-4">
                    <source
                      src={item._details.download_file_path}
                      type="video/mp4"
                    />
                    Vaš pregledač ne podržava video tag.
                  </video>
                ) : (
                  <a
                    href={item._details.download_file_path}
                    download
                    className="text-blue-500 hover:underline"
                  >
                    Preuzmi dokument
                  </a>
                ))}
              <p className={`text-sm mt-2 mb-4 text-gray-500`}>
                {item.short_description &&
                  `Kratak opis: ${item.short_description}`}
                {item.short_description}
              </p>
              <p className="text-gray-700 mb-2">
                {item.description && `Opis: ${item.description}`}
              </p>
              <p className="text-gray-700 mb-2">
                {item.expiration_date &&
                  `Ističe: ${formatDate(item.expiration_date)}`}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default DigitalMaterialList;

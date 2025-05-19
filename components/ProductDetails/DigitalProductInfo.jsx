import { useState } from "react";
import { Table as SharedTable } from "@/_pages/account/account-data/shared";
import { ModalFrame } from "@/_components/shared/modal";
import { get } from "@/api/api";
import { formatDate } from "@/helpers/convertDate";
import Link from "next/link";

const DigitalProductInfo = ({
  digital_product,
  className = "md:max-w-[85%]",
}) => {
  if (!digital_product || digital_product?.items?.length < 1) return <></>;

  const [displayModal, setDisplayModal] = useState({
    display: false,
  });
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

  const items = digital_product.items.map((item) =>
    item.description || item.has_sample
      ? { ...item, disabled: false }
      : { ...item, disabled: true }
  );

  return (
    <>
      <SharedTable
        className={className}
        data={items}
        fields={[
          {
            id: "titleID",
            name: "title",
            placeholder: "Title",
            type: "text",
          },
          {
            id: "descriptionID",
            name: "description",
            placeholder: "Description",
            type: "set_short_text",
            required: false,
          },
          {
            id: 12,
            name: "actions",
            placeholder: "Detaljno",
            type: "actions",
            actions: "eyeopen",
          },
        ]}
        onClick={async (action, row) => {
          if (action === "eyeopen") {
            if (row.disabled) return;

            const digitalProductDetails = await get(
              `/product-details/digital-material/${row.id}`
            ).then((res) => {
              return res?.payload;
            });

            if (digitalProductDetails) {
              const {
                title,
                description,
                expiration_date,
                number_of_downloads,
                shareable,
                short_description,
                sample_file_path,
                sample_link_path,
              } = digitalProductDetails;

              setDisplayModal({
                title,
                description,
                expiration_date,
                number_of_downloads,
                shareable,
                short_description,
                sample_file_path,
                sample_link_path,
                display: true,
              });
            }
          }
        }}
      />
      <ModalFrame
        handleClose={() =>
          setDisplayModal({
            display: false,
          })
        }
        display={displayModal?.display}
      >
        {displayModal.display && (
          <div>
            <h3 className={`text-xl`}>{displayModal?.title}</h3>
            <p className={`text-sm mt-2 mb-4 text-gray-500`}>
              {displayModal?.short_description &&
                `Kratak opis: ${displayModal?.short_description}`}
              {displayModal?.short_description}
            </p>
            <p className="text-gray-700 mb-2">
              {displayModal?.description &&
                `Opis: ${displayModal?.description}`}
            </p>
            <p className="text-gray-700 mb-2">
              {displayModal?.expiration_date &&
                `Ističe: ${formatDate(displayModal?.expiration_date)}`}
            </p>

            {displayModal?.sample_file_path &&
              (videoExtensions.some((ext) =>
                displayModal.sample_file_path.toLowerCase().endsWith(ext)
              ) ? (
                <video controls className="w-full h-auto mt-4">
                  <source
                    src={displayModal.sample_file_path}
                    type="video/mp4"
                  />
                  Vaš pregledač ne podržava video tag.
                </video>
              ) : (
                <Link
                  className="text-blue-700"
                  target="_blank"
                  href={displayModal?.sample_file_path}
                >
                  Uzorak materijala
                </Link>
              ))}

            {displayModal?.sample_link_path && (
              <Link
                className="text-blue-700"
                target="_blank"
                href={displayModal?.sample_link_path}
              >
                Uzorak materijala
              </Link>
            )}
          </div>
        )}
      </ModalFrame>
    </>
  );
};

export default DigitalProductInfo;

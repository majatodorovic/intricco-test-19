import { useState } from "react";
import { get } from "@/api/api";
import { Table as SharedTable } from "@/_pages/account/account-data/shared";
import { ModalFrame } from "@/_components/shared/modal";
import { formatDate } from "@/helpers/convertDate";
import TailwindSpinner from "@/components/UI/TailwindSpinner";
import { toast } from "react-toastify";
import { ApiPagination } from "@/_components/pagination";

const Documents = ({ data }) => {
  const [displayModal, setDisplayModal] = useState({
    display: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative">
      {data && (
        <>
          {isLoading && <TailwindSpinner />}

          <SharedTable
            className={isLoading ? "opacity-50" : ""}
            data={data?.items}
            fields={[
              {
                id: "titleID",
                name: "title",
                placeholder: "Naslov",
                type: "text",
              },
              {
                id: "descriptionID",
                name: "description",
                placeholder: "Opis",
                type: "set_short_text",
              },
              {
                id: "expire_atID",
                name: "expire_at",
                placeholder: "Ističe",
                type: "date",
              },
              {
                id: "disabledID",
                name: "disabled",
                placeholder: "Isteklo",
                type: "YES_NO",
              },
              {
                id: 12,
                name: "actions",
                type: "actions",
                actions: "eyeopen",
              },
            ]}
            onClick={async (action, row) => {
              switch (action) {
                case "eyeopen":
                  {
                    if (row.disabled) return;

                    setIsLoading(true);

                    const detailsData = await get(
                      `/customers/digital-material/files/doc/${row.id}`
                    )
                      .then((res) => {
                        setIsLoading(false);
                        return res?.payload;
                      })
                      .catch((error) => {
                        toast.error(
                          error?.payload?.message ??
                            error?.message ??
                            "Nesto nije u redu. Pokusajte ponovo ili se javite servisu podrske.",
                          {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                          }
                        );
                        setIsLoading(false);
                      });

                    if (detailsData) {
                      const {
                        title,
                        short_description,
                        description,
                        expiration_date,
                        download_file_path,
                      } = detailsData;

                      setDisplayModal({
                        title,
                        short_description,
                        description,
                        expiration_date,
                        download_file_path,
                        display: true,
                      });
                    }
                  }
                  break;
                default:
                  break;
              }
            }}
          />
          <ApiPagination pagination={data?.pagination} />
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

                {displayModal.download_file_path &&
                  (displayModal.download_file_path.startsWith("data:video/") ? (
                    <video controls className="w-full h-auto mt-4">
                      <source
                        src={displayModal.download_file_path}
                        type="video/mp4"
                      />
                      Vaš pregledač ne podržava video tag.
                    </video>
                  ) : (
                    <a
                      href={displayModal.download_file_path}
                      download
                      className="text-blue-500 hover:underline"
                    >
                      Preuzmi dokument
                    </a>
                  ))}
              </div>
            )}
          </ModalFrame>
        </>
      )}
    </div>
  );
};

export default Documents;

"use client";
import { useState, useEffect } from "react";
import DigitalMaterialList from "./_components/DigitalMaterialList";
import { Loader } from "@/_pages/account/account-data/loader";
import {
  Form,
  handleInputChange,
  handleSubmit,
} from "@/_components/shared/form";
import { list, post } from "@/api/api";
import { toast } from "react-toastify";
import {
  getDataFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localstorage";

const fields = [
  {
    id: "pinID",
    name: "pin",
    placeholder: "",
    type: "text",
  },
];

const fetchItemDetails = async ({ orderToken, itemId, dataField }) => {
  try {
    const response = await post(
      `/checkout/digital-material/${orderToken}/${itemId}`,
      dataField
    );
    return response?.payload;
  } catch (error) {
    console.error("Error fetching item details", error);
    return null;
  }
};

const fetchDigitalMaterial = async ({ orderToken, dataField }) => {
  const res = await list(`/checkout/digital-material/${orderToken}`, dataField);

  if (!res.success) {
    return {
      error:
        res?.payload?.message ??
        res?.message ??
        "Nesto nije u redu. Pokusajte ponovo.",
    };
  }

  let items = res.payload.items;

  if (!Array.isArray(items)) {
    console.error("items is not an array:", items);
    items = Object.values(items);
  }

  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const _details = await fetchItemDetails({
        orderToken,
        itemId: item.id,
        dataField,
      });
      return _details ? { ...item, _details } : item;
    })
  );

  if (updatedItems) return { ...res.payload, items: updatedItems };
};

const DigitalMaterial = ({ params: { orderToken } }) => {
  const [dataField, setDataField] = useState({ pin: "" });
  const [errors, setErrors] = useState([]);
  const [isEnabledQuery, setIsEnabledQuery] = useState(false);
  const [digitalMaterial, setDigitalMaterial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Prepare everything for fetching digital data. Check if there is a pin in localStorage.
  useEffect(() => {
    const digitalPinFromLocalstorage = getDataFromLocalStorage("digitalPin");

    if (digitalPinFromLocalstorage) {
      setDataField({ pin: digitalPinFromLocalstorage });
    }
    setIsEnabledQuery(true);
  }, []);

  // fetch digital data after everything is ready
  useEffect(() => {
    const fetchData = async () => {
      if (!isEnabledQuery) return;

      setIsLoading(true);

      try {
        const updatedItems = await fetchDigitalMaterial({
          orderToken,
          dataField: dataField.pin === "" ? `` : dataField,
        });

        if (updatedItems) {
          setDigitalMaterial(updatedItems);
        }
      } catch (error) {
        console.error("Error fetching digital material list", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isEnabledQuery, orderToken]);

  const submitAction = async () => {
    setDigitalMaterial("LOADING");
    try {
      const updatedItems = await fetchDigitalMaterial({
        orderToken,
        dataField,
      });

      if (updatedItems) {
        if (updatedItems.error) {
          toast.error(updatedItems.error, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setDataField({ pin: "" });
          setDigitalMaterial(false);
          return;
        }
        saveToLocalStorage("digitalPin", `${dataField.pin}`);
        setDigitalMaterial(updatedItems);
      }
    } catch (error) {
      setDigitalMaterial(false);
      throw error;
    }
  };

  return (
    <div className="w-full px-6">
      <h1 className="mt-12 mb-12 text-[23px] md:text-[29px] font-normal text-center uppercase">
        Digitalni proizvodi
      </h1>

      {isLoading || !isEnabledQuery ? (
        <Loader />
      ) : (
        <>
          {(!digitalMaterial ||
            digitalMaterial === "LOADING" ||
            digitalMaterial.error) && (
            <>
              <p className="text-center">
                Za pristup digitalnom materijalu treba uneti PIN dobijen u
                mail-u.
              </p>

              <Form
                className={`flex justify-center items-center flex-col`}
                fieldLayout=""
                data={dataField}
                fields={fields}
                showOptions={false}
                errors={errors}
                isPending={digitalMaterial === "LOADING" ? true : false}
                button_text={"Posalji"}
                handleInputChange={(e) => {
                  handleInputChange(e, setDataField, setErrors);
                }}
                handleSubmit={(e) => {
                  handleSubmit(
                    e,
                    dataField,
                    setDataField,
                    submitAction,
                    fields,
                    setErrors
                  );
                }}
              />
            </>
          )}

          {digitalMaterial === "LOADING" && <Loader />}

          {digitalMaterial &&
            digitalMaterial !== "LOADING" &&
            !digitalMaterial.error && (
              <DigitalMaterialList digitalMaterial={digitalMaterial} />
            )}
        </>
      )}
    </div>
  );
};

export default DigitalMaterial;

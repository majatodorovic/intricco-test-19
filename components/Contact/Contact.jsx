"use client";
import { useCallback, useEffect, useState } from "react";
import {
  GoogleReCaptchaProvider as Provider,
  GoogleReCaptcha as ReCaptcha,
} from "react-google-recaptcha-v3";
import { post as POST } from "@/api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";
import { pushToDataLayer } from "@/_services/data-layer";


const Contact = ({ staticData, defaultMessage }) => {
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const productId = searchParams.get("id");
    if (productId) {
      setFormData((prev) => ({
        ...prev,
        message: `Potrebne informacije za proizvod ${productId}`,
      }));
    }
  }, []);

  const requiredFields = ["customer_name", "phone", "email", "message"];

  const verifyCaptcha = useCallback((token) => {
    setToken(token);
  }, []);

  const [formData, setFormData] = useState({
    page_section: "contact_page",
    customer_name: "",
    phone: "",
    email: "",
    message: defaultMessage ? defaultMessage : "",
    gcaptcha: token,
  });

  const handleChange = ({ target }) => {
    let err = [];
    err = errors.filter((error) => error !== target.name);
    setErrors(err);
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const errors = [];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(field);
      }
      setErrors(errors);
    });
    if (errors?.length > 0) {
      setLoading(false);
    } else {
      await POST("/contact/contact_page?form_section=contact_page", {
        ...formData,
        customer_name: `${formData.customer_name} ${formData.last_name}`,
        gcaptcha: token,
      }).then((res) => {
        if (res?.code === 200) {
          pushToDataLayer("contact", { email: formData.email });
          toast.success("Uspešno ste poslali poruku!", {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
          setFormData({
            page_section: "contact_page",
            customer_name: "",
            last_name: "",
            phone: "",
            email: "",
            message: "",
            gcaptcha: token,
          });
        } else {
          toast.error("Došlo je do greške! Pokušajte ponovo.", {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
        }
      });
    }
  };

  return (
    <Provider reCaptchaKey={process.env.CAPTCHAKEY}>
      <ReCaptcha onVerify={verifyCaptcha} />
      <div className="sectionWidth mt-10 grid min-h-[200px] grid-cols-1 items-start gap-x-10 gap-y-10 max-sm:px-1 lg:grid-cols-2">
        {/* Contact Form */}
        <form className="flex flex-grow flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* First Name */}
            <div className="relative">
              <input
                required
                type="text"
                value={formData.customer_name}
                name="customer_name"
                id="customer_name"
                onChange={handleChange}
                placeholder="Ime"
                className="mainInput"
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                required
                type="text"
                value={formData.last_name}
                name="last_name"
                id="last_name"
                onChange={handleChange}
                placeholder="Prezime"
                className="mainInput"
              />
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="relative">
              <input
                required
                type="text"
                value={formData.phone}
                name="phone"
                id="phone"
                onChange={handleChange}
                placeholder="Telefon"
                className="mainInput"
              />
            </div>
            <div className="relative">
              <input
                required
                type="email"
                value={formData.email}
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleChange}
                className={`mainInput`}
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              required
              name="message"
              id="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="PORUKA"
              className={`mainInput`}
            ></textarea>
          </div>

          <div className="w-full">
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={`${
                loading ? `bg-[#04b400]` : `bg-primary`
              } primaryButton w-full px-5 py-2`}
              disabled={loading}
            >
              {loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                "POŠALJITE PORUKU"
              )}
            </button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="mb-2 flex flex-col justify-between bg-gray p-14 max-sm:p-6">
          {staticData?.map((items, index) => {
            if (items?.type == "textarea") {
              const stuff = items?.content;
              const split = stuff.split("\n");
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-2 max-lg:justify-between lg:grid-cols-2"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium">{split[0]}</h2>
                    <a href={`tel:${split[1]}`}>{split[1]}</a>
                    <a href={`tel:${split[2]}`}>{split[2]}</a>
                    <a href={`tel:${split[3]}`}>{split[3]}</a>
                    <a href={`mailto:${split[4]}`}>{split[4]}</a>
                  </div>
                  <div className="ml-[0px] flex flex-col gap-1">
                    <h2 className="text-lg font-medium">{split[5]}</h2>
                    <p>{split[6]}</p>
                    <p>{split[7]}</p>
                    <p>{split[8]}</p>
                    <p>{split[9]}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </Provider>
  );
};

export default Contact;

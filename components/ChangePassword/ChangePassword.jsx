"use client";
import { useState } from "react";
import { post } from "@/api/api";
import { toast } from "react-toastify";
import Image from "next/image";

const ChangePassword = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [showChangedPassword, setShowChangedPassword] = useState(false);

  const [formData, setData] = useState({
    password: "",
    sent_mail: true,
  });

  const formChangeHandler = ({ target }) => {
    setData({ ...formData, [target.name]: target.value });
  };

  const sentMailHandler = ({ target }) => {
    setIsChecked(!isChecked);
    setData({ ...formData, [target.name]: !isChecked });
  };
  const submitHandler = () => {
    const ret = {
      password: formData?.password,
      sent_mail: formData?.sent_mail,
    };
    post("/customers/profile/reset-password", ret)
      .then((response) => {
        if (response?.code === 200) {
          toast.success("Uspešno ste resetovali šifru.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Greška.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
        if (response?.code === 500 || response?.code === 400) {
          toast.error(
            "Došlo je do nepoznate greške pri obrađivanju Vašeg zahteva.",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            },
          );
        }
      })
      .catch((error) => console.warn(error));
  };
  const togglePasswordVisibility = () => {
    setShowChangedPassword(
      (prevShowChangedPassword) => !prevShowChangedPassword,
    );
  };

  return (
    <div>
      <div className="mb-[2rem] flex min-h-[7rem] items-center justify-between rounded-lg bg-[#f8f8f8] p-[1.4rem] sm:w-[90%] md:min-w-[30rem]">
        <h1 className="text-3xl max-sm:ml-[4rem]">Izmena lozinke</h1>
      </div>
      <div className="mt-[3rem] flex w-full max-sm:justify-between md:w-[64%]">
        <input
          name="password"
          value={formData.password}
          onChange={formChangeHandler}
          type={showChangedPassword ? "text" : "password"}
          placeholder="Nova lozinka:"
          className="block border border-[#e0e0e0] py-[0.6rem] focus:border-[#e0e0e0] focus:outline-0 focus:ring-0 max-sm:flex-1 lg:w-full"
        />
        <button onClick={togglePasswordVisibility} className="ml-3">
          {showChangedPassword ? (
            <Image
              src={"/icons/hide-password.png"}
              alt="hide password"
              width={22}
              height={22}
            />
          ) : (
            <Image
              src={"/icons/show-password.png"}
              alt="show password"
              width={22}
              height={22}
            />
          )}
        </button>
      </div>
      <div className="mt-4">
        <input
          type="checkbox"
          name="sent_mail"
          id="sent_mail"
          checked={isChecked}
          onChange={sentMailHandler}
          className="mr-[0.4rem] rounded border text-green-500 focus:border-none focus:outline-none focus:ring-0"
        />
        <label htmlFor="sent_mail" className="ml-2 text-[14px]">
          Pošalji mi izmenjenu lozinku na mail.{" "}
        </label>
      </div>

      <button
        onClick={submitHandler}
        className="mt-[3rem] bg-croonus-2 px-[4rem] py-[0.8rem] text-white hover:bg-opacity-80 max-sm:px-[1rem]"
      >
        Potvrdite
      </button>
    </div>
  );
};

export default ChangePassword;

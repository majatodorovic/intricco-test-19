"use client";
import { useState } from "react";
import Image from "next/image";
import { post } from "@/api/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormHeader } from "@/_components/shared/form";

const ResetPasswordComponent = ({ token }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    pin: "",
    password: "",
    confirmPassword: "",
    token: token,
  });
  const required = ["pin", "password", "confirmPassword", "token"];
  const [errors, setErrors] = useState([]);

  const formChangeHandler = ({ target }) => {
    setErrors(errors.filter((item) => item != target.name));

    setFormData({ ...formData, [target.name]: target.value });
  };
  const formSubmitHandler = () => {
    const err = [];
    for (const key in formData) {
      const item = formData[key];
      if (required.includes(key) && (item === "" || item == null)) {
        err.push(key);
      }
    }

    if (err.length > 0) {
      setErrors(err);
    } else {
      if (formData["password"] !== formData["confirmPassword"]) {
        err.push("password", "confirmPassword");
        setErrors(err);
        toast.error(
          "Greška. Potvrđena lozinka se razlikuje od lozinke. Pokušajte ponovo.",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          },
        );
        return;
      }
      const ret = {
        pin: formData.pin,
        password: formData.password,
        token: formData.token,
      };

      post("/customers/sign-in/reset-password", ret)
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
            router.push("/login");
          } else {
            toast.error("Greška. Proverite da li ste uneli ispravne podatke.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
          if (response?.code === 500 || response?.code === 400) {
            toast.error("Greška. Proverite da li ste uneli ispravne podatke.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        })
        .catch((error) => console.warn(error));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((state) => !state);
  };

  return (
    <div className={`container mx-auto mt-5 px-2 md:mt-10 md:px-[2rem]`}>
      <div className={`mx-auto max-w-2xl border-gray bg-white p-5 shadow`}>
        <FormHeader title={`Resetujte lozinku`} />
        <div className="mb-[1.4rem] mt-5 flex flex-col">
          <input
            onChange={formChangeHandler}
            type="text"
            id="pin"
            name="pin"
            value={formData.pin}
            className={`h-[52px] text-black max-sm:text-sm ${
              errors.includes("pin")
                ? "border-red-500 focus:border-red-500"
                : "border-none focus:border-none"
            } bg-[#f5f5f6] focus:ring-0 max-xl:mx-3`}
            placeholder="PIN*"
          />
        </div>
        <div className="flex">
          <div className="relative mb-[1.4rem] flex flex-1 flex-col">
            <input
              onChange={formChangeHandler}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              className={`h-[52px] text-black max-sm:text-sm ${
                errors.includes("password")
                  ? "border-red-500 focus:border-red-500"
                  : "border-none focus:border-none"
              } bg-[#f5f5f6] focus:ring-0 max-xl:mx-3`}
              placeholder="Nova lozinka*"
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-4"
            >
              {showPassword ? (
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

          <div className="relative ml-[1.4rem] flex flex-1 flex-col">
            <input
              onChange={formChangeHandler}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.passwordconfirmed}
              className={`h-[52px] text-black max-sm:text-sm ${
                errors.includes("confirmPassword")
                  ? "border-red-500 focus:border-red-500"
                  : "border-none focus:border-none"
              } bg-[#f5f5f6] focus:ring-0 max-xl:mx-3`}
              placeholder="Potvrda lozinke*"
            />
            <button
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-4"
            >
              {showConfirmPassword ? (
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
        </div>
        <button
          onClick={formSubmitHandler}
          className="primaryButton w-full px-4 py-2"
        >
          Sačuvaj
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;

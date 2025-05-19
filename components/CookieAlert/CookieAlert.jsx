"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const CookieAlert = () => {
  const [cookiesAllowed, setCookiesAllowed] = useState(true);
  let cookiesExist = false;
  useEffect(() => {
    const isAllowedCookie = Cookies.get("cookiesAllowed");
    if (isAllowedCookie) cookiesExist = true;
    setCookiesAllowed(cookiesExist);
  }, [cookiesAllowed, cookiesExist]);
  return (
    <>
      {!cookiesAllowed && (
        <div className="fixed bottom-0 right-0 z-[1000] w-[40%] rounded-tl-2xl bg-white p-5 shadow-2xl max-lg:w-full max-lg:rounded-t-2xl">
          <div className="flex flex-row gap-2">
            <Image
              src={"/icons/cookie.png"}
              alt="Cookie"
              width={40}
              height={40}
              className="self-start object-contain"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-[12px] font-medium">
                Ova web stranica koristi kolačiće
              </h2>
              <p className="text-[9px]">
                Koristimo kolačiće(cookies) da bismo učinili da ova web stranica
                pravilno funkcioniše i da bismo mogli dalje da unapređujemo web
                lokaciju kako bismo poboljšali Vaše korisničko iskustvo,
                personalizovani sadržaj i oglase, omogućili funkcije društvenih
                medija i analizirali saobraćaj. Nastavljajući da koristite našu
                web stranicu, prihvatate upotrebu kolačića.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-between border border-[#f0f0f0] p-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-row gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="cookie"
                    id="obavezni"
                    defaultChecked={true}
                    className="h-3 w-3 rounded text-primary"
                  />
                  <label htmlFor="cookie" className="text-[11px]">
                    Obavezni
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="cookie"
                    id="Trajni"
                    defaultChecked={true}
                    className="h-3 w-3 rounded text-primary"
                  />
                  <label htmlFor="cookie" className="text-[11px]">
                    Trajni
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="cookie"
                    id="Statistika"
                    defaultChecked={true}
                    className="h-3 w-3 rounded text-primary"
                  />
                  <label htmlFor="cookie" className="text-[11px]">
                    Statistika
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="cookie"
                    id="Marketing"
                    defaultChecked={true}
                    className="h-3 w-3 rounded text-primary"
                  />
                  <label htmlFor="cookie" className="text-[11px]">
                    Marketing
                  </label>
                </div>
              </div>
              <button
                className="primaryButton px-2 py-0.5 text-[11px]"
                onClick={() => {
                  Cookies.set("cookiesAllowed", true, { expires: 365 });
                  setCookiesAllowed(true);
                }}
              >
                Slažem se
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieAlert;

"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { get } from "@/api/api";

const Footer = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState({
    id: null,
  });

  useEffect(() => {
    const getCategories = async () => {
      await get("/categories/product/tree").then((res) => {
        setCategories(res?.payload);
      });
    };

    getCategories();
  }, []);

  return (
    <div className="mt-12 md:mx-[40px] lg:mx-[80px] lg:mt-24">
      {/* <div className="h-10 w-[180px] bg-primary max-sm:hidden"></div> */}
      <div className="bg-gray px-12">
        <div className="flex items-center justify-between border-b-2 border-l-0 border-r-0 border-t-0 border-b-primary bg-gray py-[2.625rem] max-xl:flex-col">
          <div className="flex items-center gap-12 max-xl:mt-10 max-xl:flex-col max-xl:gap-8">
            <Link href={`/`}>
              <Image
                src={"/images/logo/logo.png"}
                width={214}
                height={45}
                alt="Croonus Logo"
              />
            </Link>
            <div className="flex items-center gap-12 max-xl:gap-8 max-md:flex-col">
              <div className="flex flex-col items-start font-light max-xl:items-center">
                <p className="text-base uppercase text-[#171717]">
                  Besplatna dostava za
                </p>
                <p className="text-base uppercase text-[#171717]">
                  Iznos preko{" "}
                  <span className="font-bold text-primary">3.000 RSD</span>
                </p>
              </div>{" "}
              <div className="flex flex-col items-start font-light max-xl:items-center">
                <p className="text-base uppercase text-[#171717]">
                  Rok isporuke do
                </p>
                <p className="text-base font-light uppercase text-[#171717]">
                  <span className="font-bold text-primary">2</span> radna dana
                </p>
              </div>{" "}
              <div className="flex flex-col items-start font-light max-xl:items-center">
                <p className="text-base uppercase text-[#171717]">
                  Povrat robe
                </p>
                <p className="text-base uppercase text-[#171717]">
                  U roku od <span className="font-bold text-primary">14</span>{" "}
                  dana
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[1.938rem] text-base font-light max-xl:mt-10">
            <a
              href="https://www.facebook.com/intricco.arilje"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/intricco.arilje"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="flex items-start justify-between border-b-2 border-l-0 border-r-0 border-t-0 border-b-white bg-gray py-[2.75rem] text-[#191919] max-xl:flex-col max-xl:items-start max-md:mx-auto max-md:w-[95%]">
          <div className="flex items-center max-md:hidden max-md:w-full max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-5 md:gap-[100px] 2xl:gap-[150px] 3xl:gap-[220px]">
            {/* <div className="flex flex-col gap-4 self-start max-md:self-center">
              <p className="text-xl font-light">Korisnička podrška</p>
              <div className="flex flex-col items-start gap-1 text-sm font-light">
                <Link
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/strana/kako-kupiti" && "text-primary"
                  }`}
                  href={"/strana/kako-kupiti"}
                >
                  Kako kupiti
                </Link>
                <Link
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/strana/reklamacije" && "text-primary"
                  }`}
                  href="/strana/reklamacije"
                >
                  Reklamacije
                </Link>
                <Link
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/povracaj-sredstava" && "text-primary"
                  }`}
                  href="/povracaj-sredstava"
                >
                  Povraćaj sredstava
                </Link>
                <Link
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/zamena-za-isti-artikal" && "text-primary"
                  }`}
                  href="/zamena-za-isti-artikal"
                >
                  Zamena za isti artikal
                </Link>
                <Link
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/zamena-za-drugi-artikal" && "text-primary"
                  }`}
                  href="/zamena-za-drugi-artikal"
                >
                  Zamena za drugi artikal
                </Link>
                <Link
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/strana/pravo-na-odustajanje" &&
                    "text-primary"
                  }`}
                  href="/strana/pravo-na-odustajanje"
                >
                  Pravo na odustajanje
                </Link>
              </div>
            </div> */}
            <div className="flex flex-col gap-4 self-start max-md:self-center">
              <p className="text-xl font-light">Informacije</p>
              <div className="flex flex-col items-start gap-1 text-sm font-light">
                <Link
                  href={`/strana/podaci-o-firmi`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/strana/podaci-o-firmi" && "text-primary"
                  }`}
                >
                  Podaci o firmi
                </Link>
                <Link
                  href={`/strana/uslovi-koriscenja`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/strana/uslovi-koriscenja" && "text-primary"
                  }`}
                >
                  Uslovi korišćenja
                </Link>
                <Link
                  href={`/strana/kako-kupiti`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/strana/kako-kupiti" && "text-primary"
                  }`}
                >
                  Kako kupiti
                </Link>
                {/* <Link
                  href={`/stranica-u-izradi`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/stranica-u-izradi" && "text-primary"
                  }`}
                >
                  Zaštita privatnosti
                </Link>

                <Link
                  href={`/`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/" && "text-primary"
                  }`}
                >
                  Isporuka{" "}
                </Link>
                <Link
                  href={`/`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === "/" && "text-primary"
                  }`}
                >
                  Politika o 'Kolačićima'{" "}
                </Link> */}
              </div>
            </div>
            <div className="flex flex-col gap-4 self-start max-md:self-center max-[493px]:mt-10">
              <p className="text-xl font-light">Možda te interesuje</p>
              <div className="flex flex-col items-start gap-1 text-sm font-light">
                <Link
                  href={`/sve-kategorije`}
                  className={`cursor-pointer hover:text-primary ${
                    pathname === `/sve-kategorije` && "text-primary"
                  }`}
                >
                  Sve kategorije
                </Link>
                {categories.map((category, index) => {
                  return (
                    <Link
                      key={index}
                      href={`/${category.link.link_path}`}
                      className={`cursor-pointer hover:text-primary ${
                        pathname === `/${category.link.link_path}` &&
                        "text-primary"
                      }`}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center max-md:w-full max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-5 md:hidden md:gap-[100px] 2xl:gap-[150px] 3xl:gap-[220px]">
            {/* <div
              onClick={() => setOpen({ id: open?.id === 1 ? null : 1 })}
              className="flex flex-col gap-4 self-start max-md:self-center"
            >
              <p className="text-xl font-light">Korisnička podrška</p>
              {open?.id === 1 && (
                <div className="flex flex-col items-center justify-center gap-1 text-sm font-light">
                  <Link
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/strana/kako-kupiti" && "text-primary"
                    }`}
                    href="/strana/kako-kupiti"
                  >
                    Kako kupiti
                  </Link>
                  <Link
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/strana/reklamacije" && "text-primary"
                    }`}
                    href="/strana/reklamacije"
                  >
                    Reklamacije
                  </Link>
                  <Link
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/povracaj-sredstava" && "text-primary"
                    }`}
                    href="/povracaj-sredstava"
                  >
                    Povraćaj sredstava
                  </Link>
                  <Link
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/zamena-za-isti-artikal" && "text-primary"
                    }`}
                    href="/zamena-za-isti-artikal"
                  >
                    Zamena za isti artikal
                  </Link>
                  <Link
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/zamena-za-drugi-artikal" && "text-primary"
                    }`}
                    href="/zamena-za-drugi-artikal"
                  >
                    Zamena za drugi artikal
                  </Link>
                  <Link
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/strana/pravo-na-odustajanje" &&
                      "text-primary"
                    }`}
                    href="/strana/pravo-na-odustajanje"
                  >
                    Pravo na odustajanje
                  </Link>
                </div>
              )}
            </div> */}
            <div
              onClick={() => setOpen({ id: open?.id === 2 ? null : 2 })}
              className="flex flex-col gap-4 self-start text-center max-md:self-center"
            >
              <p className="text-xl font-light">Informacije</p>
              {open?.id === 2 && (
                <div className="flex flex-col items-center justify-center gap-1 text-sm font-light">
                  <Link
                    href={`/strana/uslovi-koriscenja`}
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/strana/uslovi-koriscenja" && "text-primary"
                    }`}
                  >
                    Uslovi korišćenja
                  </Link>
                  <Link
                    href={`/strana/kako-kupiti`}
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/strana/kako-kupiti" && "text-primary"
                    }`}
                  >
                    Kako kupiti
                  </Link>
                  {/* <Link
                    href={`/stranica-u-izradi`}
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/stranica-u-izradi" && "text-primary"
                    }`}
                  >
                    Zaštita privatnosti
                  </Link>

                  <Link
                    href={`/`}
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/" && "text-primary"
                    }`}
                  >
                    Isporuka{" "}
                  </Link>
                  <Link
                    href={`/`}
                    className={`cursor-pointer hover:text-primary ${
                      pathname === "/" && "text-primary"
                    }`}
                  >
                    Politika o 'Kolačićima'{" "}
                  </Link> */}
                </div>
              )}
            </div>
            <div
              onClick={() => setOpen({ id: open?.id === 3 ? null : 3 })}
              className="flex flex-col gap-4 self-start max-md:self-center"
            >
              <p className="text-xl font-light">Možda te interesuje</p>
              {open?.id === 3 && (
                <div className="flex flex-col items-center justify-center gap-1 text-base font-light">
                  {categories.map((category, index) => {
                    return (
                      <Link
                        key={index}
                        href={`/${category.link.link_path}`}
                        className={`cursor-pointer hover:text-primary ${
                          pathname === `/${category.link.link_path}` &&
                          "text-primary"
                        }`}
                      >
                        {category.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[1.25rem] self-start max-xl:mt-5 max-xl:w-full max-md:mt-10 max-md:items-center xl:max-w-[450px] 2xl:max-w-[450px] 3xl:max-w-[578px]">
            <div className="flex items-center gap-1">
              <div>
                <Image
                  src={"/icons/bank/idcheck.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/visaSecure.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/bancaIntesa.webp"}
                  width={200}
                  height={70}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/mastercard.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/maestro.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/dinacard.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/visa.webp"}
                  width={50}
                  height={30}
                  alt="Visa"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
              <div>
                <Image
                  src={"/icons/bank/american.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="h-auto w-12 object-scale-down"
                />
              </div>
            </div>
            <p className="text-sm font-light text-[#191919] max-md:text-center">
              Cene na sajtu su iskazane u dinarima sa uračunatim porezom, a
              plaćanje se vrši isključivo u dinarima. Isporuka se vrši SAMO na
              teritoriji Republike Srbije.
            </p>
            <p className="text-sm font-light text-[#191919] max-md:text-center">
              Nastojimo da budemo što precizniji u opisu proizvoda, prikazu
              slika i samih cena, ali ne možemo garantovati da su sve
              informacije kompletne i bez grešaka. Svi artikli prikazani na
              sajtu su deo naše ponude i ne podrazumeva da su dostupni u svakom
              trenutku.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between py-[1.25rem] max-md:mx-auto max-md:w-[95%] max-md:flex-col max-md:gap-10 max-md:text-center">
          <p className="text-sm font-light text-[#191919]">
            &copy; {new Date().getFullYear()} Intricco Underwear | Sva prava
            zadržana. Powered by{" "}
            <a
              href="https://www.croonus.com"
              target="_blank"
              rel="noreferrer"
              className="bganimatethumb relative cursor-pointer hover:text-primary"
            >
              Croonus Technologies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

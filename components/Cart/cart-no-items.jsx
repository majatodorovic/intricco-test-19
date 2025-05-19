import Link from "next/link";

export const CartNoItems = () => {
  return (
    <>
      <div className="nocontent-holder mx-auto mt-[1.2rem] flex items-center justify-center max-md:w-[95%] lg:mt-[13rem]">
        <div className="flex flex-col items-center justify-center border border-gray p-10 text-center shadow">
          <div className="text-center">
            <span className="text-2xl font-medium">Vaša korpa</span>
          </div>
          <div className="mt-6 text-center text-lg font-medium">
            Trenutno ne postoji sadržaj u Vašoj korpi.
          </div>
          <div className="mt-5 text-center">
            <Link href="/">
              <button className="primaryButton f mt-10 px-10 py-4">
                Vrati se na početnu stranu
              </button>
            </Link>
          </div>
          <div className="help-container mt-10 text-center">
            <p className="font-medium">Pomoć pri kupovini:</p>
            <ul className="mt-2">
              <li>
                - Ukoliko Vam je potrebna pomoć u svakom trenutku nas možete
                kontaktirati pozivom na broj call centra{" "}
                <a href={`tel:${process.env.TELEPHONE}`}>
                  {process.env.TELEPHONE}
                </a>
                .
              </li>
              <li>
                - Pogledajte uputstvo za{" "}
                <Link href={"/strana/kako-kupiti"} className="underline">
                  pomoć pri kupovini.
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

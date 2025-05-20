import Contact from "@/components/Contact/Contact";
import { headers } from "next/headers";
import { generateOrganizationSchema } from "@/_functions";
import { list } from "@/api/api";
import Link from "next/link";

const getData = () => {
  return list("/static-pages/content/kontakt").then((res) => {
    return res?.payload;
  });
};

const Kontakt = async ({ searchParams }) => {
  const data = await getData();
  const staticData = data?.items?.map((items) => items);

  const { proizvodIme, sifra, atribut } = searchParams;

  const keyGenerator = (prefix) => {
    return `${prefix}-${Math.random().toString(36)}`;
  };

  let all_headers = headers();
  let base_url = all_headers.get("x-base_url");
  let schema = generateOrganizationSchema(base_url);

  const defaultMessage =
    proizvodIme && sifra
      ? `Poštovani, \n\nMolim Vas da na datu e-mail adresu pošaljete ponudu za proizvod ${proizvodIme} - ${sifra}. ${
          atribut ? atribut : ""
        }.\n\nHvala.`
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className={`sectionWidth mt-5`}>
        <div className={`flex items-center gap-2`}>
          <Link className={`text-[0.95rem]`} href={`/`}>
            Intricco Underwear
          </Link>
          <span className={`text-[0.95rem]`}>/</span>
          <span className={`text-[0.95rem] font-bold text-primary`}>
            Kontakt
          </span>
        </div>
        <h1
          className={`mt-5 w-full border-b pb-2 text-[23px] font-normal md:text-[29px]`}
        >
          Kontakt
        </h1>
        {staticData?.map((items) => {
          switch (items?.type) {
            case "html_editor": {
              const content = items?.content || "";
              const splitContent = content.split("\n"); // Razdvajanje po linijama
              const body = splitContent.slice(0).join("\n"); // Ostatak kao telo

              return (
                <div
                  key={keyGenerator("html")}
                  className="text-gray-800 sectionWidth mt-5 text-center leading-7"
                >
                  <div
                    className="text-[18px]"
                    dangerouslySetInnerHTML={{ __html: body }}
                  ></div>
                </div>
              );
            }
            default:
              return null;
          }
        })}
      </div>
      <Contact staticData={staticData} defaultMessage={defaultMessage} />
    </>
  );
};

export default Kontakt;

export const generateMetadata = async () => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Kontakt | Intricco Underwear`,
    description: "Dobrodošli na Intricco Underwear Online Shop",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Kontakt | Intricco Underwear`,
      description: "Dobrodošli na Intricco Underwear Online Shop",
      type: "website",
      locale: "sr_RS",
    },
  };
};

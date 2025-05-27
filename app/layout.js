import { CartContextProvider } from "@/api/cartContext";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer/Footer";
import NavigationMobile from "@/components/Navigation/NavigationMobile";
import { UserProvider } from "@/context/userContext";
import CookieAlert from "@/components/CookieAlert/CookieAlert";
import Header from "@/components/Header/Header";
import { QueryProvider } from "@/components/QueryProvider";
import { ToastContainer } from "react-toastify";
import { AnalyticsGA4 } from "@/_components/shared/analyticsGA4";
import { AnalyticsGTM } from "@/_components/shared/analyticsGTM";
import { Suspense } from "react";
import Script from "next/script";
import AOSContainer from "@/helpers/AOSContainer";
import "aos/dist/aos.css";

const getHTMLLang = async () => {
  return process.env.HTML_LANG;
};

export default async function RootLayout({ children }) {
  return (
    <html lang={`${await getHTMLLang()}`}>
      <head>
        <link
          rel={`stylesheet`}
          href={`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css`}
        />
        <Script
          src={`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/js/regular.js`}
        ></Script>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100..900&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        <Script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.GTM_ID}');`,
          }}
        />
      </head>
      <body className="relative">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_ID}`}
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          ></iframe>
        </noscript>
        <QueryProvider>
          <AOSContainer>
            <UserProvider>
              <CartContextProvider>
                <Header />
                <NavigationMobile />
                {children}
                <Footer />
                <ToastContainer />
              </CartContextProvider>
            </UserProvider>
            <Suspense>
              <AnalyticsGA4 />
              <AnalyticsGTM />
            </Suspense>
          </AOSContainer>
        </QueryProvider>
        <CookieAlert />
      </body>
    </html>
  );
}

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Sve kategorije | Intricco Underwear",
  description: "Dobrodošli na Intricco Underwear Online Shop",
  alternates: {
    canonical: "https://www.intriccounderwear.rs/sve-kategorije",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sve kategorije - Intricco Underwear",
    description: "Dobrodošli na Intricco Underwear Online Shop",
    type: "website",
    url: "https://www.intriccounderwear.rs/sve-kategorije",
    image: "https://croonus.com/images/logo.png",
    site_name: "croonus.com",
    locale: "sr_RS",
  },
};

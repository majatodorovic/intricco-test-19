import StaticPage from "@/components/StaticPage/StaticPage";
import { get, list } from "@/api/api";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const getData = (slug) => {
  return list(`/static-pages/content/${slug}`).then((res) => {
    return res?.payload;
  });
};

const DynamicStaticPage = async ({ params: { slug } }) => {
  const data = await getData(slug);
  data ?? notFound();
  return <StaticPage slug={slug} data={data} />;
};

export default DynamicStaticPage;

const getSEO = (slug) => {
  return get(`/static-pages/seo/${slug}`).then((response) => response?.payload);
};

export const generateMetadata = async ({ params: { slug } }) => {
  const data = await getSEO(slug);

  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: data?.meta_title ?? "Početna | Intricco Underwear",
    description:
      data?.meta_description ?? "Dobrodošli na Intricco Underwear Online Shop",
    alternates: {
      canonical: data?.meta_canonical_link ?? canonical,
    },
    robots: {
      index: data?.meta_robots?.index ?? true,
      follow: data?.meta_robots?.follow ?? true,
    },
    openGraph: {
      title: data?.social?.share_title ?? "Početna | Intricco Underwear",
      description:
        data?.social?.share_description ??
        "Dobrodošli na Intricco Underwear Online Shop",
      type: "website",
      images: [
        {
          url: data?.social?.share_image ?? "",
          width: 800,
          height: 600,
          alt: "Intricco Underwear",
        },
      ],
      locale: "sr_RS",
    },
  };
};

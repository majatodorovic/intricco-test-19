import { get, list } from "@/api/api";
import ProductContainer from "./ProductContainer";
import { notFound } from "next/navigation";
import { generateProductSchema } from "@/_functions";
import Head from "next/head";

const ProductLayout = async ({ path, category_id, id, canonical }) => {
  const product_basicData = await get(`/product-details/basic-data/${id}`);

  if (product_basicData?.status === false || !product_basicData?.payload) {
    console.error(
      `Something went wrong! Status is false.`,
      product_basicData,
      id
    );
    return notFound();
  }

  const product_gallery = await get(`/product-details/gallery/${id}`);

  const isDigitalProduct = product_basicData
    ? product_basicData?.payload?.data?.item?.digital_data?.is_digital
    : null;

  const digitalProduct = isDigitalProduct
    ? await list(`/product-details/digital-material/${id}`)
    : null;

  const schema = generateProductSchema(
    product_basicData?.payload,
    product_gallery?.payload,
    canonical
  );

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <ProductContainer
        canonical={canonical}
        id={id}
        path={path}
        category_id={category_id}
        basic_data={product_basicData?.payload}
        product_gallery={product_gallery?.payload}
        digitalProduct={digitalProduct?.payload}
      />
    </>
  );
};

export default ProductLayout;

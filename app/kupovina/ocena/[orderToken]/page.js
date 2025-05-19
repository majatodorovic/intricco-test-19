import Image from "next/image";
import ProductMarkForm from "./_components/ProductMarkForm";

const productList = [
  {
    title: "Dukserica AK",
    image:
      "https://api.staging.croonus.com/croonus-uploads/products_gallery/file/30545/22737/dukserica-ak-1734349379.webp",
    id_product: 30555,
    marksOptions: [1, 2, 3, 4, 5],
  },
  {
    title: "Dukserica Braon",
    image:
      "https://api.staging.croonus.com/croonus-uploads/products_gallery/file/30547/22742/dukserica-zelena-braon-1734349339.webp",
    id_product: 30555,
    marksOptions: [1, 2, 3, 4, 5],
  },
  {
    title: "Sowtware windows",
    image:
      "https://api.staging.croonus.com/croonus-uploads/products_gallery/file/30555/22748/windows-software-1738143323.webp",
    id_product: 30545,
    marksOptions: [1, 2, 3, 4, 5],
  },
];

const OceneProizvoda = () => {
  return (
    <div className="w-full px-6">
      <h1 className="mt-12 mb-12 text-[23px] md:text-[29px] font-normal text-center uppercase">
        Oceni kupljene proizvode
      </h1>

      {productList.map(({ id_product, marksOptions, title, image }) => (
        <>
          <div
            key={id_product}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:[direction:rtl]"
          >
            <div className="lg:[direction:ltr] lg:col-span-1">
              <h2 className="text-center">{title}</h2>
              <Image
                src={image}
                alt={image}
                width={0}
                height={0}
                sizes={`100vw`}
                className={`w-full object-contain`}
              />
            </div>
            <div className="lg:[direction:ltr] lg:col-span-2">
              <ProductMarkForm
                id_product={id_product}
                marksOptions={marksOptions}
              />
            </div>
          </div>
          <hr className="mt-8 mb-8" />
        </>
      ))}
    </div>
  );
};

export default OceneProizvoda;

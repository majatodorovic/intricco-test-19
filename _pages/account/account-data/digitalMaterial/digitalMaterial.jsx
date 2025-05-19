import { SectionHeader } from "@/_pages/account/account-data/shared";
import { SectionBody } from "@/_pages/account/account-data/shared/section-body";
import Documents from "./tabs/documents";
import PurchaseOrders from "./tabs/purchaseOrders";
import { useSuspenseQuery } from "@tanstack/react-query";
import { list } from "@/api/api";
import { useRouter, useSearchParams } from "next/navigation";
import { getActiveTab } from "@/_pages/account/sidebar";

const DigitalMaterial = () => {
  const params = useSearchParams();
  const active_tab = getActiveTab();
  const router = useRouter();
  let documentID = params?.get("documentID");
  let page = params?.get("strana");

  const { data: digitalProduct } = useSuspenseQuery({
    queryKey: ["digital_product_order_list", page],
    queryFn: async () => {
      return await list(
        `/customers/digital-material/order-items/purchased-by-customer-token`,
        { page }
      ).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  const { data: digMaterialDocs } = useSuspenseQuery({
    queryKey: ["digital_product_order_document_list", documentID, page],
    queryFn: async () => {
      if (!documentID) return null;
      return await list(
        `/customers/digital-material/files/docs/${documentID}`,
        { page }
      ).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  const selectedDigitalProduct =
    digitalProduct && documentID
      ? digitalProduct.items.find(
          (product) => product.order_item_id == documentID
        )
      : null;

  return (
    <>
      <SectionHeader
        title={`Digitalni proizvodi ${
          selectedDigitalProduct ? "/ " + selectedDigitalProduct.name : ""
        }`}
        description={"Ovde možete videti sve vaše digitalne proizvode."}
        button={documentID ? "Nazad" : ""}
        onClick={documentID ? () => router.push(`?tab=${active_tab}`) : null}
      />
      <SectionBody>
        {documentID && digMaterialDocs ? (
          <Documents id={documentID} data={digMaterialDocs} />
        ) : (
          <PurchaseOrders digitalProduct={digitalProduct} />
        )}
      </SectionBody>
    </>
  );
};

export default DigitalMaterial;

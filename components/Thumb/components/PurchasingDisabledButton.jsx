import Link from "next/link";

const PurchasingDisabledButton = () => {
  return (
    <Link
      href="#"
      className="text-center block mt-4 mb-4 bg-[#003B71] hover:bg-[#002b54] text-white text-sm font-medium py-2 px-4 rounded-md"
    >
      Zatražite nalog ili se prijavite
    </Link>
  );
};

export default PurchasingDisabledButton;

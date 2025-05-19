import Link from "next/link";

const GuestPurchasingDisabled = ({ displayComponent }) => {
  if (!displayComponent) return <></>;

  return (
    <div className="bg-[#EAF1F9] rounded-xl p-6 max-w-xl mt-8 mb-8">
      <h2 className="text-[1rem] font-semibold text-gray-800 mb-2">
        Još uvek nemate nalog?
      </h2>
      <p className="text-sm text-gray-700 mb-4">
        Zatražite svoj poslovni nalog sada da biste odmah dobili pristup Evropi
        najveći inventar mobilnih displeja i malih delova. Jednom odobreno,
        imaćete koristi od našeg namenskog tima menadžera naloga i stručnjaka
        agenti za podršku, obezbeđujući iskustvo bez problema. Otključajte svoj
        pristup samo 2 minuta!
      </p>
      <div className="flex items-center gap-4">
        <button className="bg-[#003B71] hover:bg-[#002b54] text-white text-sm font-medium py-2 px-4 rounded-md">
          Zahtevajte nalog
        </button>
        <Link
          href="#"
          className="flex items-center text-sm text-gray-700 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
export default GuestPurchasingDisabled;

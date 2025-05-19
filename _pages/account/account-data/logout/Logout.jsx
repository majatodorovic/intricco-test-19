"use client";

import { Modal } from "@/_components/shared/modal";
import { useRouter } from "next/navigation";

import { userContext } from "@/context/userContext";
import { useLogout } from "@/hooks/ecommerce.hooks";

import { useContext } from "react";

export default function Logout() {
  const router = useRouter();
  const { logout } = useContext(userContext);
  const { mutateAsync } = useLogout();

  return (
    <Modal
      type={`modal`}
      show={true}
      handleOpen={() => {
        router.push(`?tab=dashboard`);
      }}
      description={`Da li ste sigurni da želite da se odjavite?`}
      title={`Odjava`}
    >
      <button
        className="primaryButton mt-4 w-full px-4 py-2"
        onClick={() => {
          logout(mutateAsync);
        }}
      >
        DA
      </button>
    </Modal>
  );
}

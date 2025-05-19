"use client";

import { Sidebar } from "@/_pages/account/sidebar";
import { AccountData } from "@/_pages/account/account-data/shared";

export const Account = () => {
  return (
    <div className={`sectionWidth mt-10 grid grid-cols-5 gap-5`}>
      <Sidebar />
      <AccountData />
    </div>
  );
};

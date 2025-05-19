"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartBadge } from "@/hooks/ecommerce.hooks";

const HeaderIcons = () => {
  const { data: cartCount } = useCartBadge();

  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Image
          src="/icons/user.png"
          width={20}
          height={20}
          className="h-auto w-5 object-cover"
          alt="user"
        />
      </Link>
      <Link href="/korpa" className="relative">
        <Image
          src="/icons/shopping-bag.png"
          width={24}
          height={24}
          className="h-auto w-6 object-cover"
          alt="shopping-bag"
        />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-whiteSmoke">
          {cartCount}
        </span>
      </Link>
    </div>
  );
};

export default HeaderIcons;

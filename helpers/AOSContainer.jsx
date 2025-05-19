"use client";

import AOS from "aos";
import { useEffect } from "react";

export default function AOSContainer({ children }) {
  useEffect(() => {
    AOS.init({ offset: 200, duration: 1200 });
  }, []);
  return <>{children}</>;
}

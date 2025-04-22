"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";

import CheckoutAside from "./components/CheckoutAside";
import CheckoutForm from "./components/CheckoutForm";

const CheckoutPage = () => {
  const path = usePathname().split("/").pop();

  return (
    <section className="mt-4 md:mt-7 flex items-center justify-center">
      <div className="w-11/12 md:w-10/12 min-h-dvh">
        <Breadcrumbs path={path} />

        <div className="grid grid-cols-3 grid-rows-1 gap-4">
          <div className="col-span-2">
            <CheckoutForm />
          </div>
          <div className="col-start-3">
            <CheckoutAside />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;

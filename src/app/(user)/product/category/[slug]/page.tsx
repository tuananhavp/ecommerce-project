import React from "react";

import ProductCategoryPage from "@/modules/app/ProductListPage";

const page = () => {
  return (
    <>
      <ProductCategoryPage />
    </>
  );
};

export default page;
export const metadata = {
  title: "Product Category",
  description: "Product Category for the store",
};

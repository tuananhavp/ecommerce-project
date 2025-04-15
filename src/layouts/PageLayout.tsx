import React from "react";

import Footer from "./footer/Footer";
import Header from "./header/Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PageLayout;

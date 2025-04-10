"use client";

import Banner from "./components/banner/Banner";
import Category from "./components/category/Category";
import NewProduct from "./components/new/NewProduct";

const Home = () => {
  return (
    <section className="min-h-lvh">
      <Banner />
      <Category />
      <NewProduct />
    </section>
  );
};

export default Home;

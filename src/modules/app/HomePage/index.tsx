"use client";

import { useEffect } from "react";

import { useProductStore } from "@/store/productStore";

import Banner from "./components/banner/Banner";
import Category from "./components/category/Category";
import FeatureProduct from "./components/feature-products/FeatureProduct";
import Guarantee from "./components/guarantee/Guarantee";
import TrendingProduct from "./components/trending-products/TrendingProduct";

const Home = () => {
  const { products, isLoading, getAllProduct } = useProductStore();

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);
  return (
    <section className="min-h-lvh">
      <Banner />
      <Category />
      <TrendingProduct products={products} isLoading={isLoading} />
      <FeatureProduct products={products} isLoading={isLoading} />
      <Guarantee />
    </section>
  );
};

export default Home;

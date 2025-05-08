"use client";
import React, { useEffect } from "react";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import Loading from "@/components/Loading";
import { capitalizeFirstLetter } from "@/helpers";
import { useProductStore } from "@/store/productStore";

import FilterSidebar from "./components/FillterSidebar";
import ProductList from "./components/ProductList";

const ProductCategoryPage = () => {
  const { slug } = useParams();
  const { setCategory, applyFilters, products, isLoading, error, getAllProduct, clearFilters } = useProductStore();

  // Get page from URL or default to 1

  useEffect(() => {
    clearFilters();
    if (slug) {
      const categoryName = capitalizeFirstLetter(slug.toString());
      setCategory(categoryName);
      applyFilters();

      return () => {
        clearFilters();
      };
    } else {
      getAllProduct();
    }
  }, [slug, setCategory, applyFilters, getAllProduct, clearFilters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-8 pb-10 w-11/12">
        <Breadcrumbs path="Category Product" />
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {slug ? `${capitalizeFirstLetter(slug.toString())} Products` : "All Products"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4">
            <FilterSidebar />
          </aside>

          {/* Product List */}
          <main className="w-full md:w-3/4">
            {products && products.length > 0 ? (
              <ProductList products={products} />
            ) : (
              <div className="text-center p-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No products found for this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ProductCategoryPage;

"use client";
import React, { useCallback, useEffect } from "react";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import { useProductStore } from "@/store/productStore";

import ProductDescription from "./components/ProductDescription";
import ProductGallery from "./components/ProductGallery";
import ProductOption from "./components/ProductOption";
import RelatedProduct from "./components/RelatedProduct";

const Product = () => {
  const { product, products, getAProduct, getAllProduct, isLoading } = useProductStore();
  const { slug: id } = useParams<{ slug: string }>();

  const fetchProduct = useCallback(() => {
    getAProduct(id);
    getAllProduct();
  }, [id, getAProduct, getAllProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <section className="mt-4 md:mt-7 flex items-center justify-center">
      <div className="w-11/12 md:w-10/12 min-h-dvh">
        {isLoading ? (
          <div className="min-h-lvh flex justify-center items-center">
            <Loading />
          </div>
        ) : product ? (
          <>
            <Breadcrumbs product={product} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-10">
              <ProductGallery product={product} />
              <ProductOption product={product} />
            </div>
            <ProductDescription product={product} />
            <RelatedProduct products={products} product={product} isLoading={isLoading} />
          </>
        ) : (
          <div>
            <NotFound title="can not find this product" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;

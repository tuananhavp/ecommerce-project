"use client";
import React, { useCallback, useEffect } from "react";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import Loading from "@/components/Loading";
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
    <section className="mt-7 flex items-center justify-center">
      <div className="w-10/12 min-h-dvh">
        {isLoading ? (
          <div className="min-h-lvh flex justify-center items-center">
            <Loading />
          </div>
        ) : product ? (
          <>
            <Breadcrumbs product={product} />
            <div className="grid grid-cols-2 mt-10">
              <ProductGallery product={product} />
              <ProductOption product={product} />
            </div>
            <ProductDescription />
            <RelatedProduct products={products} product={product} isLoading={isLoading} />
          </>
        ) : (
          <div>Product not found</div>
        )}
      </div>
    </section>
  );
};

export default Product;

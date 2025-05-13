import React from "react";

import Link from "next/link";

import { FaArrowRight } from "react-icons/fa6";

import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product.types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TrendingProduct = ({ products, isLoading }: { products: ProductCardProps[] | null; isLoading: boolean }) => {
  const fillterTrendingProducts = products?.filter((product) => product.trending === true && product.stockQuantity > 5);

  if (isLoading) {
    return (
      <div className="min-h-72 flex justify-center items-center">
        <Loading className="mt-16" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-8 mb-10">
      <div className="w-11/12 md:w-10/12">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h2 className="text-heading-primary font-bold text-sm sm:text-lg md:text-xl">New Products</h2>
            <span className="text-shadow-gray-third font-light text-xs sm:text-sm">
              New products with updated stocks.
            </span>
          </div>
          <Link href={"/product/category"} className="border-2 border-gray-100 rounded-2xl p-2 hover:text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text[#212529] text-xs">View All</span>
              <FaArrowRight className="text-xs" />
            </div>
          </Link>
        </div>

        {products && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 px-2">
            {fillterTrendingProducts?.slice(0, 8).map((product, index) => (
              <div key={index} className="mb-4">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  stockQuantity={product.stockQuantity}
                  category={product.category}
                  trending={product.trending}
                  imgUrl={product.imgUrl}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingProduct;

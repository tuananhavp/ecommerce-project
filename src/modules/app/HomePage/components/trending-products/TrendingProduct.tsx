import React from "react";

import Link from "next/link";

import { FaArrowRight } from "react-icons/fa6";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product.types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TrendingProduct = ({ products, isLoading }: { products: ProductCardProps[] | null; isLoading: boolean }) => {
  const fillterTrendingProducts = products?.filter((product) => product.trending === true);

  if (isLoading) {
    return (
      <div className=" min-h-72 flex justify-center items-">
        <Loading className="mt-48" />
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="w-10/12">
        <div className=" flex justify-between items-center mt-6">
          <div className="flex justify-between items-center gap-5">
            <h2 className="text-heading-primary font-bold md:text-xl text-xs">New Products</h2>
            <span className="md:block hidden text-shadow-gray-third font-light leading-8 lg:text-sm text-xs">
              New products with updated stocks.
            </span>
          </div>
          <Link href={"/"} className="border-2 border-gray-100 rounded-2xl p-3 hover:text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text[#212529] sm:text-sm text-[10px] ">View All</span>
              <FaArrowRight />
            </div>
          </Link>
        </div>
        {products && (
          <Swiper
            spaceBetween={15}
            loop={true}
            navigation={{
              enabled: true,
              hideOnClick: true,
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
            breakpoints={{
              200: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              620: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              890: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
          >
            {products &&
              fillterTrendingProducts?.map((product, index) => {
                return (
                  <SwiperSlide key={index}>
                    <ProductCard
                      key={index}
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
                  </SwiperSlide>
                );
              })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default TrendingProduct;

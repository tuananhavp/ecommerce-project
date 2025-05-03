import React from "react";

import Link from "next/link";

import { FaArrowRight } from "react-icons/fa6";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product.types";

import FeatureBanner from "./components/FeatureBanner";
import FeatureProductCard from "./components/FeatureProductCard";
import StandoutProductCard from "./components/StandoutProductCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const FeatureProduct = ({ products, isLoading }: { products: ProductCardProps[] | null; isLoading: boolean }) => {
  const standoutProduct = products?.filter(
    (product) => product.category == "Frozen Foods" && product.trending === true && product.stockQuantity < 120
  )[0];

  if (isLoading) {
    return (
      <div className=" min-h-72 flex justify-center items-">
        <Loading className="mt-48" />
      </div>
    );
  }
  return (
    <div className="my-10 w-10/12 mx-auto">
      <FeatureBanner />
      <div className=" flex justify-between items-center mt-6">
        <div className="flex justify-between items-center gap-5">
          <h2 className="text-heading-primary font-bold md:text-xl text-xs">Feature Products</h2>
          <span className="md:block hidden text-shadow-gray-third font-light leading-8 lg:text-sm text-xs">
            New products with updated stocks.
          </span>
        </div>
        <Link href={"/product/category"} className="border-2 border-gray-100 rounded-2xl p-3 hover:text-gray-500 ">
          <div className="flex items-center gap-2">
            <span className="font-bold text[#212529] sm:text-sm text-[10px] ">View All</span>
            <FaArrowRight />
          </div>
        </Link>
      </div>
      <div className=" hidden xl:grid grid-cols-3 grid-rows-1 gap-4 mt-10">
        <div>
          <div className="grid grid-cols-1 grid-rows-3 gap-4">
            {products &&
              products?.slice(0, 3).map((product, index) => {
                return (
                  <FeatureProductCard
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
                );
              })}
          </div>
        </div>
        <div className="">
          {standoutProduct && (
            <StandoutProductCard
              id={standoutProduct?.id}
              name={standoutProduct?.name}
              description={standoutProduct?.description}
              oldPrice={standoutProduct?.oldPrice}
              newPrice={standoutProduct?.newPrice}
              stockQuantity={standoutProduct?.stockQuantity}
              category={standoutProduct?.category}
              trending={standoutProduct?.trending}
              imgUrl={standoutProduct?.imgUrl}
            />
          )}
        </div>
        <div className="grid grid-cols-1 grid-rows-3 gap-4">
          {products &&
            products?.slice(9, 12).map((product, index) => {
              return (
                <FeatureProductCard
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
              );
            })}
        </div>
      </div>
      <div className="xl:hidden block mt-10">
        {
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
              products?.map((product, index) => {
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
        }
      </div>
    </div>
  );
};

export default FeatureProduct;

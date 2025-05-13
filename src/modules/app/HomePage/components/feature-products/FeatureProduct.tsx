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

  const filterFeatureProducts = products?.filter((product) => product.trending === true && product.stockQuantity > 1);

  if (isLoading) {
    return (
      <div className="min-h-72 flex justify-center items-center">
        <Loading className="mt-16 sm:mt-24 md:mt-32" />
      </div>
    );
  }

  return (
    <div className="my-8 sm:my-10 w-11/12 sm:w-10/12 mx-auto">
      <FeatureBanner />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-3 sm:mb-0">
          <h2 className="text-heading-primary font-bold text-base sm:text-lg md:text-xl">Feature Products</h2>
          <span className="text-shadow-gray-third font-light text-xs sm:text-sm hidden md:block">
            New products with updated stocks.
          </span>
        </div>

        <Link
          href={"/product/category"}
          className="border-2 border-gray-100 rounded-2xl p-2 sm:p-3 hover:text-gray-500 hover:border-gray-200 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#212529] text-xs sm:text-sm">View All</span>
            <FaArrowRight className="text-xs sm:text-sm" />
          </div>
        </Link>
      </div>

      <div className="hidden xl:grid grid-cols-3 gap-4 mt-8">
        <div className="grid grid-rows-3 gap-4 h-full" style={{ minHeight: "calc(100vh - 200px)" }}>
          {products &&
            products?.slice(3, 6).map((product, index) => (
              <div key={index} className="h-1/3">
                <FeatureProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  stockQuantity={product.stockQuantity}
                  category={product.category}
                  trending={product.trending}
                  imgUrl={product.imgUrl}
                  rating={product.rating}
                />
              </div>
            ))}
        </div>

        <div className="flex items-center h-full" style={{ minHeight: "calc(100vh - 200px)" }}>
          {standoutProduct && (
            <div className="w-full h-full">
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
                rating={standoutProduct?.rating}
              />
            </div>
          )}
        </div>

        <div className="grid grid-rows-3 gap-4 h-full" style={{ minHeight: "calc(100vh - 200px)" }}>
          {filterFeatureProducts &&
            filterFeatureProducts?.slice(0, 3).map((product, index) => (
              <div key={index} className="h-1/3">
                <FeatureProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  oldPrice={product.oldPrice}
                  newPrice={product.newPrice}
                  stockQuantity={product.stockQuantity}
                  category={product.category}
                  trending={product.trending}
                  imgUrl={product.imgUrl}
                  rating={product.rating}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Mobile/Tablet Swiper */}
      <div className="xl:hidden block mt-6 sm:mt-8">
        <Swiper
          spaceBetween={15}
          loop={true}
          navigation={{
            enabled: true,
            hideOnClick: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper pb-10"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 1.5,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {filterFeatureProducts &&
            filterFeatureProducts?.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="px-1 pb-2">
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
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeatureProduct;

import { useEffect, useState } from "react";

import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { ProductCardProps } from "@/types/product.types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const RelatedProduct = ({
  products = null,
  isLoading,
  product,
}: {
  products?: ProductCardProps[] | null;
  isLoading: boolean;
  product: ProductCardProps;
}) => {
  const [relatedProduct, setRelatedProduct] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    const filterRelatedProducts = (listProduct: ProductCardProps[]): ProductCardProps[] => {
      const relatedProduct = listProduct.filter((item: ProductCardProps) => {
        return item.category === product.category && item.id !== product.id;
      });
      return relatedProduct;
    };

    if (products) {
      setRelatedProduct(filterRelatedProducts(products));
    }
  }, [products, product]);

  return (
    <>
      <h2 className="text-heading-primary font-bold md:text-xl text-xs mt-10">Related Products</h2>
      {isLoading && <SkeletonCard count={5} />}
      {relatedProduct && (
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
            relatedProduct?.map((product, index) => {
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
    </>
  );
};

export default RelatedProduct;

import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/store/productStore";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";

const NewProduct = () => {
  const { getTrendingProduct, products, isLoading } = useProductStore();
  //   const [listProduct, setListProduct] = useState<ProductCardProps[]>();
  console.log(products);
  useEffect(() => {
    getTrendingProduct();
  }, [getTrendingProduct]);

  if (isLoading) {
    return (
      <div className=" min-h-72 flex justify-center items-">
        <Loading />
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
        <div className="grid grid-cols-5 gap-2 mt-10">
          {products &&
            products?.map((product, index) => {
              return (
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
                  imgUrl={product.imgUrl[0]}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NewProduct;

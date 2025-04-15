import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { ProductCardProps } from "@/types/product.types";

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
      <div className="grid grid-cols-5 gap-2 mt-10 mb-16">
        {isLoading && <SkeletonCard count={5} />}
        {relatedProduct &&
          relatedProduct.slice(0, 5)?.map((product, index) => {
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
                imgUrl={product.imgUrl}
              />
            );
          })}
      </div>
    </>
  );
};

export default RelatedProduct;

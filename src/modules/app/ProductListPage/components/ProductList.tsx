import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product.types";

const ProductList = ({ products }: { products: ProductCardProps[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
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
      ))}
    </div>
  );
};

export default ProductList;

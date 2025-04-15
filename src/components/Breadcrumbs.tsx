import Link from "next/link";

import { ProductCardProps } from "@/types/product.types";

const Breadcrumbs = ({ product }: { product: ProductCardProps | null }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li className="text-shadow-text-primary font-bold">
          <Link href={`/product${product?.id}`}>{product?.name}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumbs;

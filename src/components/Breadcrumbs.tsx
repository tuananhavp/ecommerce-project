import Link from "next/link";

import { ProductCardProps } from "@/types/product.types";

const Breadcrumbs = ({ product, path }: { product?: ProductCardProps | null; path?: string }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>

        {product ? (
          <li className="text-shadow-text-primary font-bold">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </li>
        ) : (
          path && (
            <li className="text-shadow-text-primary font-bold capitalize">
              {path.replace("/", "").replace(/-/g, " ")}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Breadcrumbs;

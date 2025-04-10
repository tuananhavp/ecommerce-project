import { useProductStore } from "@/store/productStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Breadcrumbs = () => {
  const { slug } = useParams();
  const { getAProduct, product } = useProductStore();
  console.log(product);
  useEffect(() => {
    getAProduct(slug as string);
  }, [getAProduct, slug]);
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

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { ProductCardProps } from "@/types/product.types";

const ProductCard = ({
  id,
  name,
  description,
  oldPrice,
  newPrice,
  stockQuantity,
  trending,
  imgUrl,
}: ProductCardProps) => {
  return (
    <div className="card bg-base-100 shadow-sm flex flex-col justify-center items-center hover:shadow-lg relative">
      <Link href={`/product/${id}`}>
        <figure>
          <Image src={imgUrl[0]} alt={name} className="object-cover" width={177} height={177} />
        </figure>
      </Link>

      <div className="card-body">
        <Link href={`/product/${id}`}>
          {name.length <= 26 ? (
            <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
          ) : (
            <span className="card-title lg:text-base sm:text-xs text-[10px]">{name.slice(0, 26)}...</span>
          )}

          {description.length <= 64 ? (
            <span className="text-gray-primary text-xs">{description}</span>
          ) : (
            <span className="text-gray-primary text-xs">{description.slice(0, 64)}...</span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-red-primary font-bold lg:text-xl sm:text-sm text-xs">${newPrice}</span>
          <span className="text-text-primary lg:text-base sm: text-xs text-[10px] line-through">${oldPrice}</span>
        </div>
        <span className="text-sm font-bold text-green-600">IN STOCK</span>
        <span className="text-gray-secondary text-xs">
          Avalible only: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
        </span>
        <div className="card-actions ">
          <button className="btn btn-primary w-full bg-purple-primary">Add to Cart</button>
        </div>
      </div>
      {trending && (
        <div className="rounded-full size-10 text-xs bg-red-600 absolute inset-1.5 flex items-center justify-center text-white animate-wiggle ease-in">
          New
        </div>
      )}
    </div>
  );
};

export default ProductCard;

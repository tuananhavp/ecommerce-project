import React from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";

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
    <div className="card bg-base-100 shadow-sm flex flex-col h-full hover:shadow-lg relative">
      <Link href={`/product/${id}`} className="flex justify-center">
        <figure className="pt-4">
          <Image src={imgUrl[0]} alt={name} className="object-cover" width={177} height={177} />
        </figure>
      </Link>

      <div className="card-body flex flex-col flex-1">
        <Link href={`/product/${id}`} className="flex-1 flex flex-col">
          <div className="min-h-14">
            {/* {name.length <= 20 ? (
              <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
            ) : (
              <span className="card-title lg:text-base sm:text-xs text-[10px]">{name.slice(0, 20)}...</span>
            )} */}
            <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
          </div>

          <div className="min-h-16 mb-2">
            {description.length <= 64 ? (
              <span className="text-gray-primary text-xs">{description}</span>
            ) : (
              <span className="text-gray-primary text-xs">{description.slice(0, 64)}...</span>
            )}
          </div>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span
              className={clsx("text-red-primary font-bold lg:text-xl sm:text-sm text-xs", newPrice == 0 && "hidden")}
            >
              ${newPrice}
            </span>
            <span
              className={clsx("text-text-primary lg:text-base sm: text-xs text-[10px]", {
                "text-red-primary font-bold lg:text-xl sm:text-sm text-xs": newPrice == 0,
                "line-through": newPrice !== 0,
              })}
            >
              ${oldPrice}
            </span>
          </div>

          <span className="text-sm font-bold text-green-600">IN STOCK</span>
          <span className="text-gray-secondary text-xs block mb-2">
            Avalible only: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
          </span>

          <div className="card-actions">
            <button className="btn btn-primary w-full bg-purple-primary">Add to Cart</button>
          </div>
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

import React from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { FaShoppingCart } from "react-icons/fa";

import { ProductCardProps } from "@/types/product.types";

const StandoutProductCard = ({
  id,
  name,
  description,
  oldPrice,
  newPrice,
  stockQuantity,
  trending,
  imgUrl,
}: ProductCardProps) => {
  const rating = 3;
  return (
    <div className="card bg-base-100 shadow-sm flex flex-col justify-center items-center hover:shadow-lg relative h-full w-full border-4 border-[#DC2626] rounded-lg gap-5">
      <Link href={`/product/${id}`} className="mt-6">
        <figure>
          <Image src={imgUrl[0]} alt={name} className="object-cover h-1/2 w-full" width={360} height={360} />
        </figure>
      </Link>

      <div className="card-body mt-6">
        <div className="rating rating-xs">
          {Array.from({ length: 5 }).map((_, index) => {
            return index + 1 == rating ? (
              <input
                key={index}
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
                aria-label={`${index + 1} star`}
                defaultChecked
              />
            ) : (
              <input
                key={index}
                type="radio"
                name="rating-5"
                className="mask mask-star-2 bg-orange-400"
                aria-label={`${index + 1} star`}
              />
            );
          })}
        </div>
        <Link href={`/product/${id}`}>
          <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>

          {description.length <= 256 ? (
            <span className="text-gray-primary text-xs">{description}</span>
          ) : (
            <span className="text-gray-primary text-xs">{description.slice(0, 256)}...</span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <span className={clsx("text-red-primary font-bold lg:text-xl sm:text-sm text-xs", newPrice == 0 && "hidden")}>
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
        <div className="flex flex-col gap-2 mt-5">
          <span className="text-gray-primary text-xs ">This product is about to run out</span>
          <div className="w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
          <span className="text-gray-secondary text-xs">
            Avalible only: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
          </span>
        </div>
        <div className="card-actions ">
          <button className="btn w-full bg-[#16A34A] text-white">
            <FaShoppingCart />
            Add to Cart
          </button>
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

export default StandoutProductCard;

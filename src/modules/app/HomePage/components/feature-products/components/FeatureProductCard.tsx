import React from "react";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";
import { FiPlusCircle } from "react-icons/fi";

import { ProductCardProps } from "@/types/product.types";

const FeatureProductCard = ({ id, name, oldPrice, newPrice, stockQuantity, trending, imgUrl }: ProductCardProps) => {
  const rating = 3;
  return (
    <div className="card lg:card-side bg-base-100 shadow-sm hover:shadow-lg">
      <Link href={`/product/${id}`}>
        <figure>
          <Image src={imgUrl[0]} alt={name} className="object-cover" width={177} height={177} />
        </figure>
      </Link>

      <div className="card-body">
        <Link href={`/product/${id}`}>
          {/* {name.length <= 26 ? (
            <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>
          ) : (
            <span className="card-title lg:text-base sm:text-xs text-[10px]">{name.slice(0, 26)}...</span>
          )} */}

          <span className="card-title lg:text-base sm:text-xs text-[10px]">{name}</span>

          {/* {description.length <= 64 ? (
            <span className="text-gray-primary text-xs">{description}</span>
          ) : (
            <span className="text-gray-primary text-xs">{description.slice(0, 64)}...</span>
          )} */}
        </Link>
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
        {/* <span className="text-sm font-bold text-green-600">IN STOCK</span> */}
        <span className="text-gray-secondary text-xs">
          Avalible only: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
        </span>
        <div className="card-actions ">
          <button className="btn w-full rounded-2xl border-2 border-[#634C9F] text-[#634C9F]">
            Add to Cart <FiPlusCircle className="size-4" />
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

export default FeatureProductCard;

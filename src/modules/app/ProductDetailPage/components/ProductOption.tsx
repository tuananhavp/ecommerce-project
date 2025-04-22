import React, { useState } from "react";

import clsx from "clsx";
import { AiOutlineMinus } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { CiShoppingCart } from "react-icons/ci";
import { FaShoppingBag } from "react-icons/fa";
import { FaPlus, FaRegHeart } from "react-icons/fa6";
import { GrShieldSecurity } from "react-icons/gr";
import { IoMdShare } from "react-icons/io";
import { IoGitCompareSharp } from "react-icons/io5";

import { ProductCardProps } from "@/types/product.types";

const ProductOption = ({ product }: { product: ProductCardProps }) => {
  const { name, description, oldPrice, newPrice } = product;
  const initialQuantity = 1,
    maxQuantity = 10,
    rating = 3;
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: number = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 px-2 md:px-4">
      <h2 className="text-text-primary text-xl md:text-2xl lg:text-3xl font-bold">{name}</h2>

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
      <span className="text-xs md:text-sm text-gray-secondary mt-1 md:mt-2">{description}</span>

      <div className="flex items-center gap-2">
        <span className={clsx("text-red-primary font-bold text-lg md:text-2xl lg:text-3xl", newPrice == 0 && "hidden")}>
          ${newPrice}
        </span>
        <span
          className={clsx("text-text-primary text-xs sm:text-sm", {
            "text-red-primary font-bold text-lg md:text-2xl lg:text-3xl": newPrice == 0,
            "line-through text-sm md:text-lg lg:text-xl": newPrice !== 0,
          })}
        >
          ${oldPrice}
        </span>
      </div>

      <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center gap-3 md:gap-5">
        <div className="p-1 md:p-2 border-2 border-gray-300 rounded-md flex items-center">
          <button className="px-1 md:px-2" onClick={handleDecrement} disabled={quantity <= 1}>
            <AiOutlineMinus className="text-black cursor-pointer" />
          </button>
          <input
            type="text"
            className="w-12 sm:w-16 md:w-20 lg:w-28 text-center focus:outline-none text-sm md:text-base"
            value={quantity}
            onChange={handleInputChange}
            min="1"
            max={maxQuantity}
          />
          <button className="px-1 md:px-2" onClick={handleIncrement} disabled={quantity >= maxQuantity}>
            <FaPlus className="cursor-pointer" />
          </button>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
            <button className="font-bold text-white py-2 md:py-3 px-4 md:px-6 lg:px-9 bg-green-600 rounded-lg md:rounded-xl hover:opacity-85 flex items-center gap-1 md:gap-2 cursor-pointer text-xs md:text-sm">
              <CiShoppingCart className="size-4 md:size-6" />
              <p className="item__btn-text">Add to Cart</p>
            </button>
            <button className="font-bold text-white py-2 md:py-3 px-4 md:px-6 lg:px-9 bg-[#212529] rounded-lg md:rounded-xl hover:opacity-85 flex items-center gap-1 md:gap-2 cursor-pointer text-xs md:text-sm">
              <FaShoppingBag className="size-3 md:size-4" />
              <p className="item__btn-text">Buy Now</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-2 md:mt-4">
        <div className="border-2 border-gray-200 rounded-md">
          <div className="p-2 md:p-4 flex gap-2 md:gap-4 items-start md:items-center">
            <BsWallet2 className="size-6 md:size-9 stroke-gray-400 flex-shrink-0 mt-1 md:mt-0" />
            <span className="text-gray-primary text-xs md:text-sm">
              <strong>Payment.</strong> Payment upon receipt of goods, Payment by card in the department, Google Pay,
              Online card, -5% discount in case of payment
            </span>
          </div>
        </div>
        <div className="border-2 border-gray-200 border-t-0 rounded-md">
          <div className="p-2 md:p-4 flex gap-2 md:gap-4 items-start md:items-center">
            <GrShieldSecurity className="size-6 md:size-9 flex-shrink-0 mt-1 md:mt-0" />
            <span className="text-gray-primary text-xs md:text-sm">
              <strong>Warranty.</strong> The Consumer Protection Act does not provide for the return of this product of
              proper quality.
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        <button className="btn btn-ghost btn-sm md:btn-md text-xs md:text-sm px-2 md:px-3">
          <FaRegHeart className="size-4 md:size-5" />
          <span className="hidden sm:inline">Add to Wishlist</span>
        </button>
        <button className="btn btn-ghost btn-sm md:btn-md text-xs md:text-sm px-2 md:px-3">
          <IoMdShare className="size-4 md:size-5" />
          <span className="hidden sm:inline">Share this Product</span>
        </button>
        <button className="btn btn-ghost btn-sm md:btn-md text-xs md:text-sm px-2 md:px-3">
          <IoGitCompareSharp className="size-4 md:size-5" />
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>
    </div>
  );
};

export default ProductOption;

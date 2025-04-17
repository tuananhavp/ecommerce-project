import React, { useState } from "react";

import { AiOutlineMinus } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { CiShoppingCart } from "react-icons/ci";
import { FaShoppingBag } from "react-icons/fa";
import { FaPlus, FaRegHeart } from "react-icons/fa6";
import { GrShieldSecurity } from "react-icons/gr";
import { IoMdShare } from "react-icons/io";
import { IoGitCompareSharp } from "react-icons/io5";

import { ProductCardProps } from "@/types/product.types";
import clsx from "clsx";

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
    <div className="flex flex-col gap-8">
      <h2 className="text-text-primary text-3xl font-bold">{name}</h2>

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
      <span className="text-sm text-gray-secondary mt-2.5 ">{description}</span>

      <div className="flex items-center gap-2 ">
        <span className={clsx("text-red-primary font-bold lg:text-3xl sm:text-sm text-xs", newPrice == 0 && "hidden")}>
          ${newPrice}
        </span>
        <span
          className={clsx("text-text-primary sm:text-xs text-[10px]", {
            "text-red-primary font-bold lg:text-3xl sm:text-sm text-xs": newPrice == 0,
            "line-through lg:text-xl": newPrice !== 0,
          })}
        >
          ${oldPrice}
        </span>
      </div>
      <div className="flex items-center gap-5 cursor-not-allowed">
        <div className="p-2 border-2 border-gray-300 rounded-md">
          <button className="" onClick={handleDecrement} disabled={quantity <= 1}>
            <AiOutlineMinus className="text-black cursor-pointer" height={20} width={20} />
          </button>
          <input
            type="text"
            className="w-28 text-center focus:outline-none"
            value={quantity}
            onChange={handleInputChange}
            min="1"
            max={maxQuantity}
          />
          <button className="" onClick={handleIncrement} disabled={quantity >= maxQuantity}>
            <FaPlus className="cursor-pointer" height={20} width={20} />
          </button>
        </div>
        <button className="font-bold text-white py-3 px-9 bg-green-600 rounded-xl hover:opacity-85 flex items-center gap-2 cursor-pointer">
          <CiShoppingCart className=" size-6" />
          <p className="item__btn-text">Add to Cart</p>
        </button>
        <button className="font-bold text-white py-3 px-9 bg-[#212529] rounded-xl hover:opacity-85 flex items-center gap-2 cursor-pointer">
          <FaShoppingBag />
          <p className="item__btn-text">Buy Now</p>
        </button>
      </div>

      <div className="flex flex-col">
        <div className=" border-2 border-gray-200 rounded-md">
          <div className="p-4 flex gap-4 items-center">
            <BsWallet2 className="size-9 stroke-gray-400" />
            <span className="text-gray-primary text-sm">
              <strong> Payment.</strong> Payment upon receipt of goods, Payment by card in the department, Google Pay,
              Online card, -5% discount in case of payment
            </span>
          </div>
        </div>
        <div className=" border-2 border-gray-200 border-t-0 rounded-md">
          <div className="p-4 flex gap-4 items-center">
            <GrShieldSecurity className="size-9" />
            <span className="text-gray-primary text-sm">
              <strong> Warranty.</strong> The Consumer Protection Act does not provide for the return of this product of
              proper quality.
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-ghost">
          <FaRegHeart className="sizze-8" />
          <span>Add to Wishlist</span>
        </button>
        <button className="btn btn-ghost">
          <IoMdShare className="sizze-8" />
          <span>Share this Product</span>
        </button>
        <button className="btn btn-ghost">
          <IoGitCompareSharp className="sizze-8" />
          <span>Compare</span>
        </button>
      </div>
    </div>
  );
};

export default ProductOption;

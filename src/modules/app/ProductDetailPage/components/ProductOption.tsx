import React, { useState, useEffect } from "react";

import clsx from "clsx";
import { AiOutlineMinus } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { CiShoppingCart } from "react-icons/ci";
import { FaStar, FaRegStar, FaShoppingBag } from "react-icons/fa"; // Import star icons
import { FaPlus } from "react-icons/fa6";
import { GrShieldSecurity } from "react-icons/gr";
import { IoMdShare } from "react-icons/io";
import { IoGitCompareSharp, IoHeart, IoHeartOutline } from "react-icons/io5";
import Swal from "sweetalert2";

import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";
import { CartItem } from "@/types/cart.types";
import { ProductCardProps } from "@/types/product.types";

const ProductOption = ({ product }: { product: ProductCardProps }) => {
  const { id, name, description, oldPrice, newPrice, imgUrl, stockQuantity, rating: productRating } = product;
  const initialQuantity = 1,
    maxQuantity = stockQuantity > 10 ? 10 : stockQuantity;
  // Use the product's rating or default to 0
  const rating = productRating || 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isMounted, setIsMounted] = useState(false);

  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite, fetchFavorites } = useFavoriteStore();

  const price = (newPrice ?? 0) > 0 ? newPrice : oldPrice ?? 0;

  useEffect(() => {
    const init = async () => {
      await fetchFavorites();
      setIsMounted(true);
    };

    init();
  }, [fetchFavorites]);

  const productIsFavorite = isMounted && isFavorite(id);

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

  const handleAddToCart = async () => {
    try {
      const cartItem: CartItem = {
        productID: id,
        name: name,
        price: price ?? 0,
        imgUrl: imgUrl[0],
        quantity: quantity,
      };

      await addToCart(cartItem);

      Swal.fire({
        title: "Added to Cart",
        text: `${quantity} ${quantity > 1 ? "items" : "item"} of ${name} added to your cart.`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to add item to cart",
        icon: "error",
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (productIsFavorite) {
        await removeFromFavorites(id);
        Swal.fire({
          title: "Removed from Favorites",
          text: `${name} has been removed from your favorites.`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        await addToFavorites({
          productID: id,
          name: name,
          price: price ?? 0,
          imgUrl: imgUrl[0],
        });
        Swal.fire({
          title: "Added to Favorites",
          text: `${name} has been added to your favorites.`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to update favorites",
        icon: "error",
      });
    }
  };

  // Handle buy now (you can implement this if needed)
  const handleBuyNow = () => {
    // Add to cart and redirect to checkout page
    handleAddToCart();
    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  // Function to render stars with a cleaner approach
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.round(rating) ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </span>
        ))}
        <span className="ml-2 text-xs text-gray-500">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 px-2 md:px-4">
      <h2 className="text-text-primary text-xl md:text-2xl lg:text-3xl font-bold">{name}</h2>

      {/* Replaced the rating with the new renderStars function */}
      {renderStars(rating)}

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

      {stockQuantity > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-bold text-sm">IN STOCK</span>
          <span className="text-gray-secondary text-xs">
            Available: <strong className="text-sm text-text-primary">{stockQuantity}</strong>
          </span>
        </div>
      ) : (
        <div className="text-red-600 font-bold text-sm">OUT OF STOCK</div>
      )}

      <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center gap-3 md:gap-5">
        <div className="p-1 md:p-2 border-2 border-gray-300 rounded-md flex items-center">
          <button className="px-1 md:px-2" onClick={handleDecrement} disabled={quantity <= 1 || stockQuantity <= 0}>
            <AiOutlineMinus className={clsx("cursor-pointer", stockQuantity <= 0 && "text-gray-400")} />
          </button>
          <input
            type="text"
            className={clsx(
              "w-12 sm:w-16 md:w-20 lg:w-28 text-center focus:outline-none text-sm md:text-base",
              stockQuantity <= 0 && "text-gray-400"
            )}
            value={quantity}
            onChange={handleInputChange}
            min="1"
            max={maxQuantity}
            disabled={stockQuantity <= 0}
          />
          <button
            className="px-1 md:px-2"
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity || stockQuantity <= 0}
          >
            <FaPlus className={clsx("cursor-pointer", stockQuantity <= 0 && "text-gray-400")} />
          </button>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
            <button
              className={clsx(
                "font-bold text-white py-2 md:py-3 px-4 md:px-6 lg:px-9 bg-green-600 rounded-lg md:rounded-xl hover:opacity-85 flex items-center gap-1 md:gap-2 cursor-pointer text-xs md:text-sm",
                stockQuantity <= 0 && "opacity-60 cursor-not-allowed"
              )}
              onClick={handleAddToCart}
              disabled={stockQuantity <= 0}
            >
              <CiShoppingCart className="size-4 md:size-6" />
              <p className="item__btn-text">Add to Cart</p>
            </button>
            <button
              className={clsx(
                "font-bold text-white py-2 md:py-3 px-4 md:px-6 lg:px-9 bg-[#212529] rounded-lg md:rounded-xl hover:opacity-85 flex items-center gap-1 md:gap-2 cursor-pointer text-xs md:text-sm",
                stockQuantity <= 0 && "opacity-60 cursor-not-allowed"
              )}
              onClick={handleBuyNow}
              disabled={stockQuantity <= 0}
            >
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
        <button
          className="btn btn-ghost btn-sm md:btn-md text-xs md:text-sm px-2 md:px-3 flex gap-1"
          onClick={handleToggleFavorite}
        >
          {productIsFavorite ? (
            <IoHeart className="size-4 md:size-5 text-red-500" />
          ) : (
            <IoHeartOutline className="size-4 md:size-5" />
          )}
          <span className="hidden sm:inline">{productIsFavorite ? "Remove from Wishlist" : "Add to Wishlist"}</span>
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

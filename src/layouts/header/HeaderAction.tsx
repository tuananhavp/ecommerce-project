"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IoLocationOutline, IoSearchOutline, IoHeartOutline, IoCartOutline, IoMenuSharp } from "react-icons/io5";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";

import { UserProfileDropdown } from "./HeaderDropDown";

const HeaderAction = () => {
  const { user, logout, initialize } = useAuthStore((state) => state);
  const { fetchCart, items } = useCartStore();
  const { fetchFavorites, favorites } = useFavoriteStore();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const totalCartItems = items.length;
  const totalFavorites = favorites.length;

  useEffect(() => {
    const initData = async () => {
      setIsMounted(true);
      await fetchCart();
      await fetchFavorites();
    };

    initData();
  }, [fetchCart, fetchFavorites, user]);

  useEffect(() => {
    if (user?.uid) {
      useCartStore.getState().mergeLocalCartWithUserCart();
      useFavoriteStore.getState().mergeFavoritesWithUserFavorites();
    }
  }, [user]);

  useEffect(() => {
    initialize();
    return () => {
      initialize();
    };
  }, [initialize]);
  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex gap-5 px-10 pt-3 ">
      <div className="flex gap-5 w-6/7">
        <Link className="flex items-center gap-2" href={"/"}>
          <Image src="/logo.png" className="w-10 h-auto" alt="Jin Store Logo" width={45} height={40} />
          <span className="font-bold md:text-2xl text-sm ">JinStore</span>
        </Link>

        <div className="xl:flex hidden  items-center gap-2">
          <IoLocationOutline className="size-7" />
          <div className="flex flex-col">
            <span className="md:text-[11px] text-[10px] text-gray-primary">Deliver to</span>
            <span className="md:text-[13px] text-[10px] font-bold">Your Address</span>
          </div>
        </div>

        <div className="sm:flex hidden md:min-w-2/3 min-w-1/2 px-2 items-center grow-1 bg-[#F3F4F6] shadow-sm rounded-xl">
          <input
            type="text"
            className="w-full md:text-sm text-[11px] py-2.5 px-6 bg-[#F3F4F6]  focus:outline-none  "
            placeholder="Search for Categories, products or brand..."
          />
          <IoSearchOutline className="md:size-6 size-4 right-1 top-2.5  " />
        </div>
      </div>

      <div className="sm:flex hidden items-center gap-3 px-5">
        <Link href={"/favourite"} className="relative">
          <IoHeartOutline className="md:size-8 size-4 hover:opacity-60" />
          {isMounted && totalFavorites > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs flex items-center justify-center min-w-5 h-5 px-1">
              {totalFavorites}
            </span>
          )}
        </Link>
        <Link href={"/cart"} className="relative">
          <IoCartOutline className="md:size-8 size-4 hover:opacity-60" />
          {isMounted && totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs flex items-center justify-center min-w-5 h-5 px-1">
              {totalCartItems}
            </span>
          )}
        </Link>
        <div>
          <div>
            <UserProfileDropdown user={user} handleLogout={handleLogout} />
          </div>
        </div>
      </div>

      <div className="sm:hidden flex items-center">
        <IoMenuSharp className="size-7" />
      </div>
    </div>
  );
};

export default HeaderAction;

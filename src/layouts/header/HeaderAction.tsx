"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IoSearchOutline, IoHeartOutline, IoCartOutline, IoMenuSharp } from "react-icons/io5";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favouriteStore";

import { UserProfileDropdown } from "./HeaderDropDown";
import MobileSidebar from "./MobileSidebar";

const HeaderAction = () => {
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();
  const { fetchCart, items } = useCartStore();
  const { fetchFavorites, favorites } = useFavoriteStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    await logout();
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="flex gap-5 px-4 sm:px-10 pt-3">
        <div className="flex gap-2 sm:gap-5 w-6/7">
          <Link className="flex items-center gap-1 sm:gap-2" href={"/"}>
            <Image src="/logo.png" className="w-8 sm:w-10 h-auto" alt="Jin Store Logo" width={45} height={40} />
            <span className="font-bold text-sm md:text-2xl">JinStore</span>
          </Link>

          <div className="sm:flex hidden md:min-w-2/3 min-w-1/2 px-2 items-center grow-1 bg-[#F3F4F6] shadow-sm rounded-xl">
            <input
              type="text"
              className="w-full md:text-sm text-[11px] py-2.5 px-6 bg-[#F3F4F6] focus:outline-none"
              placeholder="Search for Categories, products or brand..."
            />
            <IoSearchOutline className="md:size-6 size-4 right-1 top-2.5" />
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
            <UserProfileDropdown user={user} handleLogout={handleLogout} />
          </div>
        </div>

        <div className="sm:hidden flex items-center">
          <button
            onClick={toggleSidebar}
            className="transition-all duration-200 hover:bg-gray-100 p-2 rounded-full"
            aria-label="Toggle mobile menu"
          >
            <IoMenuSharp className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Component */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        user={user}
        onLogout={handleLogout}
        isMounted={isMounted}
        cartItemsCount={totalCartItems}
        favoritesCount={totalFavorites}
      />
    </>
  );
};

export default HeaderAction;

"use client";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  IoSearchOutline,
  IoHeartOutline,
  IoCartOutline,
  IoMenuSharp,
  IoCloseOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoGridOutline,
  IoInformationCircleOutline,
  IoCallOutline,
} from "react-icons/io5";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

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

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Prevent scrolling when sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    logout();
    setIsSidebarOpen(false);
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navigateAndClose = (path: string): void => {
    router.push(path);
    closeSidebar();
  };

  return (
    <>
      <div className="flex gap-5 px-10 pt-3">
        <div className="flex gap-5 w-6/7">
          <Link className="flex items-center gap-2" href={"/"}>
            <Image src="/logo.png" className="w-10 h-auto" alt="Jin Store Logo" width={45} height={40} />
            <span className="font-bold md:text-2xl text-sm">JinStore</span>
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

        <div className="sm:flex hidden   items-center gap-3 px-5">
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
          <button
            onClick={toggleSidebar}
            className="transition-all duration-200 hover:bg-gray-100 p-2 rounded-full"
            aria-label="Toggle mobile menu"
          >
            <IoMenuSharp className="size-7" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col z-50`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
              <Image src="/logo.png" className="w-8 h-auto" alt="Jin Store Logo" width={35} height={30} />
              <span className="font-bold text-xl">JinStore</span>
            </Link>
            <button onClick={closeSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoCloseOutline className="size-6" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b">
            {user ? (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 rounded-full p-2">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <IoPersonOutline className="size-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.displayName || user.email}</p>
                    <p className="text-xs text-gray-500">Welcome back!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={closeSidebar} className="btn btn-sm btn-primary w-full">
                  Sign In
                </Link>
                <Link href="/register" onClick={closeSidebar} className="btn btn-sm btn-outline btn-primary w-full">
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <ul className="py-2">
              <li>
                <button
                  onClick={() => navigateAndClose("/")}
                  className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                >
                  <IoHomeOutline className="size-5 text-gray-600" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndClose("/categories")}
                  className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                >
                  <IoGridOutline className="size-5 text-gray-600" />
                  <span>Categories</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndClose("/cart")}
                  className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="relative">
                    <IoCartOutline className="size-5 text-gray-600" />
                    {isMounted && totalCartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs flex items-center justify-center min-w-4 h-4 px-1">
                        {totalCartItems}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndClose("/favourite")}
                  className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="relative">
                    <IoHeartOutline className="size-5 text-gray-600" />
                    {isMounted && totalFavorites > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs flex items-center justify-center min-w-4 h-4 px-1">
                        {totalFavorites}
                      </span>
                    )}
                  </div>
                  <span>Favorites</span>
                </button>
              </li>
              {user && (
                <li>
                  <button
                    onClick={() => navigateAndClose("/orders")}
                    className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                  >
                    <IoGridOutline className="size-5 text-gray-600" />
                    <span>My Orders</span>
                  </button>
                </li>
              )}
              {user && (
                <li>
                  <button
                    onClick={() => navigateAndClose("/profile")}
                    className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                  >
                    <IoPersonOutline className="size-5 text-gray-600" />
                    <span>Profile</span>
                  </button>
                </li>
              )}
            </ul>

            <div className="border-t">
              <ul className="py-2">
                <li>
                  <button
                    onClick={() => navigateAndClose("/about")}
                    className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                  >
                    <IoInformationCircleOutline className="size-5 text-gray-600" />
                    <span>About</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateAndClose("/contact")}
                    className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
                  >
                    <IoCallOutline className="size-5 text-gray-600" />
                    <span>Contact</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Logout Button (Only if user is logged in) */}
          {user && (
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <IoLogOutOutline className="size-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderAction;

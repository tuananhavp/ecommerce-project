// src/components/MobileSidebar.tsx
import { useRef, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IoCloseOutline, IoPersonOutline, IoLogOutOutline } from "react-icons/io5";

import { NavigationItem, navigationItems } from "@/constants/header";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: "admin" | "customer";
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  isMounted: boolean;
  cartItemsCount: number;
  favoritesCount: number;
}

const MobileSidebar = ({
  isOpen,
  onClose,
  user,
  onLogout,
  isMounted,
  cartItemsCount,
  favoritesCount,
}: MobileSidebarProps) => {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const userType = user ? (user.role === "admin" ? "admin" : "customer") : "guest";

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Prevent scrolling when sidebar is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const navigateAndClose = (path: string) => {
    router.push(path);
    onClose();
  };

  // Get badge count based on type
  const getBadgeCount = (type: string | undefined): number => {
    if (type === "cart") return cartItemsCount;
    if (type === "favorite") return favoritesCount;
    return 0;
  };

  // Render navigation item
  const renderNavItem = (item: NavigationItem, index: number) => (
    <li key={index}>
      <button
        onClick={() => navigateAndClose(item.link)}
        className="flex items-center gap-3 w-full p-4 hover:bg-gray-100 transition-colors"
      >
        <div className="relative">
          {item.icon ? (
            <item.icon className="size-5 text-gray-600" />
          ) : (
            <IoPersonOutline className="size-5 text-gray-600" />
          )}
          {isMounted && item.badge && getBadgeCount(item.badge) > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs flex items-center justify-center min-w-4 h-4 px-1">
              {getBadgeCount(item.badge)}
            </span>
          )}
        </div>
        <span>{item.name}</span>
      </button>
    </li>
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image src="/logo.png" className="w-8 h-auto" alt="Jin Store Logo" width={35} height={30} />
            <span className="font-bold text-xl">JinStore</span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
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
              <Link href="/login" onClick={onClose} className="btn btn-sm btn-primary w-full">
                Sign In
              </Link>
              <Link href="/register" onClick={onClose} className="btn btn-sm btn-outline btn-primary w-full">
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <ul className="py-2">{navigationItems.main.map(renderNavItem)}</ul>

          {/* User Specific Navigation */}
          {user && (
            <>
              <div className="px-4 py-2">
                <h3 className="text-xs uppercase text-gray-500 font-semibold">Your Account</h3>
              </div>
              <ul className="py-2">{navigationItems[userType as keyof typeof navigationItems].map(renderNavItem)}</ul>
            </>
          )}

          {/* Info Navigation */}
          <div className="border-t mt-2">
            <div className="px-4 py-2">
              <h3 className="text-xs uppercase text-gray-500 font-semibold">Information</h3>
            </div>
            <ul className="py-2">{navigationItems.info.map(renderNavItem)}</ul>
          </div>
        </div>

        {/* Logout Button - Only if user is logged in */}
        {user && (
          <div className="p-4 border-t">
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <IoLogOutOutline className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSidebar;

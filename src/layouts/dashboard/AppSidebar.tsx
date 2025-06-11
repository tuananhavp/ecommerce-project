import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TiThMenu } from "react-icons/ti";

import { SIDEBAR_NAV } from "@/constants/dashboard";
import { useAuthStore } from "@/store/authStore";

import MiniSidebarNavItem from "./components/MiniSidebarNavItem";
import ProfileBadge from "./components/ProfileBadge";
import SidebarNavCategory from "./components/SidebarNavCategory";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const { user } = useAuthStore();

  const pathname = usePathname();
  const currentPath = pathname.split("/").slice(2)[0] || "";
  const isCreateProductPage = currentPath === "create-product";

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      if (!isLarge) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen flex bg-layout-primary">
      <div
        className={`sidebar bg-layout-primary overflow-hidden transition-all duration-400 ease-in-out relative ${
          isOpen ? "w-80" : "w-16"
        }`}
      >
        <div className="p-4">
          {isOpen ? (
            // Expanded Sidebar
            <>
              {/* Logo */}
              <div className="h-16 w-fit mt-3">
                <Link href="/">
                  <Image src="/logo-text.png" alt="Logo" width={150} height={40} />
                </Link>
              </div>

              {/* User Profile */}
              <ProfileBadge user={user} />

              {/* Navigation Items */}
              <ul className="menu rounded-box w-full mt-6">
                {SIDEBAR_NAV.map((item, index) => (
                  <SidebarNavCategory
                    key={`category-${index}`}
                    item={item}
                    index={index}
                    currentPath={currentPath}
                    isCreateProductPage={isCreateProductPage}
                  />
                ))}
              </ul>
            </>
          ) : (
            // Collapsed/Mini Sidebar
            <div className="flex flex-col items-center pt-16">
              {/* Mini Profile Badge */}
              <ProfileBadge user={user} isCompact={true} />

              {/* Mini Navigation Icons */}
              <div className="flex flex-col gap-6 items-center">
                {SIDEBAR_NAV.flatMap((item, catIndex) =>
                  item.navigations.map((navigation, i) => (
                    <MiniSidebarNavItem
                      key={`mini-${catIndex}-${i}`}
                      item={navigation}
                      isActive={currentPath === navigation.href}
                      isCreateProductPage={isCreateProductPage}
                      index={i}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Toggle Button - Only on large screens */}
          {isLargeScreen && (
            <button
              onClick={toggleSidebar}
              className="btn btn-primary absolute right-0 top-5"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <TiThMenu className="size-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;

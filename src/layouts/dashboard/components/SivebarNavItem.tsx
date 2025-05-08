import React from "react";

import Link from "next/link";

import clsx from "clsx";
import { IconType } from "react-icons";

interface NavigationItem {
  name: string;
  href: string;
  icon: IconType;
}

interface SidebarNavItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCreateProductPage?: boolean;
}

const SidebarNavItem = ({ item, isActive, isCreateProductPage }: SidebarNavItemProps) => {
  const isSelected = isActive || (isCreateProductPage && item.href === "product");

  return (
    <li className="group">
      <Link
        href={`/dashboard/${item.href}`}
        className={clsx(
          "btn border-none mt-3 bg-layout-primary justify-start group",
          "group-hover:bg-purple-primary group-hover:text-white rounded-3xl",
          isSelected ? "bg-purple-primary text-white" : "text-gray-primary"
        )}
      >
        <div className="p-1 rounded-full group-hover:bg-white">
          <item.icon className={clsx("size-5", "group-hover:text-black group-hover:bg-white")} />
        </div>
        {item.name}
      </Link>
    </li>
  );
};

export default SidebarNavItem;

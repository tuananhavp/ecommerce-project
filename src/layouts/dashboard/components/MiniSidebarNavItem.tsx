import React from "react";

import Link from "next/link";

import clsx from "clsx";
import { IconType } from "react-icons";

interface NavigationItem {
  name: string;
  href: string;
  icon: IconType;
}

interface MiniSidebarNavItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCreateProductPage?: boolean;
  index: number;
}

const MiniSidebarNavItem = ({ item, isActive, isCreateProductPage, index }: MiniSidebarNavItemProps) => {
  const isSelected = isActive || (isCreateProductPage && item.href === "product");

  return (
    <Link
      href={`/dashboard/${item.href}`}
      key={`mini-${index}-${item.name}`}
      className={clsx(
        "btn border-none mt-3 bg-layout-primary justify-start",
        "hover:bg-purple-primary hover:text-white rounded-3xl",
        isSelected ? "bg-purple-primary text-white" : "text-gray-primary"
      )}
    >
      <item.icon className="size-5" />
    </Link>
  );
};

export default MiniSidebarNavItem;

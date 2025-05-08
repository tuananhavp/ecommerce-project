import React from "react";

import { IconType } from "react-icons";

import SidebarNavItem from "./SivebarNavItem";

interface NavigationItem {
  name: string;
  href: string;
  icon: IconType;
}

interface NavCategory {
  category: string;
  navigations: NavigationItem[];
}

interface SidebarNavCategoryProps {
  item: NavCategory;
  index: number;
  currentPath: string;
  isCreateProductPage: boolean;
}

const SidebarNavCategory = ({ item, index, currentPath, isCreateProductPage }: SidebarNavCategoryProps) => {
  return (
    <li key={`${index}-${item.category}`}>
      <span className="text-xs">{item.category}</span>
      <ul>
        {item.navigations.map((navigation, i) => (
          <SidebarNavItem
            key={`${i}-${navigation.name}`}
            item={navigation}
            isActive={currentPath === navigation.href}
            isCreateProductPage={isCreateProductPage}
          />
        ))}
      </ul>
    </li>
  );
};

export default SidebarNavCategory;

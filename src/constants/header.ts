// src/constants/navigationItems.ts
import { IconType } from "react-icons";
import {
  IoHomeOutline,
  IoGridOutline,
  IoCartOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoInformationCircleOutline,
  IoCallOutline,
  IoReceiptOutline,
} from "react-icons/io5";

export interface NavigationItem {
  name: string;
  link: string;
  icon?: IconType;
  badge?: "cart" | "favorite";
}

export interface NavigationItems {
  main: NavigationItem[];
  info: NavigationItem[];
  customer: NavigationItem[];
  admin: NavigationItem[];
  guest: NavigationItem[];
}

export const navigationItems: NavigationItems = {
  main: [
    { name: "Home", link: "/", icon: IoHomeOutline },
    { name: "Categories", link: "/product/category", icon: IoGridOutline },
    { name: "Cart", link: "/cart", icon: IoCartOutline, badge: "cart" },
    { name: "Favorites", link: "/favourite", icon: IoHeartOutline, badge: "favorite" },
  ],
  info: [
    { name: "About", link: "/", icon: IoInformationCircleOutline },
    { name: "Contact", link: "/", icon: IoCallOutline },
  ],
  customer: [
    { name: "Profile", link: "/profile", icon: IoPersonOutline },
    { name: "Check Out", link: "/checkout", icon: IoReceiptOutline },
    { name: "Order Tracking", link: "/orders", icon: IoReceiptOutline },
  ],
  admin: [
    { name: "Dashboard", link: "/dashboard", icon: IoGridOutline },
    { name: "Products", link: "/dashboard/product", icon: IoGridOutline },
    { name: "Orders", link: "/dashboard/order", icon: IoReceiptOutline },
    { name: "Users", link: "/dashboard/user", icon: IoPersonOutline },
    { name: "Profile", link: "/profile", icon: IoPersonOutline },
  ],
  guest: [
    { name: "Login", link: "/login" },
    { name: "Register", link: "/register" },
  ],
};
export const HEADER_SUB_LINKS = [
  {
    link: "/product",
    name: "About us",
  },
  {
    link: "/product",
    name: "Whitelist",
  },
  {
    link: "/product",
    name: "Contact",
  },
];

export const HEADER_NAV_LINKS = [
  {
    link: "/",
    name: "Home",
    list: true,
  },
  {
    link: "/product/category",
    name: "Shop",
    list: true,
  },
  {
    link: "/product/category/vegetables",
    name: "Fruits & Vegetables",
    list: false,
  },
  {
    link: "/product/category/beverages",
    name: "Beverages",
    list: false,
  },
];

export const LOCALE_SETTINGS = [
  {
    title: "English",
    options: ["Vietnam", "China", "Thailand"],
  },
  {
    title: "USD",
    options: ["EUR", "CNY", "CAD"],
  },
];

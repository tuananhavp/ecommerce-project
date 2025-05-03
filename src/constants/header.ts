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
    link: "/product",
    name: "Home",
    list: true,
  },
  {
    link: "/product",
    name: "Shop",
    list: true,
  },
  {
    link: "/product",
    name: "Fruits & Vegetables",
    list: false,
  },
  {
    link: "/product",
    name: "Beverages",
    list: false,
  },
  {
    link: "/product",
    name: "Blog",
    list: false,
  },
  {
    link: "/product",
    name: "Contact",
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

export const navigationItems = {
  customer: [
    { name: "Profile", link: "/profile" },
    { name: "Check Out", link: "/checkout" },
    { name: "Order Tracking", link: "/orders" },
  ],
  admin: [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Products", link: "/dashboard/product" },
    { name: "Orders", link: "/dashboard/order" },
    { name: "Users", link: "/dashboard/user" },
    { name: "Profile", link: "/profile" },
  ],
  guest: [
    { name: "Login", link: "/login" },
    { name: "Register", link: "/login" },
  ],
};

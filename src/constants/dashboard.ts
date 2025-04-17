import { BsBorderAll } from "react-icons/bs";
import { FiUserCheck } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdErrorOutline, MdLockOutline } from "react-icons/md";
import { RiAccountCircle2Line } from "react-icons/ri";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export const sidebarNav = [
  {
    category: "E-Commerce",
    navigations: [
      {
        name: "Dashboard",
        icon: TbBrandGoogleAnalytics,
        href: "",
      },
      {
        name: "Orders",
        icon: BsBorderAll,
        href: "orders",
      },
      {
        name: "Products",
        icon: LiaShippingFastSolid,
        href: "products",
      },
      {
        name: "Customers",
        icon: FiUserCheck,
        href: "customers",
      },
    ],
  },
  {
    category: "Apps",
    navigations: [
      {
        name: "Profile",
        icon: ImProfile,
        href: "profile",
      },
      {
        name: "Users",
        icon: RiAccountCircle2Line,
        href: "users",
      },
      {
        name: "Authentication",
        icon: MdLockOutline,
        href: "authentication",
      },
      {
        name: "Error Pages",
        icon: MdErrorOutline,
        href: "error-pages",
      },
    ],
  },
];

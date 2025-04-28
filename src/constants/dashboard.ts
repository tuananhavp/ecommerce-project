import { BsBorderAll } from "react-icons/bs";
import { FiUserCheck } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdErrorOutline, MdLockOutline } from "react-icons/md";
import { RiAccountCircle2Line } from "react-icons/ri";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export const SIDEBAR_NAV = [
  {
    category: "E-Commerce",
    navigations: [
      {
        name: "Dashboard",
        icon: TbBrandGoogleAnalytics,
        href: "",
      },
      {
        name: "Order",
        icon: BsBorderAll,
        href: "order",
      },
      {
        name: "Product",
        icon: LiaShippingFastSolid,
        href: "product",
      },
      {
        name: "Customer",
        icon: FiUserCheck,
        href: "customer",
      },
    ],
  },
  {
    category: "App",
    navigations: [
      {
        name: "Profile",
        icon: ImProfile,
        href: "profile",
      },
      {
        name: "User",
        icon: RiAccountCircle2Line,
        href: "user",
      },
      {
        name: "Authentication",
        icon: MdLockOutline,
        href: "authentication",
      },
      {
        name: "Error Page",
        icon: MdErrorOutline,
        href: "error-page",
      },
    ],
  },
];

import Link from "next/link";

import { CgProfile } from "react-icons/cg";

import { navigationItems } from "@/constants/header";
import { EnhancedUser } from "@/types/auth.types";

interface UserProfileDropdownProps {
  user: EnhancedUser | null;
  handleLogout?: () => void;
}

interface NavItem {
  name: string;
  link: string;
}

export const UserProfileDropdown = ({ user, handleLogout }: UserProfileDropdownProps) => {
  const getNavigationItems = (): NavItem[] => {
    if (!user) {
      return navigationItems.guest;
    }
    return user.role === "customer" ? navigationItems.customer : navigationItems.admin;
  };

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-ghost btn-circle m-1">
        <CgProfile className="md:size-8 size-4 hover:opacity-60" />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[100] w-44 p-2 text-sm shadow-lg mt-2">
        {user ? (
          <>
            <div className="px-3 py-2 text-xs text-gray-500 border-b mb-1 border-gray-300">
              <p className="font-semibold text-primary">Hi, {user.username || "User"}</p>
              <p className="truncate">{user.email}</p>
            </div>

            {getNavigationItems().map((item, index) => (
              <li key={index}>
                <Link href={item.link} className="hover:bg-gray-100">
                  {item.name}
                </Link>
              </li>
            ))}

            <li className="border-t mt-1 border-gray-200">
              <button onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            {navigationItems.guest.map((item, index) => (
              <li key={index}>
                <Link href={item.link} className={`${item.name === "Login" ? "font-medium" : ""}`}>
                  {item.name}
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
    </details>
  );
};

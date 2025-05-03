import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import clsx from "clsx";
import { TiThMenu } from "react-icons/ti";

import { SIDEBAR_NAV } from "@/constants/dashboard";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const pathName = usePathname().split("/").slice(2)[0] || "";
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

  return (
    <div className="min-h-screen flex bg-layout-primary">
      <div
        className={`sidebar bg-layout-primary overflow-hidden ${
          isOpen ? "w-80" : "w-16"
        } transition-all duration-400 ease-in-out relative`}
      >
        <div className="p-4">
          {isOpen ? (
            <>
              <div className="h-16 w-fit mt-3">
                <Link href={"/dashboard"}>
                  <Image src={"/logo-text.png"} alt="Logo" width={150} height={40} />
                </Link>
              </div>

              <div className="flex gap-3 p-2 overflow-hidden">
                <div className="avatar">
                  <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2 h-10">
                    <Image src={"/avatar.png"} alt="Logo" width={50} height={50} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-purple-primary font-bold text-md overflow-hidden">Ngô Tuấn Anh</span>
                  <span className="text-gray-primary text-xs mt-1 overflow-hidden">Sales Manager</span>
                </div>
              </div>

              <ul className="menu rounded-box w-full mt-6">
                {SIDEBAR_NAV.map((item, index) => (
                  <li key={`${index} + ${item.category}`}>
                    <span className="text-xs">{item.category}</span>
                    <ul>
                      {item.navigations.map((navigation, i) => (
                        <li key={`${i}-${navigation.name}`} className="group">
                          <Link
                            href={`/dashboard/${navigation.href}`}
                            className={clsx(
                              "btn border-none mt-3 bg-layout-primary justify-start group group-hover:bg-purple-primary group-hover:text-white rounded-3xl",
                              pathName === navigation.href ? "bg-purple-primary text-white" : "text-gray-primary",
                              pathName == "create-product" && navigation.href == "product"
                                ? "bg-purple-primary text-white"
                                : "text-gray-primary"
                            )}
                          >
                            <div className="p-1 rounded-full group-hover:bg-white">
                              <navigation.icon className="group-hover:text-black group-hover:bg-white size-5" />
                            </div>
                            {navigation.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center pt-16">
              {/* Mini Sidebar */}
              <div className="avatar mb-6">
                <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
                  <Image src={"/avatar.png"} alt="Logo" width={50} height={50} />
                </div>
              </div>

              <div className="flex flex-col gap-6 items-center">
                {SIDEBAR_NAV.flatMap((item) =>
                  item.navigations.map((navigation, i) => (
                    <Link
                      href={`/dashboard/${navigation.href}`}
                      key={`mini-${i} + ${navigation.name}`}
                      className={clsx(
                        "btn border-none mt-3 bg-layout-primary justify-start hover:bg-purple-primary hover:text-white rounded-3xl",
                        pathName === navigation.href ? "bg-purple-primary text-white" : "text-gray-primary",
                        pathName == "create-product" && navigation.href == "product"
                          ? "bg-purple-primary text-white"
                          : "text-gray-primary"
                      )}
                    >
                      <navigation.icon className="size-5" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

          {isLargeScreen && (
            <button onClick={() => setIsOpen(!isOpen)} className="btn btn-primary absolute right-0 top-5">
              <TiThMenu className="size-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;

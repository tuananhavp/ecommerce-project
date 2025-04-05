import { headerSubLinks, localeSettings } from "../../constants/header";
import Link from "next/link";
import Dropdown from "@/components/Dropdown";

const HeaderOption = () => {
  return (
    <div className="sm:text-xs text-[10px] text-gray-primary ">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <div className="flex p-3">
          <nav className="md:border-r-2 border-0 pr-2.5">
            {headerSubLinks.map((nav, index) => {
              return (
                <Link key={index} href={nav.link} className={`"hover:opacity-60" ${index > 0 ? "pl-3" : ""}`}>
                  {nav.name}
                </Link>
              );
            })}
          </nav>
          <div className="text-xs pl-3 hidden md:block">
            <p>
              We deliver to you every day from <span className="text-red-500 font-bold">7:00 to 23:00</span>
            </p>
          </div>
        </div>
        <div className="sm:block hidden">
          <nav className="text-xs text-gray-primary pr-2.5 flex gap-2">
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                {localeSettings.map((item, index) => {
                  return (
                    <li key={index}>
                      <Dropdown title={item.title} options={item.options} />
                    </li>
                  );
                })}

                <li>
                  <Link href={"/"}>Order Tracking</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderOption;

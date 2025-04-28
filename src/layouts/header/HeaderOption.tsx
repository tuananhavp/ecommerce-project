import Link from "next/link";

import { HEADER_SUB_LINKS } from "../../constants/header";

const HeaderOption = () => {
  return (
    <div className="sm:text-xs text-[10px] text-gray-primary ">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <div className="flex p-3">
          <nav className="md:border-r-2 border-0 pr-2.5">
            {HEADER_SUB_LINKS.map((nav, index) => {
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
      </div>
    </div>
  );
};

export default HeaderOption;

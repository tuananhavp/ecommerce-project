import Link from "next/link";

import { RiArrowDropDownLine } from "react-icons/ri";

import { HEADER_NAV_LINKS } from "../../constants/header";

const Navigation = () => {
  return (
    <nav className="font-bold md:text-sm sm:flex hidden text-[10px] mt-5 justify-center">
      <div className="w-6/7 flex gap-6">
        {HEADER_NAV_LINKS.map((nav, index) => {
          return (
            <div key={index} className="flex items-center">
              <Link href={nav.link} className="hover:opacity-60">
                {nav.name}
              </Link>
              {nav.list && <RiArrowDropDownLine />}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

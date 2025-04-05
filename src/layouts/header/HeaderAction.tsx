import { IoLocationOutline, IoSearchOutline, IoHeartOutline, IoCartOutline, IoMenuSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import Image from "next/image";

const HeaderAction = () => {
  return (
    <div className="flex gap-5 px-10 pt-3 ">
      <div className="flex gap-5 w-6/7">
        <Link className="flex items-center gap-2" href={"/"}>
          <Image src={logo} className="size-10" alt="" />
          <span className="font-bold md:text-2xl text-sm ">JinStore</span>
        </Link>

        <div className="xl:flex hidden  items-center gap-2">
          <IoLocationOutline className="size-7" />
          <div className="flex flex-col">
            <span className="md:text-[11px] text-[10px] text-gray-primary">Deliver to</span>
            <span className="md:text-[13px] text-[10px] font-bold">Your Address</span>
          </div>
        </div>

        <div className="sm:flex hidden md:min-w-2/3 min-w-1/2 px-2 items-center grow-1 bg-[#F3F4F6] shadow-sm rounded-xl">
          <input
            type="text"
            className="w-full md:text-sm text-[11px] py-2.5 px-6 bg-[#F3F4F6]  focus:outline-none  "
            placeholder="Search for Categories, products or brand..."
          />
          <IoSearchOutline className="md:size-6 size-4 right-1 top-2.5  " />
        </div>
      </div>

      <div className="sm:flex hidden items-center gap-3 px-5">
        <IoHeartOutline className="md:size-8 size-4 hover:opacity-60" />
        <IoCartOutline className="md:size-8 size-4 hover:opacity-60" />
        <div>
          <CgProfile className="md:size-8 size-4 hover:opacity-60" />
        </div>
      </div>

      <div className="sm:hidden flex items-center">
        <IoMenuSharp className="size-7" />
      </div>
    </div>
  );
};

export default HeaderAction;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./../assets/logo.png";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import {
  IoLocationOutline,
  IoSearchOutline,
  IoHeartOutline,
  IoCartOutline,
  IoMenuSharp,
} from "react-icons/io5";

const Header = () => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    // const endDate = new Date("2025-04-30T23:59:59"); // Thời gian kết thúc (ví dụ: ngày 30 tháng 4, 2025)

    const interval = setInterval(() => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + 30);
      endDate.setHours(23, 59, 59);
      const timeRemaining = endDate - now;
      // console.log(now, endDate);

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval khi component unmount
  }, []);

  return (
    <header>
      {/* Header Top for Sale */}
      <div className=" hidden w-full h-10 bg-[#634C9F] font-inter text-white p-7 text-sm md:flex items-center">
        <div className="flex 2xl:justify-between items-center w-3/4 mx-auto justify-center">
          <h4 className="2xl:inline-block hidden">
            FREE delivery & 40% Discount for next 3 orders! Place your 1st order
            in.
          </h4>
          <div className="flex items-center">
            <h4 className="2xl:hidden block">
              Discount for your next 3 orders:{" "}
            </h4>
            <p className="text-md">
              <span className="2xl:inline-block hidden">
                Until the end of the sale:
              </span>
              <strong className="pl-2.5 text-lg">{timeLeft.days}</strong> days
              <strong className="pl-2.5 text-lg">{timeLeft.hours}</strong> hours
              <strong className="pl-2.5 text-lg">
                {timeLeft.minutes}
              </strong>{" "}
              minutes
              <strong className="pl-2.5 text-lg">
                {timeLeft.seconds}
              </strong>{" "}
              seconds
            </p>
          </div>
        </div>
      </div>

      {/* Header for option */}
      <div className="sm:text-xs text-[10px] text-gray-primary ">
        <div className="w-11/12 mx-auto flex justify-between items-center">
          {/* Option left */}
          <div className="flex p-3">
            {/* Navigation */}
            <nav className="md:border-r-2 border-0 pr-2.5">
              <Link to={"/product"} className="hover:opacity-60">
                About us
              </Link>
              <Link to={"/product"} className="pl-3 hover:opacity-60">
                Whitelist
              </Link>
              <Link to={"/product"} className="pl-3 hover:opacity-60">
                Contact
              </Link>
            </nav>
            {/* Deliver time */}
            <div className="text-xs pl-3 hidden md:block">
              <p>
                We deliver to you every day from{" "}
                <span className="text-red-500 font-bold">7:00 to 23:00</span>
              </p>
            </div>
          </div>
          {/* Option Right */}
          <div className="sm:block hidden">
            {/* Navigation */}
            <nav className="text-xs text-gray-primary pr-2.5 flex gap-2">
              <div className="flex items-center">
                <Link to={"/product"} className="">
                  English
                </Link>
                <RiArrowDropDownLine />
              </div>
              <div className="flex items-center">
                <Link to={"/product"} className="">
                  USD
                </Link>
                <RiArrowDropDownLine />
              </div>
              <div className="flex items-center">
                <Link to={"/product"} className="">
                  Order Tracking
                </Link>
                <RiArrowDropDownLine />
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Header for logo */}
      <div className="flex gap-5 px-10 pt-3 ">
        <div className="flex gap-5 w-6/7">
          {/* Logo */}
          <Link className="flex items-center gap-2" to={"/"}>
            <img src={logo} className="size-10" alt="" />
            <span className="font-bold md:text-2xl text-sm ">JinStore</span>
          </Link>
          {/* Deliver */}
          <div className="xl:flex hidden  items-center gap-2">
            <IoLocationOutline className="size-7" />
            <div className="flex flex-col">
              <span className="md:text-[11px] text-[10px] text-gray-primary">
                Deliver to
              </span>
              <span className="md:text-[13px] text-[10px] font-bold">
                Your Address
              </span>
            </div>
          </div>
          {/* Search Bar */}
          <div className="sm:flex hidden md:min-w-2/3 min-w-1/2 px-2 items-center grow-1 bg-[#F3F4F6] shadow-sm rounded-xl">
            <input
              type="text"
              className="w-full md:text-sm text-[11px] py-2.5 px-6 bg-[#F3F4F6]  focus:outline-none  "
              placeholder="Search for Categories, products or brand..."
            />
            <IoSearchOutline className="md:size-6 size-4 right-1 top-2.5  " />
          </div>
        </div>
        {/* Action */}
        <div className="sm:flex hidden items-center gap-3 px-5">
          <IoHeartOutline className="md:size-8 size-4 hover:opacity-60" />
          <IoCartOutline className="md:size-8 size-4 hover:opacity-60" />
          {/* Profile Status */}
          <div>
            <CgProfile className="md:size-7 size-4 hover:opacity-60" />
          </div>
        </div>
        {/* Menu Side bar */}
        <div className="sm:hidden flex items-center">
          <IoMenuSharp className="size-7" />
        </div>
      </div>
      {/* Navigation */}
      <nav className="font-bold md:text-sm sm:flex hidden text-[10px] mt-5 justify-center">
        <div className="w-6/7 flex gap-6">
          <div className="flex items-center">
            <Link to={"/product"} className="hover:opacity-60">
              Home
            </Link>
            <RiArrowDropDownLine />
          </div>
          <div className="flex items-center">
            <Link to={"/product"} className="hover:opacity-60">
              Shop
            </Link>
            <RiArrowDropDownLine />
          </div>
          <Link to={"/product"} className="pl-3 hover:opacity-60">
            Fruits & Vegetables
          </Link>{" "}
          <Link to={"/product"} className="hover:opacity-60">
            Beverages
          </Link>
          <Link to={"/product"} className="pl-3 hover:opacity-60">
            Blog
          </Link>
          <Link to={"/product"} className="pl-3 ">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

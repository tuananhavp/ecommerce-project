import React from "react";

import Link from "next/link";

import { IoAddCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";

const AppHeader = () => {
  return (
    <div className="navbar flex-grow  max-h-20 bg-layout-primary gap-10 px-5">
      <div className="">
        <a className="btn btn-ghost text-xl">Overview</a>
      </div>
      <div className="flex-1/2 outline-none">
        <label className="input w-full bg-white px-6 py-1.5 border-none shadow-md rounded-2xl focus:outline-none ">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow px-3" placeholder="Search" />
        </label>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <IoNotificationsOutline className="size-5" />
              <span className="badge badge-secondary badge-xs indicator-item">8</span>
            </div>
          </div>
          <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <LuShoppingCart className="size-5" />

              <span className="badge badge-secondary badge-xs indicator-item">8</span>
            </div>
          </div>
          <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
        <Link href={"/dashboard/products/create-product"}>
          <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-purple-primary text-white ml-3 text-sm rounded-2xl hover:opacity-85">
            <IoAddCircleOutline className="size-5" />
            Add Product
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AppHeader;

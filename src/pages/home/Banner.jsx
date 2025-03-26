import React from "react";
import bannerImage from "./../../assets/banner.png";
import { Link } from "react-router-dom";
const Banner = () => {
  return (
    <section className="mt-6 ">
      <div className="min-w-full min-h-full relative ">
        <img
          className="w-full h-full object-contain"
          src={bannerImage}
          alt=""
        />
        <div className="absolute left-2/12 top-2/12 w-1/3">
          <p className="inline-block text-xs text-[#166534] p-1.5 bg-gradient-to-r from-green-400 via-green-300 to-white rounded-xs">
            Weekend Discount
          </p>
          <h2 className="text-5xl text-[#39245F] font-bold tracking-wide mt-4">
            Shopping with us for better quality and the best price
          </h2>
          <p className="text-text-primary mt-3 inline-block w-4/5">
            We have prepared special discounts for you on grocery products.
            Don't miss these opportunities...
          </p>
          <div className="flex gap-3 mt-3">
            <button className="bg-purple-800 py-2 px-5 rounded-md text-white font-bold hover:opacity-85">
              <Link to={""}>Shop Now</Link>
            </button>
            <div className="">
              <div className="flex items-center gap-2">
                <p className="text-red-primary font-bold text-2xl">$21.67</p>
                <p className="text-heading-primary font-bold line-through">
                  $26.67
                </p>
              </div>
              <p className="text-xs text-gray-primary">
                Don't miss this limited time offer.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 justify-center absolute -bottom-5 left-1/2 p-3 bg-white rounded-2xl ">
          <div className="size-3  bg-[#634C9F] rounded-full"></div>
          <div className="size-3 bg-[#E5E7EB] rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

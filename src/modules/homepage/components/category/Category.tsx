import React from "react";
import { capitalizeFirstLetter } from "@/helpers";
import categoryBanner from "./../../../../../public/category-banner.png";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { categories } from "../../constants";
import CategoryCard from "./components/CategoryCard";

const Category = () => {
  return (
    <section className="flex flex-col justify-center items-center">
      <div className="w-10/12">
        <div className=" flex justify-between items-center mt-6">
          <div className="flex justify-between items-center gap-5">
            <h2 className="text-heading-primary font-bold md:text-xl text-xs">Shop by Category</h2>
            <span className="md:block hidden text-shadow-gray-third font-light leading-8 lg:text-sm text-xs">
              New products with updated stocks.
            </span>
          </div>
          <Link href={"/"} className="border-2 border-gray-100 rounded-2xl p-3 hover:text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text[#212529] sm:text-sm text-[10px] ">View All</span>
              <FaArrowRight />
            </div>
          </Link>
        </div>
        <div className="grid md:grid-rows-1 grid-rows-2 md:grid-cols-5 grid-cols-3 gap-4 mt-6">
          {categories.map((category, index) => {
            return (
              <CategoryCard name={capitalizeFirstLetter(category.name)} imageUrl={category.imageUrl} key={index} />
            );
          })}
        </div>
        <div className="w-full h-fit relative mt-16 lg:block hidden ">
          <Image src={categoryBanner} alt={"category banner"} className="w-full h-auto object-contain" />
          <div className="absolute top-3 left-4">
            <h3 className="text-[#EA580C] xl:text-2xl text-sm font-bold">
              In store or online your health & safety is our top priority
            </h3>
            <span className="xl:text-sm text-[10px] text-gray-secondary">
              The only supermarket that makes your life easier, makes you enjoy life and makes it better
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;

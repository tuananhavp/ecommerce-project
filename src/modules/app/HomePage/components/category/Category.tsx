import React from "react";

import Image from "next/image";

import { capitalizeFirstLetter } from "@/helpers";

import { CATEGORIES } from "../../constants";

import CategoryCard from "./components/CategoryCard";

const Category = () => {
  return (
    <section className="flex flex-col items-center py-6 sm:py-8 md:py-10">
      <div className="w-11/12 sm:w-10/12 px-2 sm:px-0">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-heading-primary font-bold text-sm sm:text-lg md:text-xl">Shop by Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {CATEGORIES.map((category, index) => (
            <CategoryCard name={capitalizeFirstLetter(category.name)} imageUrl={category.image_url} key={index} />
          ))}
        </div>

        <div className="w-full h-fit relative mt-8 sm:mt-12 md:mt-16 hidden sm:block">
          <Image
            src="/category-banner.png"
            alt={"Banner Category Image"}
            width={1000}
            height={100}
            className="w-full h-auto object-contain rounded-lg"
            priority={false}
          />
          <div className="absolute top-2 sm:top-3 left-3 sm:left-4 w-3/5 sm:w-2/3 md:w-1/2">
            <h3 className="text-[#EA580C] text-xs sm:text-base md:text-xl lg:text-2xl font-bold leading-tight">
              In store or online your health & safety is our top priority
            </h3>
            <span className="text-[10px] sm:text-xs md:text-sm text-gray-secondary block mt-1 sm:mt-2">
              The only supermarket that makes your life easier, makes you enjoy life and makes it better
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;

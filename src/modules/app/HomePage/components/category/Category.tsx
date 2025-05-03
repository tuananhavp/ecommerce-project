import React from "react";

import Image from "next/image";

import { capitalizeFirstLetter } from "@/helpers";

import { CATEGORIES } from "../../constants";

import CategoryCard from "./components/CategoryCard";

const Category = () => {
  return (
    <section className="flex flex-col items-center">
      <div className="w-10/12">
        <div className=" flex justify-between items-center mt-6">
          <div className="flex justify-between items-center gap-5">
            <h2 className="text-heading-primary font-bold md:text-xl text-xs">Shop by Category</h2>
          </div>
        </div>
        <div className="grid md:grid-rows-1 grid-rows-2 md:grid-cols-5 grid-cols-3 gap-4 mt-6">
          {CATEGORIES.map((category, index) => {
            return (
              <CategoryCard name={capitalizeFirstLetter(category.name)} imageUrl={category.image_url} key={index} />
            );
          })}
        </div>
        <div className="w-full h-fit relative mt-16 lg:block hidden ">
          <Image
            src="/category-banner.png"
            alt={"Banner Category Image"}
            width={1000}
            height={100}
            className="w-full h-auto object-contain "
          />
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

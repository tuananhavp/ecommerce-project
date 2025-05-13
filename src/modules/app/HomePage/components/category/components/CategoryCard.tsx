import React from "react";

import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
}

const CategoryCard = ({ name, imageUrl }: CategoryCardProps) => {
  const categorySlug = name.toLowerCase();

  return (
    <Link href={`/product/category/${categorySlug}`} className="block">
      <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-center items-center rounded-lg p-2 sm:p-3">
        <figure className="px-2 pt-2 pb-1">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
              className="object-contain"
            />
          </div>
        </figure>
        <div className="card-body p-1 sm:p-2 text-center">
          <h2 className="card-title justify-center text-[10px] xs:text-xs sm:text-sm md:text-base font-medium">
            {name}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

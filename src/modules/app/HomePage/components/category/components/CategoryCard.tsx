import React from "react";

import Image from "next/image";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
}
const CategoryCard = ({ name, imageUrl }: CategoryCardProps) => {
  return (
    <div className="card bg-base-100 shadow-md flex flex-col justify-center items-center hover:shadow-xl ">
      <figure>
        <Image src={imageUrl} alt={name} width={100} height={100} />
      </figure>
      <div className="card-body">
        <h2 className="card-title lg:text-base sm:text-xs text-[10px] ">{name}</h2>
      </div>
    </div>
  );
};

export default CategoryCard;

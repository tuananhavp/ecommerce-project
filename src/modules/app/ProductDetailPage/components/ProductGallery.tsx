import React, { useState } from "react";

import Image from "next/image";

import Loading from "@/components/Loading";
import { ProductCardProps } from "@/types/product.types";

const ProductGallery = ({ product }: { product: ProductCardProps }) => {
  const { imgUrl: images } = product;
  const [mainImage, setMainImage] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleThumbnailHover = (image: string, index: number) => {
    setMainImage(image);
    setActiveIndex(index);
  };

  if (!product)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="flex justify-center items-center rounded-lg overflow-hidden">
        <Image
          className="object-cover rounded-md"
          src={mainImage ? mainImage : "/logo.png"}
          alt="Product main view"
          width={660}
          height={660}
          priority
        />
      </div>

      <div className="flex items-center justify-center mt-2 md:mt-4">
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6 overflow-x-auto py-2 w-full justify-center">
          {images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-200 flex-shrink-0 ${
                activeIndex === index
                  ? "border-2 border-blue-500 rounded-md p-0.5 md:p-1"
                  : "hover:border-2 hover:border-blue-400 border-2 border-white rounded-md p-0.5 md:p-1"
              }`}
              onMouseEnter={() => handleThumbnailHover(image, index)}
              onClick={() => handleThumbnailHover(image, index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className="rounded-sm w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;

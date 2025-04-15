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
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <Loading />
    </div>;

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-200 ${
                activeIndex === index
                  ? "border-2 border-blue-500 rounded-md p-1"
                  : "hover:border-2 hover:border-blue-400 border-2 border-white rounded-md p-1"
              }`}
              onMouseEnter={() => handleThumbnailHover(image, index)}
            >
              <Image src={image} alt={`Thumbnail ${index + 1}`} width={73} height={73} className="rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;

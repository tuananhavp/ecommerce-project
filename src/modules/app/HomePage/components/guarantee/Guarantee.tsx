import React from "react";

import Image from "next/image";

import { guaranteeData } from "./constants";

const Guarantee = () => {
  return (
    <div className="grid 2xl:grid-cols-4 md:grid-cols-2 gap-8 w-10/12 mx-auto mt-20 mb-32 ">
      {guaranteeData.map((item, index) => {
        return (
          <div key={index} className="flex gap-6 items-center shadow-md hover:shadow-xl rounded-lg p-5">
            <Image
              src={item.imgUrl}
              alt={`${item.heading} ${index}`}
              width={57}
              height={57}
              className="size-14 object-cover"
            />
            <div className="flex flex-col gap-2">
              <span className="text-text-primary font-bold">{item.heading}</span>
              <span className="text-gray-primary text-xs">{item.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Guarantee;

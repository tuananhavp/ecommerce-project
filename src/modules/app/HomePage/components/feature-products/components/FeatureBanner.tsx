import React from "react";

import Image from "next/image";
import Link from "next/link";

import { FaArrowRightLong } from "react-icons/fa6";

import { featureBanner } from "../constants";

const FeatureBanner = () => {
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row ">
      {featureBanner.map((item, index) => {
        const [firstPart, secondPart] = item.title.split(" ").reduce(
          (acc, word, idx) => {
            if (idx < 3) acc[0] += ` ${word}`;
            else acc[1] += ` ${word}`;
            return acc;
          },
          ["", ""]
        );
        return (
          <div key={index} className="card rounded-box grid grow place-items-center">
            <div className="relative w-full h-fit">
              <Image src={item.image} alt="Background for grocery" width={1300} height={500} />
              <div className="absolute inset-5 flex items-center z-10">
                <div className="flex flex-col justify-center gap-2">
                  <span className="p-2 w-fit rounded-2xl bg-[#FFEDD5] text-[#7C2D12] md:text-xs text-[10px]">
                    Only This Week
                  </span>
                  <h2 className="text-heading-primary font-bold lg:text-2xl text-xs">
                    <span>{firstPart.trim()}</span>
                    <br />
                    <span>{secondPart.trim()}</span>
                  </h2>
                  <span className="md:block hidden text-shadow-gray-third font-light leading-8 lg:text-sm text-xs">
                    {item.description}
                  </span>
                  <Link href={item.link} className="btn bg-white text-text-primary xl:mt-5">
                    <div className="flex items-center gap-1">
                      <span className="md:text-base text-[11px]">Shop Now</span>
                      <FaArrowRightLong />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureBanner;

import React from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { bannerContent } from "../../constants";

const Banner = () => {
  return (
    <section className="mt-6 ">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {bannerContent.map((item, index) => {
          return (
            <>
              <SwiperSlide key={index}>
                <div className="min-w-full min-h-full relative ">
                  <Image
                    className="w-full h-full object-contain"
                    src={item.imageUrl}
                    width={1200}
                    height={500}
                    alt=""
                  />
                  <div className="absolute left-1/12 top-2/12 lg:w-1/3 w-6/12">
                    <p className="inline-block xl:text-xs md:text-[11px] text-[6px] text-[#166534] p-1 bg-gradient-to-r from-green-400 via-green-300 to-white rounded-xs">
                      Weekend Discount
                    </p>
                    <h2 className="xl:text-5xl md:text-2xl sm:inline-block hidden text-base text-[#39245F] font-bold tracking-wide mt-4">
                      {item.heading}
                    </h2>
                    <p className="text-text-primary mt-3 inline-block w-4/5 xl:text-base md:text-xs sm:text-[8px] text-[6px]">
                      {item.subtitle}
                    </p>
                    <div className="flex gap-3 sm:mt-3 mt-0">
                      <button className="py-2 px-0.5 text-white rounded-md bg-purple-primary xl:py-4 xl:px-10 xl:text-base sm:text-xs text-[6px]">
                        <Link href={""}>Shop Now</Link>
                      </button>
                      <div className="">
                        <div className="flex items-center gap-2 ">
                          <p className="text-red-primary font-bold xl:text-2xl md:text-base sm:text-xs text-[8px]">
                            {item.discountPrice}
                          </p>
                          <p className="text-heading-primary font-bold line-through xl:text-base md:text-sm sm:text-[9px] text-[6px]">
                            {item.originalPrice}
                          </p>
                        </div>
                        <p className="xl:text-xs text-[7px] text-gray-primary sm:block hidden">
                          Dont miss this limited time offer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Banner;

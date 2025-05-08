import React from "react";

import Image from "next/image";
interface GuaranteeCardProps {
  image_url: string;
  heading: string;
  description: string;
}
const GuaranteeCard = ({ image_url, heading, description }: GuaranteeCardProps) => {
  return (
    <>
      <div className="flex gap-6 items-center shadow-md hover:shadow-xl rounded-lg p-5">
        <Image src={image_url} alt={`${heading} `} width={57} height={57} className="size-14 object-cover" />
        <div className="flex flex-col gap-2">
          <span className="text-text-primary font-bold">{heading}</span>
          <span className="text-gray-primary text-xs">{description}</span>
        </div>
      </div>
    </>
  );
};

export default GuaranteeCard;

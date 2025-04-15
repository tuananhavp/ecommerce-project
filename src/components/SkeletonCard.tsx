import React from "react";

type SkeletonCardProps = {
  count: number;
};

const SkeletonCard = ({ count }: SkeletonCardProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;

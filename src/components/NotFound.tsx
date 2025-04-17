import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = ({ title }: { title: string }) => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-11">
        <Image src={"/not-found.png"} alt="Not Found Picture" width={200} height={200} />
        <p className="text-red-primary text-4xl uppercase">{title}</p>
        <Link className="btn btn-primary" href={"/"}>
          Return back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";

import { GUARANTEE_DATA } from "../../constants";

import GuaranteeCard from "./components/GuaranteeCard";

const Guarantee = () => {
  return (
    <div className="grid 2xl:grid-cols-4 md:grid-cols-2 gap-8 w-10/12 mx-auto mt-20 mb-32 ">
      {GUARANTEE_DATA.map((item, index) => {
        return (
          <div key={`${index} ${item.heading}`}>
            <GuaranteeCard heading={item.heading} description={item.description} image_url={item.image_url} />
          </div>
        );
      })}
    </div>
  );
};

export default Guarantee;

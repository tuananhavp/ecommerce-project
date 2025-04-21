import React from "react";

import clsx from "clsx";

const Loading = (className: { className?: string }) => {
  return (
    <div className={clsx("flex justify-center items-center", className)}>
      <span className="loading loading-bars loading-xl"></span>
    </div>
  );
};

export default Loading;

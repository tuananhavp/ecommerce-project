import React from "react";

import Link from "next/link";

interface DropdownProps {
  title: string;
  options: string[];
  href?: string;
}
const Dropdown = ({ title, options }: DropdownProps) => {
  return (
    <details>
      <summary>{title}</summary>
      <ul className="menu dropdown-content z-10 bg-base-100 rounded-t-none shadow-xl">
        {options.map((option, index) => (
          <li key={index} className="hover:bg-gray-100 p-2 rounded-md">
            <Link href={"/product"}>{option}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default Dropdown;

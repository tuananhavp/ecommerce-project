import Link from "next/link";
import React from "react";

interface DropdownProps {
  title: string;
  options: string[];
  href?: string;
}
const Dropdown = ({ title, options }: DropdownProps) => {
  return (
    <details>
      <summary>{title}</summary>
      <ul className="bg-base-100 rounded-t-none p-2">
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

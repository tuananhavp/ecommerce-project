"use client";
import React from "react";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";
interface CheckboxProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  title: string;
  labelClassName?: string;
  inputClassName?: string;
  register: UseFormRegister<T>;
}

const Checkbox = <T extends FieldValues>({
  type = "checkbox",
  name,
  title,
  checked,
  value,
  inputClassName,
  labelClassName,
  register,
  ...rest
}: CheckboxProps<T>) => {
  return (
    <>
      <label className={twMerge("fieldset-label", labelClassName)}>
        <input
          type={type}
          className={twMerge("checkbox", inputClassName)}
          value={value}
          checked={checked}
          {...register(name)}
          {...rest}
        />
        {title}
      </label>
    </>
  );
};

export default Checkbox;

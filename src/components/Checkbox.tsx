"use client";
import React from "react";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
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
  inputClassName = "checkbox",
  labelClassName,
  register,
}: CheckboxProps<T>) => {
  return (
    <>
      <label className={`fieldset-label ${labelClassName}`}>
        <input type={type} className={` ${inputClassName}`} value={value} checked={checked} {...register(name)} />
        {title}
      </label>
    </>
  );
};

export default Checkbox;

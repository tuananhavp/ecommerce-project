"use client";
import React from "react";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  title: string;
  labelClassName?: string;
  inputClassName?: string;
  register: UseFormRegister<T>;
}
const InputField = <T extends FieldValues>({
  name,
  type,
  title,
  placeholder,
  labelClassName,
  inputClassName,
  register,
}: InputProps<T>) => {
  return (
    <>
      <label className={twMerge("fieldset-label", labelClassName)}>{title}</label>
      <input {...register(name)} type={type} className={twMerge("input", inputClassName)} placeholder={placeholder} />
    </>
  );
};

export default InputField;

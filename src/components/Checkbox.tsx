"use client";
import React from "react";

import { FieldValues, Path, UseFormRegister, FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import ErrorMessage from "./ErrorMessage";

interface CheckboxProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  title: string;
  labelClassName?: string;
  inputClassName?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
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
  error,
  ...rest
}: CheckboxProps<T>) => {
  return (
    <div className="mb-2">
      <label className={twMerge("fieldset-label inline-flex items-center gap-2", labelClassName)}>
        <input
          type={type}
          className={twMerge("checkbox", inputClassName)}
          value={value}
          checked={checked}
          {...register(name)}
          {...rest}
        />
        <span>{title}</span>
      </label>
      <ErrorMessage error={error} />
    </div>
  );
};

export default Checkbox;

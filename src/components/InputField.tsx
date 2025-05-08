"use client";
import React from "react";

import { FieldValues, Path, UseFormRegister, FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import ErrorMessage from "./ErrorMessage";

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  title: string;
  labelClassName?: string;
  inputClassName?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
}

const InputField = <T extends FieldValues>({
  name,
  type,
  title,
  placeholder,
  labelClassName,
  inputClassName,
  register,
  error,
  ...rest
}: InputProps<T>) => {
  return (
    <div className="mb-4">
      <label className={twMerge("fieldset-label", labelClassName)}>{title}</label>
      <input
        {...register(name)}
        type={type}
        className={twMerge("input", error ? "input-error" : "", inputClassName)}
        placeholder={placeholder}
        {...rest}
      />
      <ErrorMessage error={error} />
    </div>
  );
};

export default InputField;

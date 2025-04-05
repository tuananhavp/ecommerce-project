"use client";
import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
interface CheckboxProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  title: string;
  labelClassName?: string;
  register: UseFormRegister<T>;
}

const Checkbox = <T extends FieldValues>({ name, title, labelClassName, register }: CheckboxProps<T>) => {
  return (
    <>
      <label className={`fieldset-label ${labelClassName}`}>
        <input type="checkbox" className="checkbox" {...register(name, { required: true })} />
        {title}
      </label>
    </>
  );
};

export default Checkbox;

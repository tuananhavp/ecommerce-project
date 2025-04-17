import React from "react";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface SelectFormProps<T extends FieldValues> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<T>;
  options: string[];
  register: UseFormRegister<T>;
}

const SelectForm = <T extends FieldValues>({ options, register, name }: SelectFormProps<T>) => {
  return (
    <select {...register(name)} defaultValue={options[0]} className="select select-primary mt-2">
      {options.map((option, index) =>
        index == 0 ? (
          <option disabled={true} key={index} value={option}>
            {option}
          </option>
        ) : (
          <option key={index} value={option}>
            {option}
          </option>
        )
      )}
    </select>
  );
};

export default SelectForm;

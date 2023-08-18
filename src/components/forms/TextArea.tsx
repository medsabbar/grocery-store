import React from "react";
import { useFormContext } from "react-hook-form";

export default function TextArea({
  name,
  label,
  rows = 6,
  ...rest
}: {
  name: string;
  label: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        className={`shadow resize-none appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errors[name] ? "border-red-500" : ""
        }`}
        id={name}
        {...register(name)}
        {...rest}
        rows={rows}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">{errors[name].message}</p>
      )}
    </div>
  );
}

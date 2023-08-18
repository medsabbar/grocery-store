import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function Tabs({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex gap-2">
            {options.map(({ value, label }) => (
              <div
                key={value}
                className={`cursor-pointer hover:bg-gray-100 flex-1 flex text-center py-2 px-4 border items-center justify-center gap-1 ${
                  field.value === value ? "bg-gray-200" : ""
                }`}
                onClick={() => field.onChange(value)}
              >
                {field.value === value && (
                  <AiOutlineCheckCircle className="inline-block" />
                )}
                {label}
              </div>
            ))}
          </div>
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">{errors[name].message}</p>
      )}
    </div>
  );
}

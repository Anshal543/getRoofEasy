"use client";

import { ChangeEvent } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type InputOption = {
  value: string;
  label: string;
};

type InputProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError | undefined;
  placeholder?: string;
  required?: boolean;
  type?:
    | "text"
    | "email"
    | "select"
    | "textarea"
    | "radio"
    | "number"
    | "checkbox";
  options?: InputOption[];
  className?: string;
  onChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  value?: string;
  radioValue?: string;
  readonly?: boolean;
  disabled?: boolean;
  checked?: boolean;
  id?: string;
};

const Input = ({
  label,
  name,
  register,
  error,
  placeholder,
  required,
  type = "text",
  options = [],
  className = "",
  onChange,
  value,
  radioValue,
  readonly = false,
  disabled = false,
  checked = false,
}: InputProps) => {
  const inputClassName =
    "w-full rounded-md border-2 border-[var(--color-border-form-color)] p-2 outline-sky-500 focus:outline-2";
  const errorClassName = "text-text-error mt-1 text-red-400 text-sm";

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            placeholder={placeholder}
            {...register(name, { onChange })}
            className={inputClassName}
            rows={4}
            readOnly={readonly}
          />
        );

      case "select":
        return (
          <select
            id={name}
            {...register(name, { onChange })}
            className={inputClassName}
          >
            {options.map((option) => (
              <option
                key={option.value}
                className="dark:bg-black"
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <input
            type="radio"
            id={`${name}-${radioValue}`}
            value={radioValue}
            {...register(name, { onChange })}
            className="mr-2"
            checked={checked}
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            id={name}
            {...register(name, { onChange })}
            className="mr-2"
            checked={checked}
          />
        );

      default:
        return (
          <input
            type={type}
            id={name}
            placeholder={placeholder}
            {...register(name, { onChange })}
            className={inputClassName}
            value={value}
            readOnly={readonly}
            disabled={disabled}
          />
        );
    }
  };

  if (type === "radio") {
    return (
      <label className="flex items-center">
        {renderInput()}
        {label}
      </label>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="flex items-center">
        {renderInput()}
        <span className="ml-2">{label}</span>
      </label>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 block font-medium">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className={errorClassName}>{error.message}</p>}
    </div>
  );
};

export default Input;

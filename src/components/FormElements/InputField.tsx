import { forwardRef } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FormDataType } from "../../types";

export interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: FieldError;
  icon?: string;
}

const InputField = forwardRef<
  HTMLInputElement,
  InputFieldProps & ReturnType<UseFormRegister<FormDataType>>
>(
  (
    {
      name,
      disabled,
      label,
      type = "text",
      placeholder,
      icon,
      error,
      onChange,
      onBlur,
    },
    ref
  ) => (
    <div>
      <label className="block text-sm font-medium text-primary">{label}</label>
      <p>{icon}</p>
      <input
        disabled={disabled}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        ref={ref}
        className="mt-1 block w-full p-2 border rounded-md shadow-sm"
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
);

InputField.displayName = "InputField";

export default InputField;

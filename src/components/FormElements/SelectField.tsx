import { forwardRef } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { FormDataType } from "../../types";

type Option = {
  value: string;
  label: string;
};

interface SelectFieldProps {
  label: string;
  placeholder: string;
  disabled?: boolean;
  options: Option[];
  error?: FieldError;
}

const SelectField = forwardRef<
  HTMLSelectElement,
  SelectFieldProps & ReturnType<UseFormRegister<FormDataType>>
>(({ name, disabled, label, placeholder, options, error, onChange, onBlur }, ref) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-primary">
      {label}
    </label>
    <select
      ref={ref}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
));

SelectField.displayName = "SelectField";

export default SelectField;

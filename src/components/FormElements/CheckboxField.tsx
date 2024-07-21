import React, { forwardRef } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CheckboxFieldProps {
  label: string;
  checked?: boolean;
  error?: FieldError;
  disableField?: (checked: boolean) => void;
}

const CheckboxField = forwardRef<
  HTMLInputElement,
  CheckboxFieldProps & UseFormRegisterReturn
>(({ name, label, checked, error, onChange, onBlur, disableField }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (disableField) disableField(e.target.checked);
  };

  return (
    <div>
      <label>
        <input
          ref={ref}
          name={name}
          type="checkbox"
          onBlur={onBlur}
          onChange={handleChange}
          checked={checked}
          className="mr-2"
        />
        {label}
      </label>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
});

CheckboxField.displayName = "CheckboxField";

export default CheckboxField;

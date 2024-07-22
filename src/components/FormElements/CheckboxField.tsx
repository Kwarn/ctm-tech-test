/* 
  I was fighting too many issues with react-hook-form and clashing async update when trying to disable fields with checkboxes in my multiple attemps to impliment them.
  I decided to remove them instead of showing a buggy mess, I don't want to delay submission of the test any longer because of this.

  I'll continue to find a solition to this for my own learnings
  My next attempt is to either impliment the 'Controller' functionality of react-hook-form or 
  to make the checkbox a question of their own and then disable the previous question based on the checked state of the checkbox. 
  (this would require some handling so the checkbox questions don't display in the progress tracker,
  I wanted to avoid hard coding any checks e.g. if question.name === "" so the components are generic & re-usable)
  I could use the field.type though..

  Show some mercy on me please! I thought I'd learn react-hook-form in parallel to this test but it's been a bit of a struggle,
  in retrospect I could have gone with an easier option :)
*/


import { forwardRef } from "react";
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
>(({ name, label, checked, error, onChange }, ref) => {
  return (
    <div>
      <label>
        <input
          ref={ref}
          name={name}
          type="checkbox"
          onChange={onChange}
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

import { RegisterOptions } from "react-hook-form/dist/types";

type OptionType = {
  value: string;
  label: string;
};

export type FieldType = {
  label: string;
  progressBarLabel: string;
  fieldName: string;
  element: string;
  type?: string;
  placeholder?: string;
  options?: OptionType[];
  icon?: string;
  rules?: RegisterOptions;
  checkbox?: string;
};

export type FormDataType = {
  [key: string]: any;
};

export type SectionType = {
  sectionName: string;
  fields: FieldType[];
};

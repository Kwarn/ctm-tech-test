import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { FieldType, FormDataType, SectionType } from "../types";
import { apiResponseSchema } from "../api/validationSchema";
import InputField from "./FormElements/InputField";
import SelectField from "./FormElements/SelectField";
import { useFormContext } from "../state/FormContext";

const Form: React.FC = () => {
  const {
    isLoading,
    currentSection,
    answers,
    setAnswer,
    setCurrentSection,
    setProgressTrackerSections,
  } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    clearErrors,
    setValue,
    unregister,
    reset,
    getValues,
  } = useForm<FormDataType>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [sections, setSections] = useState<SectionType[]>([]);
  const [disabledFields, setDisabledFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoading) return; // wait until the context is loaded for prepopulation

    const initializeForm = async () => {
      try {
        const response = await fetch("/mock/api.json");
        if (!response.ok) {
          throw new Error("Failed to fetch the form");
        }
        const data = await response.json();
        const parsedData = apiResponseSchema.parse(data);

        const sections = parsedData.data.sections;

        if (!sections.length) {
          throw new Error("Questions not found");
        }

        setSections(sections);

        setProgressTrackerSections(
          sections.map((section) => ({
            sectionName: section.sectionName,
            questions: section.fields.map((field) => ({
              name: field.fieldName,
              label: field.progressBarLabel,
            })),
          }))
        );

        const prepopulateValues: Record<string, any> = {};
        answers.forEach(({ name, value }) => {
          prepopulateValues[name] = value;
        });

        reset(prepopulateValues);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    initializeForm();
  }, [isLoading]);

  // handles rendering form fields based on the field type
  const renderField = (field: FieldType) => {
    const { fieldName, label, element, type, options, rules, placeholder } =
      field;

    const error = errors[fieldName] as FieldError | undefined;
    const isDisabled = disabledFields.has(fieldName);
    const registerOptions = rules ?? {};

    const commonProps = {
      label,
      error,
      disabled: isDisabled,
      placeholder: placeholder ?? "",
      ...register(fieldName, {
        ...registerOptions,
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
          const value =
            (e.target as HTMLInputElement).type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : e.target.value;
          handleFieldChange(fieldName, value, e.target.type);
          if (registerOptions.onChange) {
            registerOptions.onChange(e);
          }
        },
      }),
    };

    if (element === "input") {
      return (
        <div key={`${fieldName}-${type}-input`}>
          <InputField type={type} {...commonProps} />
        </div>
      );
    }

    if (element === "select") {
      return (
        <div key={`${fieldName}-select-menu`}>
          <SelectField options={options || []} {...commonProps} />
        </div>
      );
    }
  };

  const handleFieldChange = async (
    name: string,
    value: any,
    fieldType: string
  ) => {
    const isValid = await trigger(name);
    setAnswer(name, value, isValid);
  };

  const handleResetButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const currentSectionFields = sections[currentSection].fields.map(
      (field) => field.fieldName
    );

    setDisabledFields(new Set());

    for (const fieldName of currentSectionFields) {
      setValue(fieldName, "");
      setAnswer(fieldName, "", false);
    }

    clearErrors();
  };

  const handleNextButton = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const isSectionComplete = await trigger();
    if (isSectionComplete) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCurrentSection(currentSection - 1);
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    alert(JSON.stringify(data));

    console.log(data);

    // we would post the data to an API here in a try/catch aync/await block
    // we could also inrementally submit the form per section if we wanted to
    // I'm just resetting the form for demo purposes

    const fieldNames: string[] = [];

    const defaultValues: Partial<FormDataType> = {};
    sections.forEach((section) =>
      section.fields.forEach((field) => {
        defaultValues[field.fieldName] = "";
        fieldNames.push(field.fieldName);
      })
    );
    reset(defaultValues, {
      keepErrors: false,
      keepDirty: true,
      keepValues: false,
    });

    for (const fieldName of fieldNames) {
      setAnswer(fieldName, "", false);
    }

    setCurrentSection(0);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-[400px] min-h-[420px] space-y-6 p-6 rounded-lg flex flex-col justify-between"
      >
        {sections.length > 0 && (
          <div className="space-y-6">
            {sections[currentSection].fields.map((field) => renderField(field))}
          </div>
        )}

        <div className="flex justify-between">
          {currentSection > 0 && (
            <button
              type="button"
              onClick={handlePreviousButton}
              className="rounded-[2rem] text-white bg-gray-500 b-ra inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Previous
            </button>
          )}

          <button
            type="button"
            onClick={handleResetButton}
            className="rounded-[2rem] text-white bg-gray-500 b-ra inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={handleNextButton}
              className="rounded-[2rem] text-white bg-primary b-ra inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-[2rem] text-white bg-primary b-ra inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Form;

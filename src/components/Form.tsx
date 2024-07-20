import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { FieldType, FormDataType, SectionType } from "../types";
import { apiResponseSchema } from "../api/validationSchema";
import InputField from "./FormElements/InputField";
import SelectField from "./FormElements/SelectField";
import CheckboxField from "./FormElements/CheckboxField";
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
    watch,
    reset,
  } = useForm<FormDataType>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [sections, setSections] = useState<SectionType[]>([]);
  const [disabledFields, setDisabledFields] = useState<Set<string>>(new Set());
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (isLoading) return; // wait until the context is loaded for prepopulation

    const fetchFormQuestions = async () => {
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
              label: field.label,
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

    fetchFormQuestions();
  }, [isLoading]);

  useEffect(() => {
    // handles updating context when the form data changes
    const subscription = watch((values, { name }) => {
      if (name) {
        trigger(name).then((isValid) => {
          setAnswer(name, values[name], isValid);
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setAnswer, trigger]);

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    alert(JSON.stringify(data));
  };

  // handles disabling fields based on checkbox state
  const handleCheckboxChange = (disableTarget: string, isChecked: boolean) => {
    setDisabledFields((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(disableTarget);
        setValue(disableTarget, null, {
          shouldValidate: false,
          shouldDirty: true,
        });
        unregister(disableTarget);
      } else {
        newSet.delete(disableTarget);
        clearErrors(disableTarget);
      }
      return newSet;
    });

    setCheckboxStates((prev) => ({
      ...prev,
      [disableTarget]: isChecked,
    }));
  };

  // handles rendering form fields based on the field type
  const renderField = (field: FieldType, index: number) => {
    const { fieldName, label, element, type, options, rules, placeholder } =
      field;

    const error = errors[fieldName] as FieldError | undefined;
    const isDisabled = disabledFields.has(fieldName);
    const registerOptions = !isDisabled ? rules ?? {} : {};

    const commonProps = {
      label,
      error,
      disabled: isDisabled,
      placeholder: placeholder ?? "",
      ...register(fieldName, registerOptions),
    };

    if (element === "input") {
      return (
        <div key={fieldName}>
          <InputField type={type} {...commonProps} />
          {field.checkbox && (
            <CheckboxField
              disableField={(checked: boolean) =>
                handleCheckboxChange(fieldName, checked)
              }
              label={field.checkbox}
              checked={checkboxStates[fieldName] || false}
              {...register(fieldName, registerOptions)}
            />
          )}
        </div>
      );
    }

    if (element === "select") {
      return (
        <div key={fieldName}>
          <SelectField key={index} options={options || []} {...commonProps} />
          {field.checkbox && (
            <CheckboxField
              disableField={(checked: boolean) =>
                handleCheckboxChange(fieldName, checked)
              }
              label={field.checkbox}
              checked={checkboxStates[fieldName] || false}
              {...register(fieldName, registerOptions)}
            />
          )}
        </div>
      );
    }
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[500px] min-w-[300px] space-y-6 p-6 bg-gray-100 rounded-lg"
      >
        {sections.length > 0 && (
          <div className="space-y-2">
            {sections[currentSection].fields.map((field, index) =>
              renderField(field, index)
            )}
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

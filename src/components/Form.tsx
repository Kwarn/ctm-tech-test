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

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name) {
        trigger(name).then((isValid) => {
          /* 
          this is triggered each time a form field value changes, it keeps the answers in context up to date
          a side effect of this is its also triggered when we disable a field because we force the value to be an empty string

          this validation check of an empty string causes isValid to be false when we want it to be true
          we want it to be valid so the form can be submitted, the ProgressTracker updates and we have the correct payload (empty strings for disabled fields) - BE would handle this in theory
          we need to check if the field is present in disabledFields and override isValid to true - however disabledFields is not ready in time so we need to delay this check

          I'm aware this is a bit hacky, this is my first time using react-hook-form so I could be missing something.
          I'm going to timebox this one to avoid a large refactor and delaying submitting of the test :)

          We can discuss possible solutions/alternatives in the review?
          */
          setTimeout(() => {
            if (disabledFields.has(name)) {
              isValid = true;
            }
          }, 10);
          setAnswer(name, values[name], isValid);
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setAnswer, trigger]);


  // handles rendering form fields based on the field type
  const renderField = (field: FieldType, index: number) => {
    const { fieldName, label, element, type, options, rules, placeholder } =
      field;

    const error = errors[fieldName] as FieldError | undefined;
    const isDisabled = disabledFields.has(fieldName);
    const registerOptions = !isDisabled ? rules ?? {} : {}; // dont apply rules if field is disabled

    const commonProps = {
      label,
      error,
      disabled: isDisabled,
      placeholder: placeholder ?? "",
      ...register(fieldName, registerOptions),
    };

    if (element === "input") {
      return (
        <div key={`${fieldName}-${type}-input`}>
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
        <div key={`${fieldName}-select-menu`}>
          <SelectField options={options || []} {...commonProps} />
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

  // checkboxes control the disabled state of their respective fields
  // this function handles disabling/enabling fields based on the checkbox state
  const handleCheckboxChange = async (
    disableTarget: string,
    isChecked: boolean
  ) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [disableTarget]: isChecked,
    }));

    setDisabledFields((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(disableTarget);

        unregister(disableTarget);
        setValue(disableTarget, "", {
          shouldValidate: false,
          shouldDirty: true,
        });
        clearErrors(disableTarget);
      } else {
        newSet.delete(disableTarget);

        setValue(disableTarget, "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        clearErrors(disableTarget);
      }
      return newSet;
    });
  };

  const handleResetButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Collect the field names from the current section
    const currentSectionFields = sections[currentSection].fields.map(
      (field) => field.fieldName
    );

    setDisabledFields(new Set());
    setCheckboxStates({});

    for (const fieldName of currentSectionFields) {
      setValue(fieldName, "");
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

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    alert(JSON.stringify(data));

    // we would post the data to an API here in a try/catch aync/await block
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

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";

import { QuestionType } from "../types";
import { apiResponseSchema } from "../api/validationSchema";

type FormDataType = {
  [key: string]: any;
};

const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>();
  const [vehicleQuestions, setVehicleQuestions] = useState<QuestionType[]>([]);
  const [personalQuestions, setPersonalQuestions] = useState<QuestionType[]>(
    []
  );

  useEffect(() => {
    const fetchFormQuestions = async () => {
      try {
        const response = await fetch("/mock/api.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const parsedData = apiResponseSchema.parse(data);

        const personal = parsedData.data.questions.personal || [];
        const vehicle = parsedData.data.questions.vehicle || [];

        if (!personal.length || !vehicle.length) {
          throw new Error("Questions not found");
        }

        setPersonalQuestions(personal);
        setVehicleQuestions(vehicle);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchFormQuestions();
  }, []);

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-gray-100 rounded-lg"
    >
      {personalQuestions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {question.title}
          </label>
          {question.fields.map((field, index) => {
            const fieldName = `personal_${question.id}_${index}`;
            const registerOptions = field.rules || {};
            const error = errors[fieldName] as FieldError | undefined;
            return (
              <div key={index} className="space-y-1">
                {field.element === "input" && (
                  <>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...register(fieldName, registerOptions)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {error && (
                      <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                  </>
                )}
                {field.element === "select" && (
                  <>
                    <select
                      {...register(fieldName, registerOptions)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {error && (
                      <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      {vehicleQuestions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {question.title}
          </label>
          {question.fields.map((field, index) => {
            const fieldName = `vehicle_${question.id}_${index}`;
            const registerOptions = field.rules || {};
            const error = errors[fieldName] as FieldError | undefined;
            return (
              <div key={index} className="space-y-1">
                {field.element === "input" && (
                  <>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...register(fieldName, registerOptions)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {error && (
                      <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                  </>
                )}
                {field.element === "select" && (
                  <>
                    <select
                      {...register(fieldName, registerOptions)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {error && (
                      <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;

import { RegisterOptions } from "react-hook-form/dist/types";

export type FieldType = {
  element: string;
  type: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  icon?: string;
  rules?: RegisterOptions;
};

export type QuestionType = {
  id: number;
  title: string;
  fields: FieldType[];
  childQuestions?: number[];
};

export type ApiMockType = {
  questions: {
    personal: QuestionType[];
    vehicle: QuestionType[];
  };
};

export type Rules = {};

interface GetQuestionsResponse {
  data: {
    questions: {
      personal?: QuestionType[];
      vechile?: QuestionType[];
    };
  };
}

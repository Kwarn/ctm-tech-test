import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface AnswerType {
  name: string;
  value: any; // TODO: replace with a more specific type if possible
  isValid: boolean;
}

export type QuestionType = {
  name: string;
  label: string;
};

export type ProgressTrackerSectionType = {
  sectionName: string;
  questions: QuestionType[];
};

interface FormContextType {
  isLoading: boolean;
  answers: AnswerType[];
  currentSection: number;
  progressTrackerSections: ProgressTrackerSectionType[];
  setAnswer: (fieldName: string, value: any, isValid: boolean) => void;
  setCurrentSection: (section: number) => void;
  setProgressTrackerSections: (sections: ProgressTrackerSectionType[]) => void;
}

const defaultContext: FormContextType = {
  isLoading: true,
  answers: [],
  currentSection: 0,
  progressTrackerSections: [],
  setAnswer: () => {},
  setCurrentSection: () => {},
  setProgressTrackerSections: () => {},
};

const FormContext = createContext<FormContextType>(defaultContext);

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [progressTrackerSections, setProgressTrackerSections] = useState<
    ProgressTrackerSectionType[]
  >([]);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setAnswers(parsedData.answers || []);
      setCurrentSection(parsedData.currentSection || 0);
      setProgressTrackerSections(parsedData.progressTrackerSections || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(
        "formData",
        JSON.stringify({
          answers,
          currentSection,
          progressTrackerSections,
        })
      );
    }
  }, [answers, currentSection, isLoading, progressTrackerSections]);

  const setAnswer = (fieldName: string, value: any, isValid: boolean) => {
    setAnswers((prev) => {
      const prevAnswers = Array.isArray(prev) ? prev : [];

      const index = prevAnswers.findIndex(
        (answer) => answer.name === fieldName
      );
      if (index > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[index] = { name: fieldName, value, isValid };
        return updatedAnswers;
      } else {
        return [...prevAnswers, { name: fieldName, value, isValid }];
      }
    });
  };

  const value = {
    isLoading,
    answers,
    progressTrackerSections,
    currentSection,
    setAnswer,
    setCurrentSection: (section: number) => setCurrentSection(section),
    setProgressTrackerSections,
  };

  return (
    <FormContext.Provider value={value}>
      {!isLoading && children}
    </FormContext.Provider>
  );
};

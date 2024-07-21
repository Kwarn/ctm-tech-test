import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { AnswerType, ProgressTrackerSectionType } from "../state/FormContext";

type ProgressTrackerProps = {
  sections: ProgressTrackerSectionType[];
  currentSection: number;
  isLoading: boolean;
  answers: AnswerType[];
};

const ProgressTracker = ({
  sections,
  answers,
  currentSection,
}: ProgressTrackerProps) => {
  const isSmallScreen = useIsSmallScreen(768);

  const smallScreenSteps = sections.flatMap((section) =>
    section.questions.map((question) => {
      const isValid = answers.find(
        (answer) => answer.name === question.name
      )?.isValid;
      return { name: question.name, isValid: isValid };
    })
  );

  return (
    <div className="w-full md:w-[400px] space-y-6 p-6">
      {isSmallScreen ? (
        <div className="flex flex-row rounded-sm">
          {smallScreenSteps.map((step) => (
            <span
              role="presentation"
              key={`question-indicator-${step.name}`}
              className={`flex w-full p-2 border border-gray-200 ${
                step.isValid ? "bg-green-500" : "bg-white"
              }`}
            ></span>
          ))}
        </div>
      ) : (
        <div className="flex flex-col rounded-sm">
          {sections.map((section, index) => (
            <div key={section.sectionName}>
              <span
                className={`text-primary ${
                  currentSection === index ? "font-bold" : ""
                }`}
              >
                {section.sectionName}
              </span>

              <div>
                {section.questions.map((question) => (
                  <div key={question.name} className="flex ml-3 p-2">
                    <span className="mr-3" role="presentation">
                      {answers.find((answer) => answer.name === question.name)
                        ?.isValid
                        ? "✅"
                        : "❌"}
                    </span>
                    <span>{question.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

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
  return (
    <div className="w-[400px] min-w-[300px] space-y-6 p-6">
      <div className="flex flex-col rounded-sm">
        {sections.map((section, index) => (
          <div key={section.sectionName}>
            <div
              className={`flex ${currentSection === index ? "font-bold" : ""}`}
            >
              <span className="text-primary">{section.sectionName}</span>
            </div>
            <div>
              {section.questions.map((question) => (
                <div
                  key={question.name}
                  className="flex ml-3 p-2"
                >
                  <span className="mr-3">
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
    </div>
  );
};

export default ProgressTracker;

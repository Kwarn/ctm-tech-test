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
    <div className="space-y-6 p-6">
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
                  className="flex justify-between ml-3 p-2"
                >
                  <span>{question.label}</span>
                  <span className="ml-3">
                    {answers.find((answer) => answer.name === question.name)
                      ?.isValid
                      ? "✅"
                      : "❌"}
                  </span>
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

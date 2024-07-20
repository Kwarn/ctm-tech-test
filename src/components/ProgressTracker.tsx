type Step = {
  title: string;
};

type Section = {
  steps: Step[];
  currentStep: number;
  title: string;
};

type ProgressTrackerProps = {
  sections: Section[];
  currentSection: number;
  currentStep: number;
};

const ProgressTracker = ({
  sections,
  currentStep,
  currentSection,
}: ProgressTrackerProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        {sections.map((section, index) => (
            <div key={index} className="flex items-center space-x-2">
                <div
                className={`h-2 w-2 rounded-full ${
                    currentSection === index ? "bg-primary" : "bg-gray-300"
                }`}
                ></div>
                <p>{section.title}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;

import Form from "../components/Form";
import ProgressTracker from "../components/ProgressTracker";
import { useFormContext } from "../state/FormContext";

const Home = () => {
  const { isLoading, currentSection, answers, progressTrackerSections } =
    useFormContext();
  return (
    <div className="h-full flex justify-center">
      <div className="w-full flex justify-center flex-row mt-20">
        <Form />
        <div className="mx-4 border"/>
        <ProgressTracker
          isLoading={isLoading}
          currentSection={currentSection}
          answers={answers}
          sections={progressTrackerSections}
        />
      </div>
    </div>
  );
};

export default Home;

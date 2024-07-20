import Form from "../components/Form";
import ProgressTracker from "../components/ProgressTracker";
import { useFormContext } from "../state/FormContext";

const Home = () => {
  const { isLoading, currentSection, answers, progressTrackerSections } =
    useFormContext();
  return (
    <div className="h-[100vh] flex flex-row items-center justify-evenly">
      <Form />
      <ProgressTracker
        isLoading={isLoading}
        currentSection={currentSection}
        answers={answers}
        sections={progressTrackerSections}
      />
    </div>
  );
};

export default Home;

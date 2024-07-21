import Form from "../components/Form";
import ProgressTracker from "../components/ProgressTracker";
import { useFormContext } from "../state/FormContext";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const Home = () => {
  const { isLoading, currentSection, answers, progressTrackerSections } =
    useFormContext();

  const isSmallScreen = useIsSmallScreen(768);

  return (
    <div className="h-full flex justify-center">
      <div className="w-full flex flex-col justify-center md:mt-20 md:flex-row lg:flex-row">
        {isSmallScreen && (
          <ProgressTracker
            isLoading={isLoading}
            currentSection={currentSection}
            answers={answers}
            sections={progressTrackerSections}
          />
        )}
        {isSmallScreen && <div className="mx-4 md:mx-4 md:my-4 border" />}
        <Form />
        {!isSmallScreen && <div className="mx-4 md:mx-4 md:my-4 border" />}
        {!isSmallScreen && (
          <ProgressTracker
            isLoading={isLoading}
            currentSection={currentSection}
            answers={answers}
            sections={progressTrackerSections}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

import Home from "./page/Home";
import { FormProvider } from "./state/FormContext";

function App() {
  return (
    <FormProvider>
      <div className="App">
        <header className="App-header"></header>
        <Home />
      </div>
    </FormProvider>
  );
}

export default App;

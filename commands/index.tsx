import React from "react";
import { Cli } from "../src/Cli";
import { Provider as KeyboardNavigationProvider } from "../src/contexts/KeybboardNavigation/Provider";

const App: React.FC = () => {
  return (
    <KeyboardNavigationProvider>
      <Cli />
    </KeyboardNavigationProvider>
  );
};

export default App;

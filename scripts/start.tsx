import React from "react";
import { App } from "../src/App";
import { render } from "ink";
import { Provider as KeyboardNavigationProvider } from "../src/contexts/KeybboardNavigation/Provider";

const { waitUntilExit } = render(
  <KeyboardNavigationProvider>
    <App />
  </KeyboardNavigationProvider>
);

(async () => {
  await waitUntilExit();
})();

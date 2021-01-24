import React, { useState } from "react";
import { Text, Box, useInput, Newline, useApp } from "ink";
import { Provider as KeyboardNavigationProvider } from "../src/contexts/KeybboardNavigation/Provider";
import { Logo } from "../src/components/Logo";
import fse from "fs-extra";
import path from "path";
import TextInput from "ink-text-input";
import { useKeyboardNavigation } from "../src/contexts/KeybboardNavigation/useKeyboardNavigation";

const AccessTokenPrompt: React.FC = () => {
  const [accessToken, setAccessToken] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const { exit } = useApp();

  const onSubmit = async () => {
    await fse.writeFile(path.resolve(".env"), `ACCESS_TOKEN=${accessToken}`);

    setIsConfigured(true);

    setTimeout(() => {
      exit();
    }, 700);
  };

  useKeyboardNavigation({
    return: () => {
      if (!isConfigured) {
        onSubmit();
      }
    },
  });

  return (
    <Box justifyContent="space-between" alignItems="center">
      <Box flexDirection="column">
        {!isConfigured && (
          <>
            <Text bold>
              Provide an access token. You can generate a token here:
              https://app.circleci.com/settings/user/tokens
              <Newline />
            </Text>
            <Box>
              <Box marginRight={1}>
                <Text>Enter your access token:</Text>
              </Box>
              <TextInput value={accessToken} onChange={setAccessToken} />
            </Box>
          </>
        )}

        {isConfigured && (
          <Box marginTop={3}>
            <Text>
              ✓ Cli configured! You can now start the app with: <Newline />
              <Text bold>circle-dash</Text>
            </Text>
          </Box>
        )}
      </Box>
      <Logo />
    </Box>
  );
};

const ConfigureApp: React.FC = () => {
  return (
    <KeyboardNavigationProvider>
      <AccessTokenPrompt />
    </KeyboardNavigationProvider>
  );
};

export default ConfigureApp;

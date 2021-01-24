import React, { useState } from 'react';
import { Provider as UserProvider } from './contexts/User/Provider';
import { UserInfo } from './components/UserInfo';
import { Provider as CollaborationsProvider } from './contexts/Collaborations/Provider';
import { Box, useApp } from 'ink';
import { Collaboration, Pipeline } from 'circle-client';
import { CollaborationsChooser } from './components/CollaborationsChooser';
import { Dashboard } from './components/Dashboard';
import { InfoRow } from './components/InfoRow';
import { PipelineDetails } from './components/PipelineDetails';
import { FullScreen } from './components/Fullscreen';
import { useKeyboardNavigation } from './contexts/KeybboardNavigation/useKeyboardNavigation';
import { Logo } from './components/Logo';

export const Cli: React.FC = () => {
  const [collaboration, setCollaboration] = useState<Collaboration | null>(
    null
  );
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const { exit } = useApp();

  useKeyboardNavigation({
    escape: () => {
      if (!!pipeline) {
        setPipeline(null);
      } else if (!!collaboration) {
        setCollaboration(null);
      } else {
        exit();
      }
    },
  });

  return (
    <FullScreen>
      <UserProvider>
        <CollaborationsProvider>
          <Box borderStyle="single" justifyContent="space-between">
            <Box flexDirection="column">
              <UserInfo />
              {!collaboration && (
                <CollaborationsChooser
                  onSelect={(collaboration) => setCollaboration(collaboration)}
                />
              )}
              {collaboration && (
                <InfoRow label="Collaboration" value={collaboration.name} />
              )}
            </Box>
            {!collaboration && (
              <Box paddingRight={1}>
                <Logo />
              </Box>
            )}
          </Box>
          {collaboration && !pipeline && (
            <Dashboard
              collaboration={collaboration}
              onPipelineSelect={setPipeline}
            />
          )}
          {collaboration && pipeline && (
            <PipelineDetails pipelineId={pipeline.id} />
          )}
        </CollaborationsProvider>
      </UserProvider>
    </FullScreen>
  );
};

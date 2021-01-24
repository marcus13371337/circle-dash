import { Collaboration, Pipeline } from 'circle-client';
import { Box, Text } from 'ink';
import React from 'react';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';
import { PipelineList } from './PipelineList';

interface Props {
  collaboration: Collaboration;
  onPipelineSelect: (pipeline: Pipeline) => void;
}

type View = 'all' | 'mine';

const VIEWS: { id: View; label: string }[] = [
  {
    id: 'all',
    label: 'All Pipelines',
  },
  {
    id: 'mine',
    label: 'My Pipelines',
  },
];

export const Dashboard: React.FC<Props> = ({
  collaboration,
  onPipelineSelect,
}) => {
  const selected = useKeyboardSelection(VIEWS, {
    horizontal: true,
    preselect: true,
  });

  return (
    <Box borderStyle="single" flexDirection="column" flexGrow={1}>
      <Box>
        {VIEWS.map((config) => {
          return (
            <Box key={config.id} padding={1}>
              <Text
                bold={selected?.id === config.id}
                underline
                color="white"
                dimColor={selected?.id !== config.id}
              >
                {config.label}
              </Text>
            </Box>
          );
        })}
      </Box>
      <PipelineList
        collaboration={collaboration}
        onlyMine={selected?.id === 'mine'}
        onSelect={onPipelineSelect}
      />
    </Box>
  );
};

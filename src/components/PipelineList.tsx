import { Collaboration, Pipeline as PipelineType } from 'circle-client';
import { Box, Text } from 'ink';
import React, { useCallback, useEffect } from 'react';
import { useCircleCiClient } from '../contexts/CircleCiClient/useCircleCiClient';
import { getOrgSlug } from '../contexts/Collaborations/getOrgSlug';
import { useAsyncSource } from '../hooks/useAsyncSource';
import { Header, Pipeline } from './Pipeline';
import Spinner from 'ink-spinner';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';
import { useKeyboardNavigation } from '../contexts/KeybboardNavigation/useKeyboardNavigation';

interface Props {
  collaboration: Collaboration;
  onlyMine: boolean;
  onSelect: (pipeline: PipelineType) => void;
}

export const PipelineList: React.FC<Props> = ({
  collaboration,
  onlyMine,
  onSelect,
}) => {
  const { client } = useCircleCiClient();

  const fetchPipelines = useCallback(async () => {
    const response = await client.listPipelines(getOrgSlug(collaboration), {
      onlyMine,
    });

    return response.items;
  }, [client, collaboration, onlyMine]);

  const { data: pipelines, isFetching, hasErrors, refresh } = useAsyncSource(
    fetchPipelines
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [refresh]);

  const selectedPipeline = useKeyboardSelection(pipelines || []);

  useKeyboardNavigation({
    return: () => {
      if (selectedPipeline) {
        onSelect(selectedPipeline);
      }
    },
  });

  return (
    <Box flexDirection="column">
      <Header />
      {hasErrors && <Text bold>Cound't load pipelines</Text>}
      {isFetching && !pipelines && <Spinner />}
      {pipelines &&
        pipelines.map((pipeline) => (
          <Pipeline
            key={pipeline.id}
            pipeline={pipeline}
            inverse={selectedPipeline?.id === pipeline.id}
          />
        ))}
    </Box>
  );
};

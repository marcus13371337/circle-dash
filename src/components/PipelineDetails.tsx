import { Job, Workflow } from 'circle-client';
import { Box, Text } from 'ink';
import React, { useCallback, useEffect, useState } from 'react';
import { Header as PipelineHeader, Pipeline } from './Pipeline';
import Spinner from 'ink-spinner';
import { WorkflowDetails } from './WorkflowDetails';
import { JobDetails } from './JobDetails';
import { useKeyboardNavigation } from '../contexts/KeybboardNavigation/useKeyboardNavigation';
import { Header } from './Header';
import { useAsyncSource } from '../hooks/useAsyncSource';
import { useCircleCiClient } from '../contexts/CircleCiClient/useCircleCiClient';

interface Props {
  pipelineId: string;
}

export const PipelineDetails: React.FC<Props> = ({ pipelineId }) => {
  const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { client } = useCircleCiClient();

  const fetchPipeline = useCallback(async () => {
    return await client.getPipeline(pipelineId);
  }, [client, pipelineId]);

  const { data: pipeline, isFetching, hasErrors, refresh } = useAsyncSource(
    fetchPipeline
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [refresh]);

  useKeyboardNavigation(
    {
      escape: () => {
        setSelectedJob(null);
      },
    },
    !selectedJob
  );

  if (hasErrors) {
    return <Text>Couldn't load pipeline</Text>;
  }

  if (isFetching && !pipeline) {
    return <Spinner />;
  }

  return (
    <Box borderStyle="single" flexDirection="column" flexGrow={1}>
      <Header title="Pipeline">
        <PipelineHeader />
        {pipeline && (
          <Pipeline pipeline={pipeline} onWorkflows={setWorkflows} />
        )}
      </Header>
      {!workflows && <Spinner />}
      {!selectedJob &&
        workflows &&
        workflows.map((workflow) => {
          return (
            <WorkflowDetails
              key={workflow.id}
              workflow={workflow}
              onJobSelect={setSelectedJob}
            />
          );
        })}
      {selectedJob && <JobDetails job={selectedJob} />}
    </Box>
  );
};

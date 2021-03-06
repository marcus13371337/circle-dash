import { Job as JobType } from 'circle-client';
import { Box, Text } from 'ink';
import React, { useCallback, useEffect, useState } from 'react';
import { useCircleCiClient } from '../contexts/CircleCiClient/useCircleCiClient';
import { useAsyncSource } from '../hooks/useAsyncSource';
import { Header as JobHeader, Job } from './Job';
import Spinner from 'ink-spinner';
import { BuildStep, GitType } from 'circleci-api';
import { Header as StepHeader, Step } from './Step';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';
import { StepDetails } from './StepDetails';
import { useKeyboardNavigation } from '../contexts/KeybboardNavigation/useKeyboardNavigation';
import { Header } from './Header';

interface Props {
  job: JobType;
}

export const JobDetails: React.FC<Props> = ({ job }) => {
  const { legacyClient } = useCircleCiClient();

  const fetchDetails = useCallback(async () => {
    if (!job.job_number) {
      throw new Error('Invalid job number');
    }

    const [type, owner, repo] = job.project_slug.split('/');

    return await legacyClient.build(job.job_number, {
      vcs: {
        type: type as GitType,
        owner,
        repo,
      },
    });
  }, [legacyClient, job.job_number, job.project_slug]);

  const { data, isFetching, hasErrors, refresh } = useAsyncSource(fetchDetails);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 2000);

    return () => clearInterval(interval);
  }, [refresh]);

  const stepCursor = useKeyboardSelection(
    data?.steps.map((step, index) => ({ ...step, id: index })) || []
  );

  const [selectedStep, setSelectedStep] = useState<BuildStep | null>(null);

  useKeyboardNavigation(
    {
      return: () => {
        if (stepCursor) {
          setSelectedStep(stepCursor);
        }
      },
    },
    !!selectedStep
  );

  useKeyboardNavigation(
    {
      escape: () => {
        setSelectedStep(null);
      },
    },
    !selectedStep
  );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Header title="Job">
        <JobHeader />
        <Job job={job} />
      </Header>
      {selectedStep && <StepDetails step={selectedStep} />}
      {!selectedStep && (
        <Box flexDirection="column">
          <StepHeader />
          {isFetching && !data && <Spinner />}
          {hasErrors && (
            <Text>Something went wrong when getting job details</Text>
          )}
          {data &&
            !selectedStep &&
            data.steps.map((step, index) => {
              return (
                <Step
                  key={index}
                  step={step}
                  inverse={stepCursor?.id === index}
                />
              );
            })}
        </Box>
      )}
    </Box>
  );
};

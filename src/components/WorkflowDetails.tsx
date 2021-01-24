import { Workflow, Job as JobType } from "circle-client";
import { Box, Text, useInput } from "ink";
import React, { useCallback, useEffect } from "react";
import { useCircleCiClient } from "../contexts/CircleCiClient/useCircleCiClient";
import { useAsyncSource } from "../hooks/useAsyncSource";
import { Header, Job } from "./Job";
import Spinner from "ink-spinner";
import { useKeyboardSelection } from "../hooks/useKeyboardSelection";
import { useKeyboardNavigation } from "../contexts/KeybboardNavigation/useKeyboardNavigation";

interface Props {
  workflow: Workflow;
  onJobSelect: (job: JobType) => void;
}

export const WorkflowDetails: React.FC<Props> = ({ workflow, onJobSelect }) => {
  const { client } = useCircleCiClient();

  const fetchJobs = useCallback(async () => {
    const jobs = await client.listWorkflowJobs(workflow.id);

    return jobs.items;
  }, []);

  const { data: jobs, isFetching, hasErrors, refresh } = useAsyncSource(
    fetchJobs
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const selectedJob = useKeyboardSelection(jobs || []);

  useKeyboardNavigation({
    return: () => {
      if (selectedJob) {
        onJobSelect && onJobSelect(selectedJob);
      }
    },
  });

  if (hasErrors) {
    return <Text>Couldn't load workflow</Text>;
  }

  if (isFetching && !jobs) {
    return <Spinner />;
  }

  return (
    <Box flexDirection="column">
      <Header />
      {(jobs || []).map((job) => {
        return (
          <Job key={job.id} job={job} inverse={selectedJob?.id === job.id} />
        );
      })}
    </Box>
  );
};

import { Job, Pipeline as PipelineType, Workflow } from "circle-client";
import { Box } from "ink";
import React, { useState } from "react";
import { Header, Pipeline } from "./Pipeline";
import Spinner from "ink-spinner";
import { WorkflowDetails } from "./WorkflowDetails";
import { JobDetails } from "./JobDetails";
import { useKeyboardNavigation } from "../contexts/KeybboardNavigation/useKeyboardNavigation";

interface Props {
  pipeline: PipelineType;
}

export const PipelineDetails: React.FC<Props> = ({ pipeline }) => {
  const [workflows, setWorkflows] = useState<Workflow[] | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useKeyboardNavigation(
    {
      escape: () => {
        setSelectedJob(null);
      },
    },
    !selectedJob
  );

  return (
    <Box borderStyle="single" flexDirection="column" flexGrow={1}>
      <Box padding={1} flexDirection="column">
        <Header />
        <Pipeline pipeline={pipeline} onWorkflows={setWorkflows} />
      </Box>
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

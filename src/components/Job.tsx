import {
  Job as JobType,
  Workflow,
  WorkflowStatus as WorkflowStatusType,
} from "circle-client";
import { Box, Spacer, Text } from "ink";
import React from "react";
import { WorkflowStatus } from "./WorkflowStatus";
import moment from "moment";
import { useDuration } from "../hooks/useDuration";

interface Props {
  job: JobType;
  onWorkflow?: (workflow: Workflow | null) => void;
  inverse?: boolean;
}

export const Job: React.FC<Props> = ({ job, inverse }) => {
  const duration = useDuration(job.started_at, job.stopped_at);

  return (
    <Box alignItems="center">
      <Box width="30%">
        <Text bold inverse={inverse}>
          {job.name}
        </Text>
      </Box>
      <Box width="20%">
        <WorkflowStatus status={job.status as WorkflowStatusType} />
      </Box>
      <Box width="25%">
        <Text color="gray" inverse={inverse}>
          {duration}
        </Text>
      </Box>
      <Spacer />
      <Box width="25%" justifyContent="flex-end">
        <Text color="gray" inverse={inverse}>
          {job.started_at && moment(job.started_at).fromNow()}
        </Text>
      </Box>
    </Box>
  );
};

export const Header: React.FC = () => {
  return (
    <Box alignItems="center" marginBottom={1}>
      <Box width="30%">
        <Text color="white" underline>
          NAME
        </Text>
      </Box>
      <Box width="20%">
        <Text color="white" underline>
          STATUS
        </Text>
      </Box>
      <Box width="25%">
        <Text color="white" underline>
          DURATION
        </Text>
      </Box>
      <Spacer />
      <Box width="25%" justifyContent="flex-end">
        <Text color="white" underline>
          STARTED
        </Text>
      </Box>
    </Box>
  );
};

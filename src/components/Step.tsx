import { BuildStep } from 'circleci-api';
import { WorkflowStatus as WorkflowStatusType } from 'circle-client';
import { Box, Spacer, Text } from 'ink';
import moment from 'moment';
import React from 'react';
import { Status } from './Status';
import { useDuration } from '../hooks/useDuration';

interface Props {
  step: BuildStep;
  inverse?: boolean;
}

export const Step: React.FC<Props> = ({ step, inverse }) => {
  const firstAction = step.actions.length > 0 ? step.actions[0] : null;

  const duration = useDuration(
    firstAction?.start_time || moment().toISOString(),
    firstAction?.end_time
  );

  return (
    <Box alignItems="center">
      <Box width="10%">
        {firstAction && (
          <Status status={firstAction.status as WorkflowStatusType} />
        )}
      </Box>
      <Box width="80%">
        <Text bold inverse={inverse}>
          {step.name}
        </Text>
      </Box>

      <Spacer />

      <Box width="10%" justifyContent="flex-end">
        <Text color="gray" inverse={inverse}>
          {duration}
        </Text>
      </Box>
    </Box>
  );
};

export const Header: React.FC = () => {
  return (
    <Box alignItems="center" marginBottom={1}>
      <Box width="10%">
        <Text color="white" underline>
          STATUS
        </Text>
      </Box>
      <Box width="80%">
        <Text color="white" underline>
          NAME
        </Text>
      </Box>
      <Spacer />
      <Box width="10%" justifyContent="flex-end">
        <Text color="white" underline>
          DURATION
        </Text>
      </Box>
    </Box>
  );
};

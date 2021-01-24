import { Box, Text } from 'ink';
import React from 'react';

interface Props {
  title: string;
}

export const Header: React.FC<Props> = ({ title, children }) => {
  return (
    <Box flexDirection="column" alignItems="center">
      <Text color="white" underline>
        {title.toUpperCase()}
      </Text>
      <Box flexDirection="column" alignItems="center" borderStyle="round">
        {children}
      </Box>
    </Box>
  );
};

import { Box, Text } from "ink";
import React from "react";

interface Props {
  label: string;
  value?: string | null;
}

export const InfoRow: React.FC<Props> = ({ label, value }) => {
  return (
    <Box>
      <Text bold>{label}: </Text>
      <Text>{value}</Text>
    </Box>
  );
};

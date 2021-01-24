import { Collaboration } from "circle-client";
import React from "react";
import { useCollaborations } from "../contexts/Collaborations/useCollaborations";
import Spinner from "ink-spinner";
import { Box, Newline, Text } from "ink";
import SelectInput, { Item } from "ink-select-input";

interface Props {
  onSelect: (collaboration: Collaboration) => void;
}

export const CollaborationsChooser: React.FC<Props> = ({ onSelect }) => {
  const { collaborations, isFetching, hasErrors } = useCollaborations();

  if (isFetching) {
    return <Spinner />;
  }

  if (hasErrors) {
    throw new Error(
      "Couldnt fetch collaborations. Are you sure that you have provided a valid access token?"
    );
  }

  const items = (collaborations || []).map((collaboration) => ({
    label: collaboration.name,
    value: collaboration.name,
  }));

  const handleSelect = (item: { label: string; value: string }) => {
    const collaboration = (collaborations || []).find(
      (c) => c.name === item.value
    );

    if (collaboration) {
      onSelect(collaboration);
    }
  };

  return (
    <Box borderStyle="single" flexDirection="column">
      <Text>Select collaboration:</Text>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
};

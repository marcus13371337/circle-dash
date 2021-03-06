import React from 'react';
import { Text } from 'ink';

export const Logo: React.FC = () => {
  return (
    <Text wrap="truncate-end">
      {`
██████╗██╗██████╗  ██████╗ ██╗      ███████╗       ██████╗  █████╗ ███████╗██╗  ██╗
██╔════╝██║██╔══██╗██╔═══╝ ██║      ██╔════╝       ██╔══██╗██╔══██╗██╔════╝██║  ██║
██║     ██║██████╔╝██║     ██║      █████╗  ████╗  ██║  ██║███████║███████╗███████║
██║     ██║██╔══██╗██║     ██║      ██╔══╝  ╚═══╝  ██║  ██║██╔══██║╚════██║██╔══██║
╚██████╗██║██║  ██║╚██████╗███████╗ ███████╗       ██████╔╝██║  ██║███████║██║  ██║
 ╚═════╝╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝ ╚══════╝       ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`}
    </Text>
  );
};

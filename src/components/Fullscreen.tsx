import { Box } from 'ink';
import React from 'react';
import { useEffect, useState } from 'react';

export const FullScreen: React.FC = ({ children }) => {
  const [size, setSize] = useState({
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    };

    process.stdout.on('resize', onResize);
    return () => {
      process.stdout.off('resize', onResize);
    };
  }, []);

  return (
    <Box width={size.columns} height={size.rows - 1} flexDirection="column">
      {children}
    </Box>
  );
};

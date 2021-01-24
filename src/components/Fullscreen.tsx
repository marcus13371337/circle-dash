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
    process.stdout.write('\x1b[?1049h');
    return () => {
      process.stdout.off('resize', onResize);
      process.stdout.write('\x1b[?1049l');
    };
  }, []);

  return (
    <Box width={size.columns} height={size.rows} flexDirection="column">
      {children}
    </Box>
  );
};

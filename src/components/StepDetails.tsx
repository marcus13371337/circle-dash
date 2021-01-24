import axios from "axios";
import { BuildStep } from "circleci-api";
import { Box, Newline, Text } from "ink";
import React, { useEffect, useMemo } from "react";
import { useCallback } from "react";
import { useAsyncSource } from "../hooks/useAsyncSource";
import { Header, Step } from "./Step";
import Spinner from "ink-spinner";
import { useKeyboardSelection } from "../hooks/useKeyboardSelection";
import stripAnsi from "strip-ansi";

interface Props {
  step: BuildStep;
}

interface Output {
  message: string;
  time: string;
  type: string;
}

const removeAnsi = (str: string) =>
  str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );

export const StepDetails: React.FC<Props> = ({ step }) => {
  const firstAction = step.actions.length > 0 ? step.actions[0] : null;

  const fetchOutput = useCallback(async () => {
    if (!firstAction || !firstAction.output_url) {
      throw new Error("Not a valid step");
    }
    const response = await axios.get<Output[]>(firstAction.output_url);

    return response.data;
  }, []);

  const { data, isFetching, hasErrors, refresh } = useAsyncSource(fetchOutput);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const firstEntry = data && data.length > 0 ? data[0] : null;

  const lines = useMemo(() => {
    if (firstEntry) {
      return firstEntry.message.split(`\n`).map((line, index) => ({
        message: removeAnsi(line) + `\n`,
        id: index,
      }));
    }

    return [];
  }, [firstEntry]);

  const cursor = useKeyboardSelection(lines, {
    preselect: true,
    reversed: true,
  });

  const NUMBER_OF_ROWS = 15;

  const basePosition = cursor ? cursor.id : lines.length - 1;
  const visibleStart =
    basePosition - NUMBER_OF_ROWS > 0 ? basePosition - NUMBER_OF_ROWS : 0;

  const visibleLines = lines.slice(visibleStart, visibleStart + NUMBER_OF_ROWS);

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box flexDirection="column" borderStyle="single">
        <Header />
        <Step step={step} />
      </Box>
      <Box
        borderStyle="single"
        flexGrow={1}
        flexDirection="column"
        justifyContent="flex-end"
        height={NUMBER_OF_ROWS}
      >
        {isFetching && !data && <Spinner />}
        {visibleLines.map((entry) => (
          <Text key={entry.id} color="white" wrap="truncate-end">
            {entry.message}
          </Text>
        ))}
        {hasErrors && <Text>Couldn't get output</Text>}
      </Box>
    </Box>
  );
};

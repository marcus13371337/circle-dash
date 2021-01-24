import { Pipeline as PipelineType, Workflow } from "circle-client";
import { Box, Spacer, Text } from "ink";
import React, { useCallback, useEffect } from "react";
import { useCircleCiClient } from "../contexts/CircleCiClient/useCircleCiClient";
import { useAsyncSource } from "../hooks/useAsyncSource";
import { WorkflowStatus } from "./WorkflowStatus";
import Spinner from "ink-spinner";
import moment from "moment";

interface Props {
  pipeline: PipelineType;
  inverse?: boolean;
  onWorkflows?: (workflows: Workflow[] | null) => void;
}

const getProjectName = (pipeline: PipelineType) => {
  const parts = pipeline.project_slug.split("/");
  const name = parts[parts.length - 1];

  return name;
};

const getCommitHash = (revision: string) => revision.substr(0, 7);

const parseSubject = (subject: string | undefined) => {
  return subject?.substr(0, 80);
};

const isRunning = (workflow: Workflow) => {
  return ["running", "not_run", "on_hold", "failing"].includes(workflow.status);
};

export const Header: React.FC = () => {
  return (
    <Box alignItems="center" marginBottom={1}>
      <Box width="11%">
        <Text color="white" underline>
          PROJECT
        </Text>
      </Box>
      <Box width="3%">
        <Text color="white" underline>
          ID
        </Text>
      </Box>
      <Box width="8%">
        <Text color="white" underline>
          STATUS
        </Text>
      </Box>
      <Box width="14%">
        <Text color="white" underline>
          WORKFLOW
        </Text>
      </Box>
      <Box width="12%">
        <Text color="white" underline>
          AUTHOR
        </Text>
      </Box>
      <Box width="40%">
        <Text color="white" underline>
          VERSION
        </Text>
      </Box>
      <Box width="11%" justifyContent="flex-end">
        <Text color="white" underline>
          STARTED
        </Text>
      </Box>
    </Box>
  );
};

export const Pipeline: React.FC<Props> = ({
  pipeline,
  inverse,
  onWorkflows,
}) => {
  const { client } = useCircleCiClient();
  const fetchWorkflows = useCallback(async () => {
    const response = await client.listPipelineWorkflows(pipeline.id);

    return response.items;
  }, [client, pipeline.id]);

  const { data: workflows, isFetching, refresh } = useAsyncSource(
    fetchWorkflows
  );

  useEffect(() => {
    if (workflows) {
      const firstWorkflow = workflows[0];

      if (isRunning(firstWorkflow)) {
        const timeout = setTimeout(() => {
          refresh();
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }
  }, [workflows, refresh]);

  const firstWorkflow = workflows ? workflows[0] : null;

  useEffect(() => {
    onWorkflows && onWorkflows(workflows);
  }, [onWorkflows, workflows]);

  if (isFetching && !workflows) {
    return <Spinner />;
  }

  return (
    <Box alignItems="center">
      <Box width="11%">
        <Text bold wrap="truncate-end" inverse={inverse}>
          {getProjectName(pipeline)}
        </Text>
      </Box>
      <Box width="3%">
        <Text wrap="truncate-end" inverse={inverse}>
          {pipeline.number}
        </Text>
      </Box>
      <Box width="8%">
        {firstWorkflow && <WorkflowStatus status={firstWorkflow.status} />}
      </Box>
      <Box width="14%">
        {firstWorkflow && (
          <Text wrap="truncate-end" inverse={inverse}>
            {firstWorkflow.name} {(workflows || []).length > 1 ? "(+)" : null}
          </Text>
        )}
      </Box>
      <Box width="12%">
        <Text wrap="truncate-end" inverse={inverse}>
          {pipeline.trigger.actor.login}
        </Text>
      </Box>
      <Box width="40%">
        <Box alignItems="center">
          {pipeline.vcs && (
            <>
              <Text bold wrap="truncate-end" inverse={inverse}>
                {pipeline.vcs.tag || pipeline.vcs.branch} -{" "}
              </Text>
              <Box>
                <Text bold inverse={inverse}>
                  {getCommitHash(pipeline.vcs.revision)}{" "}
                </Text>
                <Text wrap="truncate-end" inverse={inverse}>
                  {parseSubject(pipeline.vcs.commit?.subject)}
                </Text>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Spacer />
      <Box width="11%" justifyContent="flex-end">
        <Text color="gray" wrap="truncate-end" inverse={inverse}>
          {moment(pipeline.created_at).fromNow()}
        </Text>
      </Box>
    </Box>
  );
};

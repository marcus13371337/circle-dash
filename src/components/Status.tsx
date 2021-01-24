import { WorkflowStatus as WorkflowStatusType } from "circle-client";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";

type Status = WorkflowStatusType | "blocked" | "queued";

interface Props {
  status: Status;
  isCompact?: boolean;
}

const getIcon = (status: Status) => {
  switch (status) {
    case "failed":
    case "failing":
    case "error":
      return "!";
    case "success":
      return "✓";
    case "running":
      return <Spinner />;
    case "not_run":
    case "on_hold":
    case "queued":
    case "blocked":
      return "⏳";
    case "canceled":
    case "unauthorized":
      return "❌";
    default:
      return null;
  }
};

const getColors = (status: Status) => {
  switch (status) {
    case "failed":
    case "failing":
    case "error":
      return {
        backgroundColor: "rgb(242, 70, 70)",
        color: "white",
      };
    case "success":
      return {
        backgroundColor: "rgb(4, 155, 74)",
        color: "white",
      };
    case "running":
      return {
        backgroundColor: "gray",
        color: "white",
      };
    case "not_run":
    case "on_hold":
    case "blocked":
    case "queued":
      return {
        backgroundColor: "gray",
        color: "white",
      };
    case "canceled":
    case "unauthorized":
      return {
        backgroundColor: "gray",
        color: "white",
      };
    default:
      return null;
  }
};

const getLabel = (status: Status) => {
  return status.charAt(0).toUpperCase() + status.substr(1);
};

export const Status: React.FC<Props> = ({ status, isCompact = false }) => {
  return (
    <Text {...getColors(status)}>
      {getIcon(status)} {!isCompact && getLabel(status)}
    </Text>
  );
};

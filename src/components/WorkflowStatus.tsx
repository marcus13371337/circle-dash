import { WorkflowStatus as WorkflowStatusType } from "circle-client";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";

interface Props {
  status: WorkflowStatusType;
  isCompact?: boolean;
}

const getIcon = (status: WorkflowStatusType) => {
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
      return "⏳";
    case "canceled":
    case "unauthorized":
      return "❌";
    default:
      return null;
  }
};

const getColors = (status: WorkflowStatusType | "blocked") => {
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

const getLabel = (status: WorkflowStatusType) => {
  return status.charAt(0).toUpperCase() + status.substr(1);
};

export const WorkflowStatus: React.FC<Props> = ({
  status,
  isCompact = false,
}) => {
  return (
    <Text {...getColors(status)}>
      {getIcon(status)} {!isCompact && getLabel(status)}
    </Text>
  );
};

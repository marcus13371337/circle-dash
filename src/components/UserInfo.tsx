import React from "react";
import { useUser } from "../contexts/User/useUser";
import Spinner from "ink-spinner";
import { InfoRow } from "./InfoRow";

export const UserInfo: React.FC = () => {
  const { user, hasErrors, isFetching } = useUser();

  if (hasErrors) {
    throw new Error(
      "Error while getting user. Are you sure that you have provided a valid access token?"
    );
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <>
      <InfoRow label="Name" value={user?.name} />
      <InfoRow label="Username" value={user?.login} />
    </>
  );
};

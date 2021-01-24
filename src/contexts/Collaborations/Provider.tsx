import { Collaboration } from 'circle-client';
import React, { createContext, useCallback } from 'react';
import { useAsyncSource } from '../../hooks/useAsyncSource';
import { useCircleCiClient } from '../CircleCiClient/useCircleCiClient';

export interface OrganizationContextProvider {
  isFetching: boolean;
  hasErrors: boolean;
  collaborations: Collaboration[] | null;
}

export const CollaborationsContext = createContext<OrganizationContextProvider>(
  {
    isFetching: false,
    hasErrors: false,
    collaborations: null,
  }
);

export const Provider: React.FC = ({ children }) => {
  const { client } = useCircleCiClient();
  const fetchCollaborations = useCallback(async () => {
    return await client.getCollaborations();
  }, [client]);

  const { data, isFetching, hasErrors } = useAsyncSource(fetchCollaborations);

  return (
    <CollaborationsContext.Provider
      value={{ collaborations: data, isFetching, hasErrors }}
    >
      {children}
    </CollaborationsContext.Provider>
  );
};

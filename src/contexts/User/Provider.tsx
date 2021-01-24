import { User } from 'circle-client';
import React, { createContext, useCallback } from 'react';
import { useAsyncSource } from '../../hooks/useAsyncSource';
import { useCircleCiClient } from '../CircleCiClient/useCircleCiClient';

export interface UserContextType {
  isFetching: boolean;
  hasErrors: boolean;
  user: User | null;
}

export const UserContext = createContext<UserContextType>({
  isFetching: false,
  hasErrors: false,
  user: null,
});

export const Provider: React.FC = ({ children }) => {
  const { client } = useCircleCiClient();
  const fetchUser = useCallback(async () => {
    return await client.getMe();
  }, [client]);

  const { data, isFetching, hasErrors } = useAsyncSource(fetchUser);

  return (
    <UserContext.Provider value={{ user: data, isFetching, hasErrors }}>
      {children}
    </UserContext.Provider>
  );
};

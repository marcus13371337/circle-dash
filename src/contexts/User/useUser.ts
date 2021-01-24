import { useContext } from 'react';
import { UserContext } from './Provider';

export const useUser = () => useContext(UserContext);

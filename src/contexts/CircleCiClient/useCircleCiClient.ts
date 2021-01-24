import { useContext } from 'react';
import { CircleCiClientContext } from './Provider';

export const useCircleCiClient = () => useContext(CircleCiClientContext);

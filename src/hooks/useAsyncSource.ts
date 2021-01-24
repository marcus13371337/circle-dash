import { useCallback, useEffect, useReducer } from 'react';

interface Reset {
  type: 'RESET';
}

interface FetchStarted {
  type: 'FETCH_STARTED';
}

interface FetchSuccess<T> {
  type: 'FETCH_SUCCESS';
  payload: {
    data: T;
  };
}

interface FetchFailed {
  type: 'FETCH_FAILED';
  payload: {
    error: unknown;
  };
}

type Action<T> = Reset | FetchStarted | FetchSuccess<T> | FetchFailed;
interface State<T> {
  isInitial: boolean;
  isFetching: boolean;
  error: any | null;
  data: T | null;
}

const initalState = {
  isInitial: true,
  data: null,
  error: null,
  isFetching: false,
};

const createReducer = <T>() => (
  state: State<T>,
  action: Action<T>
): State<T> => {
  switch (action.type) {
    case 'RESET':
      return state.isInitial ? state : initalState;
    case 'FETCH_STARTED':
      return {
        ...state,
        isFetching: true,
      };
    case 'FETCH_FAILED':
      return {
        ...state,
        isFetching: false,
        isInitial: false,
        error: action.payload.error,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isInitial: false,
        data: action.payload.data,
      };
    default:
      return state;
  }
};

export const useAsyncSource = <T>(fetchData: () => Promise<T>) => {
  const reducer = createReducer<T>();
  const [state, dispatch] = useReducer(reducer, {
    isInitial: true,
    data: null,
    error: null,
    isFetching: false,
  });

  const fetch = useCallback(async () => {
    dispatch({
      type: 'FETCH_STARTED',
    });

    try {
      const data = await fetchData();
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          data,
        },
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILED',
        payload: {
          error,
        },
      });
    }
  }, [fetchData]);

  useEffect(() => {
    if (state.isInitial && !state.isFetching) {
      fetch();
    }
  }, [state.isInitial, state.isFetching, fetch]);

  useEffect(() => {
    dispatch({
      type: 'RESET',
    });
  }, [fetch]);

  return {
    ...state,
    hasErrors: !!state.error,
    refresh: useCallback(() => {
      fetch();
    }, [fetch]),
  };
};

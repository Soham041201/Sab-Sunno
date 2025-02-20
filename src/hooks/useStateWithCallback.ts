import { useCallback, useEffect, useRef, useState } from 'react';

export const useStateWithCallback = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const cbRef = useRef<((state: T) => void) | null>(null);

  const setStateWithCallback = useCallback(
    (newState: T | ((prevState: T) => T), cb: (state: T) => void) => {
      cbRef.current = cb;

      setState((prevState: T) => {
        return typeof newState === 'function'
          ? (newState as (prevState: T) => T)(prevState)
          : newState;
      });
    },
    []
  );

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateWithCallback] as const;
};

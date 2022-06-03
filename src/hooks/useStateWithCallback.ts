import { ComponentState } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback = (initialState: ComponentState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<any>(null);

  const setStateWithCallback = useCallback(
    (newState: ComponentState, cb: FunctionStringCallback) => {
      cbRef.current = cb;

      setState((prevState: ComponentState) => {
        return typeof newState === "function" ? newState(prevState) : newState;
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

  return [state, setStateWithCallback];
};

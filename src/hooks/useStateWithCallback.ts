import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback = (initialState: any) => {
    const [state, setState] = useState(initialState);

    const cbRef = useRef<any>();

   
    const setStateWithCallback = useCallback((newState: (arg0: any) => any,cb: undefined) => {
        cbRef.current = cb;

        setState((prevState: any) => {
            return typeof newState === "function" ? newState(prevState) : newState;
        })
    
    }, []);

    useEffect(()=>{
        if(cbRef.current){
            cbRef.current(state);
            cbRef.current = null;
        }
    },[state])
    
    return [state, setStateWithCallback];
}
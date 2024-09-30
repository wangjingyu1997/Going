import { useCallback, useReducer, useState } from "react";
import { keepAliveReducer } from "./keepAliveReducer";
import { KeepAliveContext } from "./KeepAliveContext";
import * as actionTypes from "./actionType";

export function KeepAlive(props) {

  /**
   * 
  {
    home:{
      keepAliveId:"home"
      reactElement:reactElement,
      nodes:nodes,
      status,
    }
  }
  * 
   **/
  const [keepAliveStates, dispatch] = useReducer(keepAliveReducer, {});
  const setKeepAliveState = useCallback(({ reactElement, keepAliveId }) => {
    if (!keepAliveStates[keepAliveId]) {
      dispatch({
        type: actionTypes.CREATING,
        payload: {
          keepAliveId,
          reactElement,
        }
      });
    }
  }, [keepAliveStates]);
  return (
    <KeepAliveContext.Provider
      value={{
        setKeepAliveState,
        keepAliveStates,
        dispatch,
      }}>
      {props.children}
      {
        Object.values(keepAliveStates) && Object.values(keepAliveStates).map(({ keepAliveId, reactElement }, index) => {
          return (
            <div key={index + '' + keepAliveId} ref={(node) => {
              if (node && !keepAliveStates[keepAliveId].nodes) {
                dispatch({
                  type: actionTypes.CREATED,
                  payload: {  
                    keepAliveId,
                    nodes: [...node.childNodes]
                  }
                })
              }
            }}>
              {reactElement}
            </div>
          )
        })
      }
    </KeepAliveContext.Provider >
  );
}

import * as actionTypes from "./actionType";
export function keepAliveReducer(state, aciton) {
  const { type, payload } = aciton;
  const { keepAliveId, reactElement, nodes } = payload;
  switch (type) {
    case actionTypes.CREATING:
      return {
        ...state,
        [keepAliveId]: {
          keepAliveId,
          status: type,
          reactElement,
          nodes: null,
        },
      };
    case actionTypes.CREATED:
      return {
        ...state,
        [keepAliveId]: {
          ...state[keepAliveId],
          status: type,
          reactElement,
          nodes
        },
      };

    default:
      return state;
  }
}

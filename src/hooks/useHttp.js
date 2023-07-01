import { useCallback, useReducer } from "react";

const initialState = {
  isLoading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        ...currentHttpState,
        isLoading: true,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        isLoading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return {
        isLoading: false,
        error: action.errorMessage,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not go there!");
  }
};

function useHttp() {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: "SEND", identifier: reqIdentifier });

      fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          dispatchHttp({
            type: "RESPONSE",
            responseData: resData,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          dispatchHttp({ type: "ERROR", errorMessage: err.message });
        });
    },
    []
  );

  return {
    isLoading: httpState.isLoading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.reqExtra,
    reqIdentifier: httpState.reqIdentifier,
    clear
  }
}

export default useHttp;

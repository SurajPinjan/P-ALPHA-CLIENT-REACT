import { GlobalState } from "../types/types";
import { legacy_createStore as createStore } from "redux";
import { DateTime } from "luxon";
const initialState: GlobalState = {
  code: "",
  displayMsg: "",
  apiTime: DateTime.now().toISO(),
  errMsg: undefined,
};

const globalReducer = (state = initialState, action: any) => {

  if (
    action instanceof Object &&
    "newCode" in action &&
    "newDisplayMsg" in action &&
    "newErrMsg" in action && 
    "apiTime" in action
  ) {
    const return_state = {
      ...state,
      code: action.newCode ? action.newCode : state.code,
      displayMsg: action.newDisplayMsg
        ? action.newDisplayMsg
        : state.displayMsg,
      errMsg: action.newErrMsg ? action.newErrMsg : state.errMsg,
      apiTime: action.apiTime
    };

    return return_state;
  } else {
    return initialState;
  }
};

const store = createStore(globalReducer);

export default store;

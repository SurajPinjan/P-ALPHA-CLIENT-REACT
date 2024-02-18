import { GlobalState } from "../types/types";
import { legacy_createStore as createStore } from "redux";
import { DateTime } from "luxon";
const initialState: GlobalState = {
  code: "",
  displayMsg: "",
  apiTime: DateTime.now().toISO(),
  errMsg: undefined,
  APIBody: "",
  APIUrl: "",
};

const globalReducer = (state = initialState, action: any) => {
  if (
    action instanceof Object &&
    "newCode" in action &&
    "newDisplayMsg" in action &&
    "newErrMsg" in action &&
    "newAPIBody" in action &&
    "newAPIUrl" in action &&
    "apiTime" in action
  ) {
    const return_state = {
      ...state,
      code: action.newCode,
      displayMsg: action.newDisplayMsg,
      errMsg: action.newErrMsg,
      apiTime: action.apiTime,
      APIBody: action.newAPIBody,
      APIUrl: action.newAPIUrl,
    };

    return return_state;
  } else {
    return initialState;
  }
};

const store = createStore(globalReducer);

export default store;

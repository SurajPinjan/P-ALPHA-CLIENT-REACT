import { GlobalState } from "../types/types";
import { Action, legacy_createStore as createStore } from "redux";
import { DateTime } from "luxon";
import { BLANK } from "../types/enums";
const initialState: GlobalState = {
  code: BLANK,
  displayMsg: BLANK,
  apiTime: DateTime.now().toISO(),
  errMsg: undefined,
  APIBody: BLANK,
  APIUrl: BLANK,
  selectUId: -1,
};

export interface ActionInterface extends Action {
  _Code: string;
  _DisplayMsg: string;
  _ErrMsg?: string;
  _APIBody: string;
  _APIUrl: string;
  apiTime: string;

  _SelectUId?: number;
}

const globalReducer = (state = initialState, action: ActionInterface) => {
  if (
    action instanceof Object &&
    "_Code" in action &&
    "_DisplayMsg" in action &&
    "_ErrMsg" in action &&
    "_APIBody" in action &&
    "_APIUrl" in action &&
    "apiTime" in action &&
    "_SelectUId" in action
  ) {
    const return_state = {
      ...state,
      code: action._Code,
      displayMsg: action._DisplayMsg,
      errMsg: action._ErrMsg,
      apiTime: action.apiTime,
      APIBody: action._APIBody,
      APIUrl: action._APIUrl,
      selectUId: action._SelectUId,
    };

    return return_state;
  } else {
    return initialState;
  }
};

const store = createStore(globalReducer);

export default store;

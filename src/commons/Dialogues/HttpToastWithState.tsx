import { connect } from "react-redux";
import { GlobalState } from "../../types/types";
import HttpToast from "./HttpToast";

const mapStateToProps = (state: GlobalState) => ({
  code: state.code,
  displayMsg: state.displayMsg,
  errMsg: state.errMsg,
  apiTime: state.apiTime,
  APIBody: state.APIBody,
  APIUrl: state.APIUrl,
});

const HttpToastWithState = connect(mapStateToProps)(HttpToast);
export default HttpToastWithState;

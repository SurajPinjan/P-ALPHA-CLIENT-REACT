import { connect } from "react-redux";
import { GlobalState } from "../../types/types";
import HttpToast from "./HttpToast";

const mapStateToProps = (state: GlobalState) => ({
  code: state.code,
  displayMsg: state.displayMsg,
  errMsg: state.errMsg,
  apiTime: state.apiTime,
});

const HttpToastWithState = connect(mapStateToProps)(HttpToast);
export default HttpToastWithState;

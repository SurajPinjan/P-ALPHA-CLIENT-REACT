import { connect } from "react-redux";
import { GlobalState } from "../types/types";
import APILoader from "./APILoader";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loading,
  code: state.code,
  displayMsg: state.displayMsg,
  errMsg: state.errMsg,
  apiTime: state.apiTime,
  APIBody: state.APIBody,
  APIUrl: state.APIUrl,
});

const APILoaderWithState = connect(mapStateToProps)(APILoader);
export default APILoaderWithState;

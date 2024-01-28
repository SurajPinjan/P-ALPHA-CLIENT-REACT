import _ from "lodash";

const deepReducerFunction = <G>(state: G, newState: G): G => {
  if (_.isEqual(state, newState)) {
    return state;
  } else {
    return _.cloneDeep(newState);
  }
};

export { deepReducerFunction };

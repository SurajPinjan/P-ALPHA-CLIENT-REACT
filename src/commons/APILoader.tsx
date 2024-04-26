import * as React from "react";
import LoadingBar from "react-top-loading-bar";
import { GlobalState } from "../types/types";

const APILoader = ({ loading }: GlobalState) => {
  // constants

  //   states
  const [lding, setLoading] = React.useState<number>();

  // hooks

  React.useEffect(() => {
    setLoading(loading ? 50 : 100);
  }, [loading]);

  //   DOM
  return (
    <div>
      <LoadingBar
        height={5}
        shadow={true}
        color="#f11946"
        progress={lding}
        onLoaderFinished={() => setLoading(0)}
      />
    </div>
  );
};

export default APILoader;

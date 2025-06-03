import React from "react";
import CircleLoader from "react-spinners/CircleLoader";

const DataTableLoadingComponent = () => (
  <div className="flex justify-center items-center min-h-1/2">
    <CircleLoader color="#36d7b7" />
  </div>
);

export default DataTableLoadingComponent;

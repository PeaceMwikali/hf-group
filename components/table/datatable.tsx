"use client";
import React, { Suspense, type JSX } from "react";
import DataTable, { TableProps } from "react-data-table-component";

import LoadingComponent from "../loading";
import DataTableLoadingComponent from "../loading/datatableLoading";

// const selectProps = {

function DataTableBase(props: any): JSX.Element {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <DataTable
        pagination
        highlightOnHover
        keyField="id"
        striped={true}
        persistTableHead={true}
        responsive={true}
        progressComponent={<DataTableLoadingComponent />}
        {...props}
      />
    </Suspense>
  );
}

export default DataTableBase;

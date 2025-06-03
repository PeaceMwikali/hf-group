"use client";

import React, { useCallback, useEffect, useState } from "react";

import DataTableBase from "../table/datatable";
import { useRouter } from "next/navigation";
import DataTableLoadingComponent from "../loading/datatableLoading";
import Swal from "sweetalert2";
import { TransactionInterface } from "@/types/transactions";
import Link from "next/link";
import Export, { downloadData, ExportFormat } from "../table/exportCsv";

// Types for modal and levels
type ModalType = "add" | "edit" | "delete" | null;

interface TransactionInput {
  transactions: TransactionInterface[];
  page: number;
  limit: number;
  count: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

const TransactionTable: React.FC<TransactionInput> = ({
  count,
  page,
  limit,
  transactions,
  searchParams,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Close modal

  const loadingCallback = useCallback(() => {
    // timeout for 1 second
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    loadingCallback();
  }, [loadingCallback]);

  const handlePageChange = (page: number) => {
    const payload = {
      ...structuredClone(searchParams),
      page: page.toString(),
    };
    const params = new URLSearchParams(payload);
    router.push(`/transactions?${params.toString()}`, {
      scroll: false,
    });
  };
  const handleRowsPerPageChange = (limit: number) => {
    const payload = {
      ...structuredClone(searchParams),
      limit: limit.toString(),
    };
    const params = new URLSearchParams(payload);
    router.push(`/transactions?${params.toString()}`, {
      scroll: false,
    });
  };

  const refetch = () => {
    router.refresh();
  };

  const columns = [
    {
      name: "TRANSACTION REFERENCE",
      selector: (row: TransactionInterface) => row.transactionRef,
    },
    {
      name: "ACCOUNT NUMBER",
      selector: (row: TransactionInterface) => row.accountNumber,
    },
    {
      name: "AMOUNT",
      selector: (row: TransactionInterface) => row.amount,
    },
    {
      name: "NARRATION",
      selector: (row: TransactionInterface) => row.narration,
    },
    {
      name: "TRANSACTION TIME",
      selector: (row: TransactionInterface) => row.transactionTime,
    },
    {
      name: "STATUS",
      selector: (row: TransactionInterface) => row.status,
    },
    {
      name: "ACTION",
      selector: (row: TransactionInterface) => (
        <div className="flex items-center gap-4">
          {/* Edit Icon */}
          <Link href={`/transactions/${row.id}/${row.transactionRef}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="2em"
              height="2em"
            >
              <path
                fill="currentColor"
                d="M8 3C4.511 3 1.486 5.032 0 8c1.486 2.968 4.511 5 8 5s6.514-2.032 8-5c-1.486-2.968-4.511-5-8-5m3.945 2.652c.94.6 1.737 1.403 2.335 2.348a7.6 7.6 0 0 1-2.335 2.348a7.33 7.33 0 0 1-7.889 0A7.6 7.6 0 0 1 1.721 8a7.6 7.6 0 0 1 2.52-2.462a4 4 0 1 0 7.518 0q.093.056.185.114zM8 6.5a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 8 6.5"
              ></path>
            </svg>
          </Link>

          {/* Delete Icon */}
        </div>
      ),
    },
  ];
  const handleExport = (format: ExportFormat) => {
    downloadData(transactions, columns, "Transactions", format);
  };

  return (
    <div className=" bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 min-h-screen">
      <div className="mb-7.5 flex items-center justify-between">
        <h5 className="text-xl font-bold">Transactions</h5>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center min-h-1/2">
            <DataTableLoadingComponent />
          </div>
        ) : (
          <>
            <Export onExport={handleExport} />
            <DataTableBase
              columns={columns}
              data={transactions}
              // progressPending={loading}
              paginationTotalRows={count}
              paginationPerPage={limit}
              paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              paginationServer
              selectableRows
              progressPending={loading}
              customStyles={{
                headCells: {
                  style: {
                    backgroundColor: "#204d80",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "center",
                  },
                },
                rows: {
                  style: {
                    height: "80px",
                    fontSize: "14px",
                    fontFamily: "system-ui",
                  },
                },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Reusable Modal Component

export default TransactionTable;

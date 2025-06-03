import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import ErrorPage from "@/components/error";
import { TransactionInterface } from "@/types/transactions";
const TransactionPage: React.FC<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string[] }>;
}> = async ({ searchParams, params }) => {
  const incomingParams = await params;
  const incomingSearchParams = await searchParams;

  const transactionId = incomingParams.slug[0];
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return <ErrorPage />;
  }
  const response = await axios.get(
    `${process.env.url}transactions/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.status !== 200) {
    return <ErrorPage />;
  }
  const transaction: TransactionInterface = response.data;

  return (
    <div className=" bg-white flex justify-center items-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Transaction Details
              </h1>
              <span className="text-sm text-gray-500">
                {new Date(transaction.transactionTime).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600">Transaction Reference</span>
                <span className="font-medium text-gray-900">
                  {transaction.transactionRef}
                </span>
              </div>

      
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium text-gray-900">
                  {transaction.accountNumber}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">
                  {transaction.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600">Narration</span>
                <span className="font-medium text-gray-900">
                  {transaction.narration || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600">Transaction Time</span>
                <span className="font-medium text-gray-900">
                  {transaction.transactionTime || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-gray-900">
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;

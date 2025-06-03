import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import TransactionTable from "@/components/transaction";
import ErrorPage from "@/components/error";
interface PROP {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const TransactionsPage = async ({ searchParams }: PROP) => {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return <ErrorPage />;
  }
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 10;
  // curl --location 'http://209.38.167.19:3001/api/transactions?pageNo=0&pageSize=10&sortBy=id&sortDirection=desc'
  const response = await axios.get(`${process.env.url}transactions`, {
    params: {
      pageNo: page - 1,
      pageSize: limit,
      sortBy: "id",
      sortDirection: "desc",
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status !== 200) {
    return <ErrorPage />;
  }

  return (
    <main className="min-h-screen bg-white text-black ">
      <TransactionTable
        transactions={response.data.data.content}
        page={page}
        limit={limit}
        count={response.data.data.totalElements}
        searchParams={params}
      />
      {/* Add your transaction components or logic here */}
    </main>
  );
};

export default TransactionsPage;

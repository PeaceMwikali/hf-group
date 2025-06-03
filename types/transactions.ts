export interface TransactionInterface {
  id: number;
  transactionRef: string;
  accountNumber: string;
  amount: number;
  narration: string;
  transactionTime: string;
  status: string;
  userId: number;
}

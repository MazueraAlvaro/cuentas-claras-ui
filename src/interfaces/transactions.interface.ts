export interface Transaction {
  id: number;
  amount: number;
  datetime: string;
  description: string;
  bank: string;
  merchant: string;
  type: "transferencia" | "compra";
  category?: TransactionCategory;
}

export interface TransactionCategory {
  id: number;
  name: string;
  description: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
}
export interface CreateTransactionDTO {
  amount: number;
  date: string;
  description: string;
  type: "income" | "expense";
  categoryId: number;
}

export interface UpdateTransactionDTO {
  amount?: number;
  date?: string;
  description?: string;
  type?: "income" | "expense";
  categoryId?: number;
}

import { Transaction } from "./transactions.interface";

export interface CreditCard {
  id: number;
  name: string;
  limit: number;
  closingDay: number;
  bank: string;
  franchise: string;
  lastDigits: string;
  transactions: Transaction[];
  totalAmount: number;
}

export interface CreditCardResponse {
  data: CreditCard[];
  total: number;
}

export interface CreateCreditCardDTO {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  userId: number;
}

export interface UpdateCreditCardDTO {
  name?: string;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
}

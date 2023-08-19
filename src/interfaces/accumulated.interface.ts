import { Expense } from "./expenses.interface";

export interface MonthAccumulated {
  amount: number;
  month: number;
  paid: boolean;
  year: number;
}

export interface ExpenseAccumulated {
  expense: Partial<Expense>;
  months: MonthAccumulated[];
  totalPaid: number;
  totalUnpaid: number;
  total: number;
}

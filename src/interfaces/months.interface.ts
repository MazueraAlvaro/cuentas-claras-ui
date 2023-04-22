import { Expense } from "./expenses.interface";
import { Income } from "./incomes.interface";

export enum MonthStatus {
  OPEN = "OPEN",
  CLOSE = "CLOSED",
}

export interface MonthIncome {
  id: number;
  monthId: number;
  incomeId: number;
  amount: number;
  received: boolean;
  income: Income;
}

export interface MonthExpense {
  id: number;
  monthId: number;
  expenseId: number;
  amount: number;
  paid: boolean;
  expense: Expense;
}

export interface Month {
  id: number;
  month: Date;
  status: MonthStatus;
  totalIncomes: number;
  totalExpenses: number;
  difference: number;
  currentBalance: number;
  totalUnpaid: number;
  monthIncomes: MonthIncome[];
  monthExpenses: MonthExpense[];
}

export const isMonthIncome = (obj: any): obj is MonthIncome => {
  return "received" in obj;
};

export const isMonthExpense = (obj: any): obj is MonthExpense => {
  return "paid" in obj;
};

export interface ExpenseType {
  id: number;
  name: string;
  description: string;
}

export interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
  isRecurring: boolean;
  dueDay: number;
  startAt: string;
  endAt: string;
  expenseType: ExpenseType;
}

export interface ExpenseInitialValues
  extends Omit<Expense, "id" | "expenseType"> {
  expenseType: number | null;
}

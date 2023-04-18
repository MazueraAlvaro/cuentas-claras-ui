export interface IncomeType {
  id: number;
  name: string;
  description: string;
}

export interface Income {
  id: number;
  name: string;
  description: string;
  amount: number;
  isRecurring: boolean;
  startAt: string;
  endAt: string;
  incomeType: IncomeType;
}

export interface IncomeInitialValues extends Omit<Income, "id" | "incomeType"> {
  incomeType: number;
}

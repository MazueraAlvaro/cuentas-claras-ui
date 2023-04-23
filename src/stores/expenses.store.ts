import { create } from "zustand";
import { Expense } from "../interfaces/expenses.interface";
import axios from "axios";

interface ExpensesStore {
  expenses: Expense[];
  loadExpenses: () => Promise<void>;
  addExpense: (expense: Expense) => void;
}

export const useExpensesStore = create<ExpensesStore>((set, get) => ({
  expenses: [],
  loadExpenses: async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/expenses`
    );
    set({ expenses: data });
  },
  addExpense: (expense: Expense) => {
    set((state) => ({ expenses: [...state.expenses, expense] }));
  },
}));

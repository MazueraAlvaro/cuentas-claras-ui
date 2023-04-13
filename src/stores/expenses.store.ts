import { create } from "zustand";
import { Expense } from "../interfaces/expenses.interface";
import axios from "axios";

interface ExpensesStore {
  expenses: Expense[];
  loadExpenses: () => void;
}

export const useExpensesStore = create<ExpensesStore>((set, get) => ({
  expenses: [],
  loadExpenses: async () => {
    const { data } = await axios.get("http://localhost:3000/api/expenses");
    set({ expenses: data });
  },
}));

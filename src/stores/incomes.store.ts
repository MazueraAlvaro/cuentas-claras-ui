import { create } from "zustand";
import axios from "axios";
import { Income } from "../interfaces/incomes.interface";
import { env } from "../config/env";

interface IncomesStore {
  incomes: Income[];
  loadIncomes: () => void;
  addIncome: (income: Income) => void;
}

export const useIncomesStore = create<IncomesStore>((set, get) => ({
  incomes: [],
  loadIncomes: async () => {
    const { data } = await axios.get(`${env?.REACT_APP_API_URL}/api/incomes`);
    set({ incomes: data });
  },
  addIncome: (income: Income) => {
    set((state) => ({ incomes: [...state.incomes, income] }));
  },
}));

import { create } from "zustand";
import axios from "axios";
import { Month } from "../interfaces/months.interface";
import { env } from "../config/env";

interface MonthStore {
  month: Month | undefined;
  loadMonthByDate: (date: string) => Promise<void>;
  loadMonthById: (id: number) => void;
  openMonth: (month: string) => Promise<void>;
  closeMonth: () => Promise<void>;
  updateMonthIncome: (
    monthIncomeId: number,
    amount: number,
    received: boolean
  ) => Promise<void>;
  updateMonthExpense: (
    monthExpenseId: number,
    amount: number,
    paid: boolean,
    creditCard: boolean
  ) => Promise<void>;
  deleteMonthExpense: (monthExpenseId: number) => Promise<void>;
  deleteMonthIncome: (monthIncomeId: number) => Promise<void>;
  addMonthExpense: (expenseId: number) => Promise<void>;
  addMonthIncome: (incomeId: number) => Promise<void>;
}

export const useMonthStore = create<MonthStore>((set, get) => ({
  month: undefined,
  loadMonthByDate: async (date) => {
    try {
      const { data } = await axios.get(
        `${env?.REACT_APP_API_URL}/api/months/byDate/` + date
      );
      set({ month: data });
    } catch (error) {
      set({ month: undefined });
      throw error;
    }
  },
  loadMonthById: async (id) => {
    const { data } = await axios.get(
      `${env?.REACT_APP_API_URL}/api/months/` + id
    );
    set({ month: data });
  },
  openMonth: async (month: string) => {
    const { data } = await axios.post(
      `${env?.REACT_APP_API_URL}/api/months/generate/` + month
    );
    set({ month: data });
  },
  closeMonth: async () => {
    const month = get().month;
    if (month) {
      const { data } = await axios.post(
        `${env?.REACT_APP_API_URL}/api/months/close/` + month.id
      );
      set({ month: data });
    }
  },
  updateMonthIncome: async (
    monthIncomeId: number,
    amount: number,
    received: boolean
  ) => {
    const month = get().month;
    const { data } = await axios.patch(
      `${env?.REACT_APP_API_URL}/api/months/${month?.id}/monthIncomes/${monthIncomeId}`,
      {
        amount,
        received,
      }
    );
    set({ month: data });
  },
  updateMonthExpense: async (
    monthExpenseId: number,
    amount: number,
    paid: boolean,
    creditCard: boolean
  ) => {
    const month = get().month;
    const { data } = await axios.patch(
      `${env?.REACT_APP_API_URL}/api/months/${month?.id}/monthExpenses/${monthExpenseId}`,
      {
        amount,
        paid,
        creditCard,
      }
    );
    set({ month: data });
  },
  deleteMonthExpense: async (monthExpenseId: number) => {
    const month = get().month;
    const { data } = await axios.delete(
      `${env?.REACT_APP_API_URL}/api/months/${month?.id}/deleteMonthExpense/${monthExpenseId}`
    );
    set({ month: data });
  },
  deleteMonthIncome: async (monthIncomeId: number) => {
    const month = get().month;
    const { data } = await axios.delete(
      `${env?.REACT_APP_API_URL}/api/months/${month?.id}/deleteMonthIncome/${monthIncomeId}`
    );
    set({ month: data });
  },
  addMonthExpense: async (expenseId: number) => {
    const month = get().month;
    const { data } = await axios.post(
      `${env?.REACT_APP_API_URL}/api/months/${month?.id}/addExpense/${expenseId}`
    );
    set({ month: data });
  },
  addMonthIncome: async (incomeId: number) => {
    const month = get().month;
    const { data } = await axios.post(
      `${env?.REACT_APP_API_URL}/api/months/${month?.id}/addIncome/${incomeId}`
    );
    set({ month: data });
  },
}));

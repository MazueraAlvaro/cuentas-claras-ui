import { create } from "zustand";
import axios from "axios";
import { Month } from "../interfaces/months.interface";

interface MonthStore {
  month: Month | undefined;
  loadMonthByDate: (date: string) => Promise<void>;
  loadMonthById: (id: number) => void;
  openMonth: (month: string) => Promise<void>;
  updateMonthIncome: (
    monthIncomeId: number,
    amount: number,
    received: boolean
  ) => Promise<void>;
}

export const useMonthStore = create<MonthStore>((set, get) => ({
  month: undefined,
  loadMonthByDate: async (date) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/months/byDate/" + date
      );
      set({ month: data });
    } catch (error) {
      set({ month: undefined });
      throw error;
    }
  },
  loadMonthById: async (id) => {
    const { data } = await axios.get("http://localhost:3000/api/months/" + id);
    set({ month: data });
  },
  openMonth: async (month: string) => {
    const { data } = await axios.post(
      "http://localhost:3000/api/months/generate/" + month
    );
    set({ month: data });
  },
  updateMonthIncome: async (
    monthIncomeId: number,
    amount: number,
    received: boolean
  ) => {
    const month = get().month;
    const { data } = await axios.patch(
      `http://localhost:3000/api/months/${month?.id}/monthIncomes/${monthIncomeId}`,
      {
        amount,
        received,
      }
    );
    set({ month: data });
  },
}));

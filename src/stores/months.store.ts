import { create } from "zustand";
import axios from "axios";
import { Month } from "../interfaces/months.interface";

interface MonthStore {
  month: Month | undefined;
  loadMonthByDate: (date: string) => void;
  loadMonthById: (id: number) => void;
}

export const useMonthStore = create<MonthStore>((set, get) => ({
  month: undefined,
  loadMonthByDate: async (date) => {
    const { data } = await axios.get(
      "http://localhost:3000/api/months/byDate/" + date
    );
    set({ month: data });
  },
  loadMonthById: async (id) => {
    const { data } = await axios.get("http://localhost:3000/api/months/" + id);
    set({ month: data });
  },
}));

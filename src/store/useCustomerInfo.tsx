import { Customer } from "@/lib/types";
import { create } from "zustand";

type CustomerInfo = {
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
};

export const useCustomerInfo = create<CustomerInfo>((set, get) => ({
  customer: null,
  setCustomer: (customer) => set({ customer }),
}));

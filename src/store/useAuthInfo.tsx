import { AuthUser } from "@/lib/types";
import { create } from "zustand";

type AuthUserInfo = {
  user: AuthUser | null;
  setUser: (customer: AuthUser | null) => void;
};

export const useAuthInfo = create<AuthUserInfo>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

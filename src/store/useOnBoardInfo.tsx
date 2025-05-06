import { OnboardingForm } from "@/lib/types";
import { create } from "zustand";

type OnBoardInfo = {
  onboard: OnboardingForm | null;
  setOnboard: (onboard: OnboardingForm) => void;
};

export const useOnBoardInfo = create<OnBoardInfo>((set, get) => ({
  onboard: null,
  setOnboard: (onboard) => set({ onboard }),
}));

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleNext: () => void;
  isFormValid: boolean;
  loading: boolean;
};

function NavigationButtons({
  currentStep,
  setCurrentStep,
  handleNext,
  isFormValid,
  loading,
}: Props) {
  return (
    <div className="mt-6 flex flex-col justify-between gap-4 px-4 sm:flex-row">
      <Button
        onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
        disabled={currentStep <= 1}
        variant={"secondary"}
        className={clsx(
          "w-full cursor-pointer rounded-md px-4 py-2 text-sm sm:w-auto sm:text-base",
          currentStep <= 1
            ? "cursor-not-allowed bg-[var(--color-previous-button-disabled)]"
            : "",
        )}
      >
        {currentStep > 1 ? "Previous" : ""}
      </Button>

      {currentStep === 3 ? (
        <>
          <div className="flex gap-3 max-sm:flex max-sm:flex-col">
            <Button
              onClick={() => redirect("/dashboard")}
              disabled={loading}
              className="w-full cursor-pointer rounded-md px-4 py-2 text-sm sm:w-auto sm:text-base"
            >
              Skip for now
            </Button>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="w-full cursor-pointer rounded-md px-4 py-2 text-sm sm:w-auto sm:text-base"
            >
              {loading ? "Loading..." : "Proceed to Payment"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full cursor-pointer rounded-md px-4 py-2 text-sm sm:w-auto sm:text-base"
          >
            {"Next"}
          </Button>
        </>
      )}
    </div>
  );
}

export default NavigationButtons;

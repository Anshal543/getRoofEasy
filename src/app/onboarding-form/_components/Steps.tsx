type Props = {
  step: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isFormValid: boolean;
};

function Steps({ step, setCurrentStep, isFormValid }: Props) {
  const isStepClickable = (targetStep: number) => {
    return targetStep <= step || (targetStep === step + 1 && isFormValid);
  };

  const getSpanClass = (targetStep: number) =>
    [
      "ml-2 text-sm sm:text-base",
      "text-[var(--color-step-label-text)] dark:text-[var(--slate-primary)]",
      "transition-all duration-300 ease-in-out",
      "relative",
      "hidden sm:block",
      step == targetStep
        ? "font-semibold after:absolute after:left-0 after:-bottom-1 after:h-[4px] after:w-full after:bg-gradient-to-r after:from-blue-400 after:via-blue-500 after:to-cyan-400 after:rounded-full"
        : "hover:after:absolute hover:after:left-0 hover:after:-bottom-1 hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-300 hover:after:rounded-full hover:after:opacity-50",
    ].join(" ");

  return (
    <div className="mb-8 flex flex-row items-center justify-around px-4 sm:justify-between md:mt-5 md:px-10">
      {/* Step 1 */}
      <div
        className={`flex items-center ${
          isStepClickable(1)
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-[var(--color-step-disabled-opacity)]"
        }`}
        onClick={() => isStepClickable(1) && setCurrentStep(1)}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            step >= 1
              ? "bg-[var(--black)] text-[var(--white)] shadow-[var(--custom-shadow)]"
              : "border-2 border-[var(--blue-400)] bg-[var(--black)] text-[var(--black)] dark:text-[var(--white)]"
          }`}
        >
          1
        </div>
        <span className={getSpanClass(1)}>Customer Info</span>
      </div>

      {/* Connector - hidden on mobile */}
      <div className="mx-2 h-1 flex-1 bg-[var(--color-step-connector)] sm:flex" />

      {/* Step 2 */}
      <div
        className={`flex items-center ${
          isStepClickable(2)
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-[var(--color-step-disabled-opacity)]"
        }`}
        onClick={() => isStepClickable(2) && setCurrentStep(2)}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            step >= 2
              ? "bg-[var(--black)] text-[var(--white)] shadow-[var(--custom-shadow)]"
              : "border-2 border-[var(--blue-400)] bg-[var(--black)] text-[var(--white)] dark:text-[var(--white)]"
          }`}
        >
          2
        </div>
        <span className={getSpanClass(2)}>Site Info</span>
      </div>

      {/* Connector - hidden on mobile */}
      <div className="mx-2 h-1 flex-1 bg-[var(--color-step-connector)] sm:flex" />

      {/* Step 3 */}
      <div
        className={`flex items-center ${
          isStepClickable(3)
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-[var(--color-step-disabled-opacity)]"
        }`}
        onClick={() => isStepClickable(3) && setCurrentStep(3)}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            step >= 3
              ? "bg-[var(--black)] text-[var(--white)] shadow-[var(--custom-shadow)]"
              : "border-2 border-[var(--blue-400)] bg-[var(--black)] text-[var(--white)] dark:text-[var(--white)]"
          }`}
        >
          3
        </div>
        <span className={getSpanClass(3)}>Complete</span>
      </div>
    </div>
  );
}

export default Steps;

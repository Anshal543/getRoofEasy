"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Steps from "./Steps";
import NavigationButtons from "./navigation-buttons";

import OnboardingForm from "@/app/onboarding-form/_components/onboarding-form";
import {
  AuthUser,
  Customer,
  OnboardingForm as OnboardingFormType,
} from "@/lib/types";
import { useCustomerInfo } from "@/store/useCustomerInfo";
import { useOnBoardInfo } from "@/store/useOnBoardInfo";
import { api } from "@/utils/axios";
import { toast } from "sonner";
import ConfirmDetails from "./ConfirmDetails";
import CustomerForm from "./customer-form";

const TOTAL_STEPS = 3;
const STEP_COMPONENTS = {
  1: CustomerForm,
  2: OnboardingForm,
  3: null,
};

export default function MultiStepForm({ user }: { user: AuthUser }) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState<Customer>({
    name: "",
    email: "",
    company_name: "",
    company_website: "",
    webhook_url: "",
    inbound_phone: "",
    booking_link: "",
    sharing_preference: "",
    roof_materials: [],
    waste_factor: "",
    prices: {},
  });

  const [board, setBoard] = useState<OnboardingFormType>({
    site_name: "",
    snippets: [],
  });

  const { customer, setCustomer } = useCustomerInfo();
  const { onboard, setOnboard } = useOnBoardInfo();

  const transformCustomerData = (customer: Customer, userId: number) => {
    if (!customer || !userId) {
      throw new Error("Invalid customer data or user ID");
    }
    return {
      user: userId,
      waster_factor: customer.waste_factor
        ? parseFloat(customer.waste_factor) +
          parseFloat(customer.waste_factor) / 100
        : 0,
      shingle_low_cost_per_square: customer.prices?.shingle?.low || 0,
      shingle_high_cost_per_square: customer.prices?.shingle?.high || 0,
      metal_low_cost_per_square: customer.prices?.metal?.low || 0,
      metal_high_cost_per_square: customer.prices?.metal?.high || 0,
      tile_low_cost_per_square: customer.prices?.tile?.low || 0,
      tile_high_cost_per_square: customer.prices?.tile?.high || 0,
      cedar_low_cost_per_square: customer.prices?.cedar?.low || 0,
      cedar_high_cost_per_square: customer.prices?.cedar?.high || 0,
    };
  };

  const boardSubmit = async (customer: Customer) => {
    setLoading(true);
    try {
      if (user) {
        await api.post(`api/users/onboard/${user?.id}/`, customer);
        await api.post(
          `roofing-prices/create/`,
          transformCustomerData(customer, user.id),
        );

        toast("customer onboard successfully");
        router.push("/secure-payment");
      }
    } catch (error) {
      console.error("Board submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCustomer(data);
    } else if (currentStep === 2) {
      setOnboard(board!);
    }

    if (currentStep === TOTAL_STEPS) {
      if (customer) {
        boardSubmit(customer);
      } else {
        console.error("Customer data is null");
      }
    } else {
      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    }
  };

  useEffect(() => {
    setIsFormValid(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const CurrentStepComponent =
    STEP_COMPONENTS[currentStep as keyof typeof STEP_COMPONENTS];

  return (
    <div className={`mx-4 w-auto sm:mx-auto`}>
      <Steps
        step={currentStep}
        setCurrentStep={setCurrentStep}
        isFormValid={currentStep === 3 ? true : isFormValid}
      />
      <div className="dark:bg-background w-full rounded-lg bg-[var(--color-form-background)] p-8 shadow sm:p-6">
        {CurrentStepComponent ? (
          <div className="min-h-screen w-full">
            {currentStep == 1 ? (
              <CustomerForm
                onFormChange={(isValid: boolean) => setIsFormValid(isValid)}
                formData={data}
                setFormData={setData}
              />
            ) : (
              <>
                <OnboardingForm
                  onFormChange={(isValid: boolean) => setIsFormValid(isValid)}
                  formData={board}
                  setFormData={setBoard}
                />
              </>
            )}
          </div>
        ) : (
          <ConfirmDetails
            setCurrentStep={setCurrentStep}
            customer={customer!}
            onboard={onboard!}
          />
        )}

        <NavigationButtons
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleNext={handleNext}
          loading={loading}
          isFormValid={currentStep === 3 ? true : isFormValid}
        />
      </div>
    </div>
  );
}

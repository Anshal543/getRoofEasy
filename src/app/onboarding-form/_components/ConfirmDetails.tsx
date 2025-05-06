import { Customer, OnboardingForm } from "@/lib/types";
import React, { Dispatch, SetStateAction } from "react";

type ConfirmDetailsProps = {
  customer: Customer;
  onboard: OnboardingForm;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const ConfirmDetails: React.FC<ConfirmDetailsProps> = ({
  customer,
  onboard,
  setCurrentStep,
}) => {
  const formatPrice = (price: string) => {
    return price ? `$${parseFloat(price).toFixed(2)}` : "—";
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-3xl font-semibold text-[var(--gray-800)] dark:text-[var(--gray-100)]">
        Confirm Your Details
      </h1>

      <section className="">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium text-[var(--gray-700)] dark:text-[var(--gray-200)]">
            Customer Information
          </h2>
          <button
            onClick={() => setCurrentStep(1)}
            className="cursor-pointer text-sm text-[var(--blue-600)] hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-[var(--gray-300)] bg-[var(--white)] p-4 sm:grid-cols-2 dark:border-[var(--gray-700)] dark:bg-[var(--gray-900)]">
          <Info label="Full Name" value={customer.name} />
          <Info label="Email" value={customer.email} />
          <Info label="Company Name" value={customer.company_name} />
          <Info label="Company Website" value={customer.company_website} />
          <Info label="Webhook URL" value={customer.webhook_url} />
          <Info label="Inbound Phone" value={customer.inbound_phone} />
          <Info label="Booking Link" value={customer.booking_link} />
          <Info
            label="Sharing Preference"
            value={customer.sharing_preference}
          />
          <Info
            label="Roof Materials"
            value={customer.roof_materials?.join(", ") || "—"}
          />
          <Info
            label="Waste Factor"
            value={customer.waste_factor ? `${customer.waste_factor}%` : "—"}
          />

          {customer.roof_materials?.map((material) => (
            <React.Fragment key={material}>
              <Info
                label={`${material.charAt(0).toUpperCase() + material.slice(1)} Low Price`}
                value={formatPrice(customer.prices?.[material]?.low)}
              />
              <Info
                label={`${material.charAt(0).toUpperCase() + material.slice(1)} High Price`}
                value={formatPrice(customer.prices?.[material]?.high)}
              />
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium text-[var(--gray-700)] dark:text-[var(--gray-200)]">
            Onboarding Information
          </h2>
          <button
            onClick={() => setCurrentStep(2)}
            className="cursor-pointer text-sm text-[var(--blue-600)] hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2 rounded-xl border border-[var(--gray-300)] bg-[var(--white)] p-4 dark:border-[var(--gray-700)] dark:bg-[var(--gray-900)]">
          <Info label="Site Name" value={onboard.site_name} />
        </div>

        <div className="mt-6 space-y-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium text-[var(--gray-600)] dark:text-[var(--gray-300)]">
              Snippets
            </h3>
            <button
              onClick={() => setCurrentStep(2)}
              className="cursor-pointer text-sm text-[var(--blue-600)] hover:underline"
            >
              Edit
            </button>
          </div>
          {onboard.snippets.length === 0 ? (
            <p className="text-sm text-[var(--gray-500)]">No snippets added.</p>
          ) : (
            onboard.snippets.map((snippet, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-[var(--gray-300)] bg-[var(--white)] p-4 dark:border-[var(--gray-700)] dark:bg-[var(--gray-900)]"
              >
                <Info label="Snippet Title" value={snippet.snippet_title} />
                <Info label="Position" value={snippet.general_position} />
                <div>
                  <p className="text-sm font-medium text-[var(--gray-600)] dark:text-[var(--gray-400)]">
                    Code:
                  </p>
                  <pre className="rounded bg-[var(--gray-200)] p-3 text-sm whitespace-pre-wrap text-[var(--gray-800)] dark:bg-[var(--gray-700)] dark:text-[var(--gray-100)]">
                    {snippet.general_code}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-medium text-[var(--gray-600)] dark:text-[var(--gray-400)]">
      {label}
    </p>
    <p className="text-base text-[var(--gray-800)] dark:text-[var(--gray-100)]">
      {value || "—"}
    </p>
  </div>
);

export default ConfirmDetails;

"use client";

import { useCardElementOptions } from "@/hooks/use-card-element";
import { AuthUser } from "@/lib/types";
import { api } from "@/utils/axios";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const StripePaymentForm = ({ userId }: { userId: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      const res = await api.post(`api/users/intend-payment/${userId}/`, {
        amount: 999,
      });
      const { status, data: intent } = res;
      if (status !== 200 || !intent?.data) {
        throw new Error("Failed to create PaymentIntent");
      }

      const result = await stripe.confirmCardSetup(intent.data, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: name,
          },
        },
      });

      if (result.error) {
        throw result.error;
      }

      if (result.setupIntent?.status === "succeeded") {
        const paymentMethod = result.setupIntent.payment_method;
        const updatedPaymentMethod = await api.post(
          `api/users/update-payment-method/${userId}/`,
          {
            payment_method: paymentMethod,
          },
        );
        toast.success("Payment method added successfully!");
        setPaymentSuccess(true);
      } else {
        throw new Error("Payment failed");
      }

      setPaymentSuccess(true);
      router.push("/pay");
    } catch (err: any) {
      setPaymentError(err.message || "An error occurred");
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = useCardElementOptions();

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="mb-6">
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-[var(--gray-700)] dark:text-[var(--gray-300)]"
        >
          Cardholder Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-md border border-[var(--gray-300)] px-3 py-2 shadow-sm focus:ring-2 focus:ring-[var(--blue-500)] focus:outline-none dark:border-[var(--gray-600)] dark:bg-[var(--black)] dark:text-[var(--white)] dark:focus:ring-[var(--blue-400)]"
          required
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[var(--gray-700)] dark:text-[var(--gray-300)]">
          Card Details
        </label>
        <div className="min-h-10 rounded-md border border-[var(--gray-300)] bg-[var(--white)] p-3 transition-colors duration-200 ease-in-out dark:border-[var(--gray-600)] dark:bg-[var(--black)]">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {paymentError && (
        <div className="mb-4 rounded-md bg-[var(--red-100)] p-3 text-[var(--red-700)] dark:bg-[var(--red-900)] dark:text-[var(--red-100)]">
          {paymentError}
        </div>
      )}

      {paymentSuccess && (
        <div className="mb-4 rounded-md bg-[var(--green-100)] p-3 text-[var(--green-700)] dark:bg-[var(--green-900)] dark:text-[var(--green-100)]">
          Card Added Successfully!.
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-[var(--blue-600)] px-4 py-3 text-sm font-medium text-[var(--white)] shadow-sm hover:bg-[var(--blue-700)] focus:ring-2 focus:ring-[var(--blue-500)] focus:ring-offset-2 focus:outline-none dark:bg-[var(--blue-500)] dark:hover:bg-[var(--blue-600)] ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-3 -ml-1 h-5 w-5 animate-spin text-[var(--white)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          `Add Card`
        )}
      </button>
    </form>
  );
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string,
);

export default function PaymentFormWrapper({ user }: { user: AuthUser }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "setup",
        setupFutureUsage: "off_session",
        currency: "usd",
      }}
    >
      {user ? <StripePaymentForm userId={user.id} /> : <p>User not found.</p>}
    </Elements>
  );
}

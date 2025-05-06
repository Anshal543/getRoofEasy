import { authenticateUser } from "@/actions/user";
import { BackButton } from "@/components/BackButton";
import PaymentFormWrapper from "./_components/CheckoutForm";

export default async function PaymentPage() {
  const auth = await authenticateUser();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)] px-4 py-12 sm:px-6 lg:px-8 dark:bg-[var(--black)]">
      <div className="radial--blur pointer-events-none absolute inset-0 top-1/2 left-1/2 z-0 mx-10 h-4/6 w-3/6 -translate-x-1/2 -translate-y-1/2 transform rounded-[50%] opacity-40" />

      <div className="w-full max-w-lg">
        <div className="mb-8 space-y-4 text-center">
          <BackButton />
          <h1 className="text-3xl font-extrabold text-[var(--gray-900)] dark:text-[var(--white)]">
            Complete Your Purchase
          </h1>
        </div>

        <div className="rounded-lg border-2 border-[var(--white)] bg-[var(--white)] p-6 shadow dark:bg-[var(--black)]">
          <PaymentFormWrapper user={auth.data} />
        </div>

        <div className="mt-6 text-center text-sm text-[var(--gray-500)] dark:text-[var(--gray-400)]">
          <p>Your payment is secure and encrypted.</p>
        </div>
      </div>
    </div>
  );
}

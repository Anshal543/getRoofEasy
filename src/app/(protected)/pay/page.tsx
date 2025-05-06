"use client";

import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePaymentMethodButton() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-150px)] items-center justify-center py-6">
      <Button
        onClick={() => router.push("/secure-payment")}
        className="flex cursor-pointer items-center gap-2 px-6 py-3 text-base font-medium transition-colors"
        variant="outline"
      >
        <CreditCard size={18} />
        Change Payment Method
      </Button>
    </div>
  );
}

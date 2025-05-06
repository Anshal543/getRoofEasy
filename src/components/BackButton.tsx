"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <Button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 border border-[var(--gray-300)] bg-[var(--white)] px-4 py-2 text-sm font-medium text-[var(--gray-900)] hover:bg-[var(--gray-100)] dark:border-[var(--gray-700)] dark:bg-[var(--gray-900)] dark:text-[var(--gray-100)] dark:hover:bg-[var(--gray-800)]"
      >
        <ArrowLeft
          size={16}
          className="text-[var(--gray-700)] dark:text-[var(--gray-300)]"
        />
        Back
      </Button>
    </div>
  );
}

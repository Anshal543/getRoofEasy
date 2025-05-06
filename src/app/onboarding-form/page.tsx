"use client";

import { authenticateUser } from "@/actions/user";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import MultiStepForm from "./_components/multistep-form";

export default function OnBoardingFormPage() {
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const authResponse = await authenticateUser();
      if (authResponse.status === 200 && authResponse.data) {
        setUser(authResponse.data);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="relative">
      <div className="radial--blur pointer-events-none absolute inset-0 top-1/2 left-1/2 z-0 mx-10 h-4/6 w-3/6 -translate-x-1/2 -translate-y-1/2 transform rounded-[50%] opacity-40" />

      <div className="z-10 flex min-h-screen flex-col space-y-2">
        <div className="m-4 flex items-center justify-end">
          <div className="h-10 w-10">
            <UserButton
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
            />
          </div>
        </div>
        <div className="flex-1">
          <MultiStepForm user={user} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { AuthUser } from "@/lib/types";
import { useAuthInfo } from "@/store/useAuthInfo";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  userData: AuthUser;
};

const OnboardingHandler = ({ userData }: Props) => {
  const { setUser } = useAuthInfo();
  const router = useRouter();

  useEffect(() => {
    setUser(userData);
    router.push(`/onboarding-form`);
  }, [userData]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default OnboardingHandler;

"use client";

import { useAuthInfo } from "@/store/useAuthInfo";
import { api } from "@/utils/axios";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: clerkUser, isSignedIn } = useClerkUser();
  const { setUser } = useAuthInfo();
  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn || !clerkUser.id) {
        setUser(null);
        return;
      }
      try {
        const res = await api.get(
          `api/users/${clerkUser.emailAddresses[0].emailAddress}/`,
        );
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user from backend", error);
      }
    };

    fetchUser();
  }, [isSignedIn, clerkUser?.id]);

  return <>{children}</>;
}

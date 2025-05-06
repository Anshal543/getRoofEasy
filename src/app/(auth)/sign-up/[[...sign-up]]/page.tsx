"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const Page = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="h-sc4 flex h-screen items-center justify-center">
      <SignUp
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};

export default Page;

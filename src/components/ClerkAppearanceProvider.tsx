"use client";

import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
// Removed invalid import for ClerkProviderProps

const clerkThemes = {
  light: neobrutalism,
  dark: dark,
};

export function ClerkAppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [appearance, setAppearance] = useState<{
    baseTheme: typeof dark | undefined;
  }>({
    baseTheme: undefined,
  });

  useEffect(() => {
    if (resolvedTheme) {
      setAppearance({
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      });
    }
  }, [resolvedTheme]);

  return <div>{children}</div>;
}

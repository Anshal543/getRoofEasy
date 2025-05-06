import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useCardElementOptions = () => {
  const { resolvedTheme } = useTheme();
  const [options, setOptions] = useState({});

  useEffect(() => {
    const isDark = resolvedTheme === "dark";

    setOptions({
      style: {
        base: {
          color: isDark ? "#fff" : "#1a202c",
          backgroundColor: isDark ? "" : "#fff",
          "::placeholder": {
            color: isDark ? "#aaa" : "#a0aec0",
          },
        },
        invalid: {
          color: "#e5424d",
        },
      },
    });
  }, [resolvedTheme]);

  return options;
};

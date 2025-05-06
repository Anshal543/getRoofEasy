"use client";
import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SidebarContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeItem: string;
  setActiveItem: (id: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const segment = pathname.split("/").pop();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>(segment || "");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const newSegment = pathname.split("/").pop() || "";
    setActiveItem(newSegment);
  }, [pathname]);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

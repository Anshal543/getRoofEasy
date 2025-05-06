"use client";
import { useSidebar } from "@/context/Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";

const Header = ({ children }: { children: React.ReactNode }) => {
  const { sidebarOpen } = useSidebar();
  return (
    <header
      className={`${
        sidebarOpen ? "md:ml-70" : "ml-0 md:ml-16"
      } relative flex items-center p-4 transition-all duration-300 ease-in-out`}
    >
      <div>
        <SidebarToggleButton />
      </div>
      {children}
    </header>
  );
};

export default Header;

"use client";
import { useSidebar } from "@/context/Sidebar";
import { RxHamburgerMenu } from "react-icons/rx";

const SidebarToggleButton = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <button
      className={`${
        sidebarOpen ? "" : "ml-2 md:ml-[30px]"
      } dark:bg-background dark:border-input border-input flex h-11 w-11 cursor-pointer items-center justify-center rounded-[8px] border text-[var(--sidebar-toggle-icon)] transition-all duration-300 ease-in-out hover:bg-[var(--sidebar-toggle-background-hover)] dark:text-[var(--white)] dark:hover:opacity-55`}
      onClick={toggleSidebar}
    >
      <RxHamburgerMenu />
    </button>
  );
};

export default SidebarToggleButton;

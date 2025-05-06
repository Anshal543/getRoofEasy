"use client";
import { useSidebar } from "@/context/Sidebar";
import { sidebarVariants, textVariants } from "@/utils/helper";
import { motion } from "framer-motion";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import CustomerIcon from "./CustomerIcon";
import DashboardIcon from "./DasboardIcon";
import PaymentsIcon from "./PaymentsIcon";

function Sidebar() {
  const { sidebarOpen, activeItem, setActiveItem, toggleSidebar } =
    useSidebar();
  const router = useRouter();

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },

    {
      id: "leads",
      label: "Leads",
      path: "/leads",
      icon: <CustomerIcon />,
    },
    {
      id: "pay",
      label: "Payments",
      path: "/pay",
      icon: <PaymentsIcon />,
    },
    {
      id: "roofing-prices",
      label: "Roofing Prices",
      path: "/roofing-prices",
      icon: <SquarePen />,
    },
  ];

  const handleItemClick = (id: any) => {
    setActiveItem(id);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <motion.div
        className="dark:bg-background fixed top-0 left-0 z-50 h-screen overflow-hidden bg-[var(--color-sidebar-background)] shadow-md md:hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
      >
        <div className="dark:bg-background flex items-center justify-between border-b border-[var(--color-sidebar-border)] px-4 py-4">
          <div
            className="cursor-pointer overflow-hidden rounded-full"
            onClick={() => router.push("/dashboard")}
          >
            <Image src="/logo.png" alt="" width={48} height={48} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            className="dark:bg-background flex items-center rounded-md p-2"
          >
            <IoClose className="dark:bg-background" />
          </button>
        </div>

        <nav className="mt-2">
          <ul>
            {sidebarItems.map((item) => (
              <Link
                href={item.path}
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="block cursor-pointer"
              >
                <li
                  className={`relative mb-1 flex cursor-pointer items-center px-4 py-3 ${
                    activeItem === item.id
                      ? "text-sidebar-title"
                      : "text-[var(--color-sidebar-title-inactive)]"
                  }`}
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="ml-3 whitespace-nowrap">{item.label}</div>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </motion.div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={toggleSidebar} />
      )}

      <motion.div
        className={`dark:bg-background fixed top-0 left-0 hidden h-screen bg-[var(--color-sidebar-background)] md:block ${
          sidebarOpen
            ? "bg-[var(--color-sidebar-background)] shadow-md"
            : "border-none shadow-md"
        }`}
        variants={sidebarVariants}
        initial="closedDesktop"
        animate={sidebarOpen ? "openDesktop" : "closedDesktop"}
      >
        <div className="flex items-center px-4 py-4">
          <h1 className="text-sidebar-title truncate text-xl font-bold">
            {sidebarOpen ? (
              <div className="flex items-center gap-4">
                <div
                  className="cursor-pointer overflow-hidden rounded-full"
                  onClick={() => router.push("/dashboard")}
                >
                  <Image src="/logo.png" alt="" width={64} height={64} />
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer overflow-hidden rounded-full"
                onClick={() => router.push("/dashboard")}
              >
                <Image src="/logo.png" alt="" width={48} height={48} />
              </div>
            )}
          </h1>
        </div>

        <nav className="mt-2">
          <ul>
            {sidebarItems.map((item) => (
              <Link
                href={item.path}
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="ml-2 block cursor-pointer"
              >
                <li
                  className={`relative mb-1 flex cursor-pointer items-center px-4 py-3 ${
                    activeItem === item.id
                      ? "text-sidebar-title"
                      : "text-[var(--color-sidebar-title-inactive)]"
                  }`}
                  title={!sidebarOpen ? item.label : ""}
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                    {item.icon}
                  </div>
                  <motion.div
                    className="ml-3 overflow-hidden whitespace-nowrap"
                    variants={textVariants}
                    initial="closed"
                    animate={sidebarOpen ? "open" : "closed"}
                  >
                    {item.label}
                  </motion.div>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </motion.div>
    </>
  );
}

export default Sidebar;

"use client";

import { useSidebar } from "@/context/Sidebar";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useBreadcrumbs } from "./useBreadcrumbs";

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  const { sidebarOpen } = useSidebar();

  return (
    <div
      className={clsx(
        "mx-auto my-6 px-6 transition-all md:px-4 lg:px-4",
        sidebarOpen
          ? "max-w-4xl md:ml-64 lg:ml-64 lg:px-7"
          : "max-w-5xl md:ml-24",
      )}
    >
      <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div className="flex items-center" key={crumb.href}>
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
            <Link
              href={crumb.href}
              className={clsx(
                "hover:text-primary transition-colors",
                crumb.isActive && "text-primary font-medium",
              )}
            >
              {crumb.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;

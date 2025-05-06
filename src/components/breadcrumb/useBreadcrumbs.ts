"use client";

import { usePathname } from "next/navigation";

export type Breadcrumb = {
  label: string;
  href: string;
  isActive: boolean;
};

const customBreadcrumbs: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  create: "Create Lead",
  edit: "Update Lead",
  users: "Users",
  update: "Update User",
};

export const useBreadcrumbs = (): Breadcrumb[] => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && segments[0] === "dashboard") {
    return [
      {
        label: "Dashboard",
        href: "/dashboard",
        isActive: true,
      },
    ];
  }

  const breadcrumbs: Breadcrumb[] = [];
  let href = "";

  segments.forEach((segment, index) => {
    href += `/${segment}`;
    const isLast = index === segments.length - 1;

    if (!isNaN(Number(segment))) {
      const parentSegment = segments[index - 1];
      if (parentSegment === "leads") {
        breadcrumbs.push({
          label: "Update Lead",
          href,
          isActive: isLast,
        });
      }
      return;
    }

    const label =
      customBreadcrumbs[segment.toLowerCase()] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    breadcrumbs.push({
      label,
      href,
      isActive: isLast,
    });
  });

  return [
    {
      label: "Dashboard",
      href: "/dashboard",
      isActive: false,
    },
    ...breadcrumbs,
  ];
};

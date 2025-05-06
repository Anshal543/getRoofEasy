"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/data-service";
import { ApiResponse, Lead } from "@/lib/types";
import { useSearchInfo } from "@/store/useSearch";
import { api } from "@/utils/axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import ConfirmModal from "../ConfirmModal";
import NoLeads from "../NoLeadsFound";
import { Button } from "../ui/button";
import { Pagination } from "./pagination";

type DataTableProps = {
  bulkDeleteMode: boolean;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  initialData: ApiResponse<Lead>;
  initialPage: number;
  initialPageSize: number;
  initialQuery?: string;
  initialSortOrder?: string;
};

export function DataTable({
  bulkDeleteMode,
  selectedIds,
  setSelectedIds,
  initialData,
  initialPage,
  initialPageSize,
  initialQuery = "",
}: DataTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchInfo();
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [deleting, setDeleting] = useState(false);
  const [mainText, setMainText] = useState<{
    first_name: string;
    last_name: string;
    id?: number;
  }>({
    first_name: "",
    last_name: "",
    id: 0,
  });

  const checkboxVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: [0, -5, -10],
      transition: {
        duration: 0.3,

        delay: 0.1,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "desc",
  });

  const pathname = usePathname();

  const data = initialData.results;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchQuery) {
      params.set("query", debouncedSearchQuery);
      params.set("page", "1");
    } else {
      params.delete("query");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearchQuery, pathname, router, searchParams]);

  const updateSearchParams = (
    newParams: Record<string, string>,
    defaults: { page: number; pageSize: number },
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (
        value &&
        ((key === "page" && value !== defaults.page.toString()) ||
          (key === "page_size" && value !== defaults.pageSize.toString()) ||
          (key !== "page" && key !== "page_size"))
      ) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`leads/delete/${mainText.id}/`);
      router.replace(
        `/leads?page=${initialPage}&page_size=$${initialPageSize}`,
      );

      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    updateSearchParams(
      {
        page: page.toString(),
        query: initialQuery,
        bulkDelete: bulkDeleteMode ? "true" : "",
      },
      { page: 1, pageSize: initialPageSize },
    );
  };

  const handlePageSizeChange = (page_size: number) => {
    updateSearchParams(
      {
        page: initialPage.toString(),
        page_size: page_size.toString(),
        query: initialQuery,
        bulkDelete: bulkDeleteMode ? "true" : "",
      },
      { page: 1, pageSize: 5 },
    );
  };

  const columns = [
    { key: "Name" as keyof Lead, label: "Name", sortable: true },
    { key: "email" as keyof Lead, label: "Email", sortable: true },
    { key: "estimated" as keyof Lead, label: "Estimated", sortable: true },
    { key: "Address" as keyof Lead, label: "Address", sortable: true },
    {
      key: "created_at" as keyof Lead,
      label: "Created At",
      sortable: true,
    },
    { key: "actions" as keyof Lead, label: "Actions", sortable: false },
  ];

  const handleSort = (key: keyof Lead) => {
    if (!key) return;

    let newDirection: "asc" | "desc" | null = null;
    if (sortConfig.key === key) {
      newDirection =
        sortConfig.direction === "asc"
          ? "desc"
          : sortConfig.direction === "desc"
            ? null
            : "asc";
    } else {
      newDirection = "asc";
    }

    setSortConfig(
      newDirection
        ? { key, direction: newDirection }
        : { key: null, direction: "asc" },
    );

    if (newDirection) {
      updateSearchParams(
        {
          page: "1",
          page_size: initialPageSize.toString(),
          query: initialQuery,
          sort_order: newDirection,
        },
        { page: 1, pageSize: initialPageSize },
      );
    } else {
      updateSearchParams(
        {
          page: "1",
          page_size: initialPageSize.toString(),
          query: initialQuery,
        },
        { page: 1, pageSize: initialPageSize },
      );
    }
  };

  const renderSortIndicator = (key: keyof Lead) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }

    return (
      <div className="ml-1 flex items-center">
        {sortConfig.direction === "asc" ? (
          <ArrowUp className="text-primary h-4 w-4" />
        ) : (
          <ArrowDown className="text-primary h-4 w-4" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="table-container relative overflow-hidden will-change-transform">
        <div className="overflow-x-auto">
          <table className="divide-border w-full divide-y">
            <thead>
              <motion.tr>
                <AnimatePresence mode="popLayout">
                  {bulkDeleteMode && data.length > 0 && (
                    <motion.th
                      key="header-checkbox"
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: [0, -5, -10] }}
                      variants={checkboxVariants}
                      className="table-header px-6 py-3 text-left will-change-transform"
                    >
                      <Checkbox
                        checked={
                          selectedIds.length === data.length && data.length > 0
                        }
                        onCheckedChange={(checked) => {
                          setSelectedIds(
                            checked ? data.map((row) => row.id) : [],
                          );
                        }}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </motion.th>
                  )}
                </AnimatePresence>

                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="table-header px-6 py-3 text-left"
                  >
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="group flex items-center space-x-1 focus:outline-none"
                      >
                        <span>{column.label}</span>
                        {renderSortIndicator(column.key)}
                      </button>
                    ) : (
                      <span className="capitalize">{column.label}</span>
                    )}
                  </th>
                ))}
              </motion.tr>
            </thead>

            <tbody className="divide-border divide-y will-change-transform">
              {data.length > 0 ? (
                data.map((row) => (
                  <motion.tr
                    key={row.id}
                    className="hover:bg-muted/30 table-row h-12 transition-colors duration-150 will-change-transform"
                    onClick={() => {
                      if (bulkDeleteMode) {
                        setSelectedIds((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((id) => id !== row.id)
                            : [...prev, row.id],
                        );
                      } else {
                        router.push(`/leads/${row.id}`);
                      }
                    }}
                  >
                    <AnimatePresence mode="popLayout">
                      {bulkDeleteMode && (
                        <motion.td
                          key={`checkbox-${row.id}`}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: [0, -5, -10] }}
                          variants={checkboxVariants}
                          className="table-cell px-6 py-3 will-change-transform"
                        >
                          <Checkbox
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={(checked) => {
                              setSelectedIds((prev) =>
                                checked
                                  ? [...prev, row.id]
                                  : prev.filter((id) => id !== row.id),
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 cursor-pointer"
                          />
                        </motion.td>
                      )}
                    </AnimatePresence>

                    <td className="table-cell">
                      {row.first_name} {row.last_name}
                    </td>
                    <td className="table-cell">
                      <span className="text-primary hover:underline">
                        {row.email}
                      </span>
                    </td>
                    <td className="table-cell">
                      {row.shingle_roof_cost_low} - {row.shingle_roof_cost_high}
                    </td>
                    <td className="table-cell">{row.address}</td>
                    <td className="table-cell">{formatDate(row.created_at)}</td>
                    <td
                      className="table-cell gap-3 pr-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-3">
                        <span
                          onClick={() => {
                            setMainText({
                              first_name: row.first_name,
                              last_name: row.last_name,
                              id: row.id,
                            });
                            setOpenDialog(true);
                          }}
                        >
                          <Trash2 className="h-5 w-5 cursor-pointer text-[var(--red-600)] hover:text-[var(--red-800)]" />
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (bulkDeleteMode ? 1 : 0)}
                    className="px-6 py-10 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      {initialQuery ? (
                        <>
                          <Search className="text-muted-foreground h-10 w-10" />
                          <p className="text-muted-foreground text-lg font-medium">
                            No leads found matching "{initialQuery}"
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Try a different search term
                          </p>
                          <Button
                            variant="ghost"
                            className="mt-2 cursor-pointer"
                            onClick={() => {
                              setSearchQuery("");
                              updateSearchParams(
                                { query: "", page: "1" },
                                { page: 1, pageSize: initialPageSize },
                              );
                            }}
                          >
                            Clear search
                          </Button>
                        </>
                      ) : (
                        <>
                          <NoLeads />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="from-background absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t to-transparent opacity-30 will-change-transform" />
      </div>

      <Pagination
        currentPage={initialPage}
        pageSize={initialPageSize}
        totalItems={initialData.count}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <ConfirmModal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        mainText={mainText}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}

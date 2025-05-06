"use client";
import ConfirmModal from "@/components/ConfirmModal";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/Sidebar";
import { ApiResponse, Lead } from "@/lib/types";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type LeadsClientProps = {
  initialData: ApiResponse<Lead>;
  initialPage: number;
  initialPageSize: number;
  initialQuery?: string;
  initialSortOrder?: string;
};

export default function LeadsClient({
  initialData,
  initialPage,
  initialPageSize,
  initialQuery = "",
}: LeadsClientProps) {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("No leads selected");
      return;
    }

    setBulkDeleting(true);
    try {
      await api.post("leads/bulk-delete/", { ids: selectedIds });
      toast.success(`Deleted ${selectedIds.length} leads`);
      setSelectedIds([]);
      setBulkDeleteMode(false);
      setShowBulkDeleteConfirm(false);
      router.push("/leads");
    } catch (error) {
      toast.error("Failed to delete selected items.");
    } finally {
      setShowBulkDeleteConfirm(false);
      setBulkDeleting(false);
    }
  };

  return (
    <div className="bg-background max-h-screen max-w-screen px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={`mx-auto transition-all ${
          sidebarOpen
            ? "max-w-4xl md:ml-64 lg:ml-64 lg:max-w-5xl xl:max-w-screen"
            : "max-w-screen md:ml-20"
        }`}
      >
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-foreground text-3xl font-bold">Leads</h1>
            <div className="flex flex-wrap gap-4">
              <Button
                className="cursor-pointer"
                onClick={() => router.push("/leads/create")}
              >
                Create
              </Button>
              <Button
                variant="secondary"
                className={` ${initialData.count === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={initialData.count === 0}
                onClick={() => setBulkDeleteMode((prev) => !prev)}
              >
                {bulkDeleteMode ? "Cancel" : "Select"}
              </Button>
              {bulkDeleteMode && selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  loading={bulkDeleting}
                  className="cursor-pointer"
                >
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="glow-effect">
          <DataTable
            bulkDeleteMode={bulkDeleteMode}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            initialData={initialData}
            initialPage={initialPage}
            initialPageSize={initialPageSize}
            initialQuery={initialQuery}
          />
        </div>

        <ConfirmModal
          isOpen={showBulkDeleteConfirm}
          onClose={() => setShowBulkDeleteConfirm(false)}
          mainText={{
            first_name: "Delete",
            last_name: `${selectedIds.length} selected leads`,
            requireTextConfirmation: false,
          }}
          onConfirm={handleBulkDelete}
          isLoading={bulkDeleting}
          description={`This action cannot be undone. This will permanently delete ${selectedIds.length} selected leads.`}
        />
      </div>
    </div>
  );
}

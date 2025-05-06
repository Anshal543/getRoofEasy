"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Lead } from "@/lib/types";
import { api } from "@/utils/axios";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

type Props = {
  row: Lead;
  setData: React.Dispatch<React.SetStateAction<Lead[]>>;
};

export default function DeleteDropdownWithDialog({ row, setData }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fullName = `${row.first_name} ${row.last_name}`;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`leads/delete/${row.id}/`);
      setData((prev) => prev.filter((item) => item.id !== row.id));
      setOpenDialog(false);
      setConfirmName("");
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-[var(--red-600)]"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              To delete <strong>{fullName}</strong>, type their full name below:
            </p>
            <Input
              placeholder="Full name"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setOpenDialog(false);
                setConfirmName("");
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={deleting || confirmName !== fullName}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

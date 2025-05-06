"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mainText: {
    first_name: string;
    last_name: string;
    id?: number;
    requireTextConfirmation?: boolean;
  };
  onConfirm: () => Promise<void> | void;
  description?: string;
  isLoading?: boolean;
};

const ConfirmModal = ({
  isOpen,
  onClose,
  mainText,
  onConfirm,
  description,
  isLoading = false,
}: ConfirmModalProps) => {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const check = `${mainText.first_name} ${mainText.last_name}`;
  const requireTextConfirmation = mainText.requireTextConfirmation ?? true;

  useEffect(() => {
    if (!isOpen) {
      setInputText("");
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (requireTextConfirmation && inputText.trim() !== check) {
      setError("Text must exactly match.");
      return;
    }

    try {
      await onConfirm();
      setInputText("");
      setError(null);
    } catch (err) {
      setError("Failed to delete. Please try again.");
    }
  };

  const isConfirmDisabled = requireTextConfirmation
    ? inputText.trim() !== check || isLoading
    : isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            {description || `Are you sure you want to delete this lead?`}
          </p>

          {requireTextConfirmation && (
            <div className="space-y-2">
              <p>
                To confirm, type{" "}
                <strong className="font-semibold">{check}</strong> below:
              </p>
              <Input
                placeholder="Type the full name"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setError(null);
                }}
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setInputText("");
            }}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;

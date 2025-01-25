"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { Span } from "next/dist/trace";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface DeleteDoctorDialogProps {
  doctor: Doctor | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteDoctorDialog({
  doctor,
  onOpenChange,
  onSuccess,
}: DeleteDoctorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!doctor) return;

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/doctors/${doctor.id}`);

      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!doctor} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Doctor</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {!doctor?.name.includes("Dr.") && <span>Dr.</span>}{" "}
            <span className="font-semibold underline">{doctor?.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Doctor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

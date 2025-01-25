"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";

interface Appointment {
  id: number;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
  };
  appointmentDate: string;
  appointmentTime: string;
}

interface CancelAppointmentDialogProps {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CancelAppointmentDialog({
  appointment,
  onOpenChange,
  onSuccess,
}: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    setIsLoading(true);
    try {
      await axiosInstance.put(`/api/appointments/${appointment.id}/cancel`, {
        reason,
      });

      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });

      onSuccess();
      setReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!appointment} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
        </DialogHeader>
        {appointment && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm">
                <p>
                  <span className="font-medium">Patient:</span>{" "}
                  {appointment.patient.name}
                </p>
                <p>
                  <span className="font-medium">Doctor:</span>{" "}
                  {appointment.doctor.name}
                </p>
                <p>
                  <span className="font-medium">Date & Time:</span>{" "}
                  {new Date(appointment.appointmentDate).toLocaleDateString()}{" "}
                  {appointment.appointmentTime}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Cancellation</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
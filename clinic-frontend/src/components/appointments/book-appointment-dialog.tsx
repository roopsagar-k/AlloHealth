"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Patient {
  id: number;
  name: string;
}

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BookAppointmentDialog({
  open,
  onOpenChange,
  onSuccess,
}: BookAppointmentDialogProps) {
  const [date, setDate] = useState<Date>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch doctors and patients when dialog opens
  const fetchData = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        axiosInstance.get("/api/doctors"),
        axiosInstance.get("/api/patients"),
      ]);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
      console.log("data fetch for doctors and patients")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors and patients",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/api/appointments", {
        ...formData,  
        appointmentDate: format(date, "yyyy-MM-dd"),
      });

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      onSuccess();
      setFormData({
        patientId: "",
        doctorId: "",
        appointmentTime: "",
      });
      setDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, patientId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={String(patient.id)}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, doctorId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={String(doctor.id)}>
                    {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select
              value={formData.appointmentTime}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, appointmentTime: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "09:00 AM",
                  "09:30 AM",
                  "10:00 AM",
                  "10:30 AM",
                  "11:00 AM",
                  "11:30 AM",
                  "02:00 PM",
                  "02:30 PM",
                  "03:00 PM",
                  "03:30 PM",
                  "04:00 PM",
                  "04:30 PM",
                ].map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
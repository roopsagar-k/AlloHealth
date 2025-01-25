"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { Calendar, RefreshCw, Plus } from "lucide-react";
import { format } from "date-fns";
import { BookAppointmentDialog } from "@/components/appointments/book-appointment-dialog";
import { CancelAppointmentDialog } from "@/components/appointments/cancel-appointment-dialog";

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: "booked" | "completed" | "canceled";
  patient: {
    name: string;
    contactNumber: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      booked: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleCancelSuccess = () => {
    fetchAppointments();
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={fetchAppointments}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsBookingOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(new Date(appointment.appointmentDate), "MMM d, yyyy")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {appointment.appointmentTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{appointment.patient.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {appointment.patient.contactNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{appointment.doctor.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {appointment.doctor.specialization}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {appointment.status === "booked" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BookAppointmentDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        onSuccess={() => {
          fetchAppointments();
          setIsBookingOpen(false);
        }}
      />

      <CancelAppointmentDialog
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}
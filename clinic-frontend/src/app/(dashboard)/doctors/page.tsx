"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UserPlus, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { AddEditDoctorDialog } from "@/components/doctors/add-edit-doctor-dialog";
import { DeleteDoctorDialog } from "@/components/doctors/delete-doctor-dialog";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  availability: string;
  location: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("/api/doctors");
      setDoctors(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSuccess = () => {
    fetchDoctors();
    setSelectedDoctor(null);
    setIsAddEditOpen(false);
  };

  const handleDeleteSuccess = () => {
    fetchDoctors();
    setDoctorToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doctors</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchDoctors} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setSelectedDoctor(null);
              setIsAddEditOpen(true);
            }}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{doctor.availability}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{doctor.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setIsAddEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDoctorToDelete(doctor)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {doctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No doctors found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddEditDoctorDialog
        open={isAddEditOpen}
        onOpenChange={setIsAddEditOpen}
        doctor={selectedDoctor}
        onSuccess={handleSuccess}
      />

      <DeleteDoctorDialog
        doctor={doctorToDelete}
        onOpenChange={(open) => !open && setDoctorToDelete(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

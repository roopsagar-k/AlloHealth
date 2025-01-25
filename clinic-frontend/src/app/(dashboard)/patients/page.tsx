"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { PatientDialog } from "@/components/patients/patient-dialog";
import axiosInstance from "@/lib/axiosInstance";

interface Patient {
  id: number;
  name: string;
  gender: string;
  contactNumber: string;
  email: string;
  dob: string;
  patientType: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      const { data } = await axiosInstance.get("/api/patients");
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch patients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/patients/${id}`);
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      fetchPatients();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Patient Management
        </h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card className="bg-muted/40" key={patient.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {patient.email}
                  </p>
                </div>
                <Badge
                  variant={
                    patient.patientType === "Inpatient"
                      ? "destructive"
                      : "default"
                  }
                >
                  {patient.patientType}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Gender:</span> {patient.gender}
                </p>
                <p>
                  <span className="font-medium">Contact:</span>{" "}
                  {patient.contactNumber}
                </p>
                <p>
                  <span className="font-medium">DOB:</span>{" "}
                  {format(new Date(patient.dob), "PP")}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(patient)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(patient.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No patients found.</p>
        </div>
      )}

      <PatientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          fetchPatients();
          setIsDialogOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
    </div>
  );
}

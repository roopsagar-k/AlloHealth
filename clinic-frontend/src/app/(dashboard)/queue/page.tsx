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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { UserPlus, RefreshCw } from "lucide-react";
import { AddPatientDialog } from "@/components/queue/add-patient-dialog";

interface Patient {
  id: number;
  name: string;
  gender: string;
  contactNumber: string;
  email: string;
}

interface QueueEntry {
  id: number;
  patient: Patient;
  queueNumber: number;
  status: "waiting" | "with-doctor" | "completed";
}

export default function QueuePage() {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchQueue = async () => {
    try {
      const response = await axiosInstance.get("/api/queue");
      setQueueEntries(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch queue entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleStatusChange = async (queueId: number, newStatus: string) => {
    try {
      await axiosInstance.put(`/api/queue/update/${queueId}`, {
        status: newStatus,
      });
      
      toast({
        title: "Success",
        description: "Queue status updated successfully",
      });
      
      fetchQueue(); // Refresh the queue
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update queue status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      waiting: "bg-yellow-100 text-yellow-800",
      "with-doctor": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Queue Management</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={fetchQueue}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add to Queue
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
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
                  <TableHead>Queue #</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.queueNumber}
                    </TableCell>
                    <TableCell>{entry.patient.name}</TableCell>
                    <TableCell>{entry.patient.contactNumber}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(entry.status)}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={entry.status}
                        onValueChange={(value) => handleStatusChange(entry.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waiting">Waiting</SelectItem>
                          <SelectItem value="with-doctor">With Doctor</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {queueEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No patients in queue
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddPatientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          fetchQueue();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
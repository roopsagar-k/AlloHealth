"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axiosInstance"

interface Doctor {
  id: number
  name: string
  specialization: string
  availability: string
  location: string
}

interface AddEditDoctorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: Doctor | null
  onSuccess: () => void
}

const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Pediatrics",
  "Psychiatry",
  "Orthopedics",
  "General Medicine",
]

export function AddEditDoctorDialog({ open, onOpenChange, doctor, onSuccess }: AddEditDoctorDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    availability: "",
    location: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        availability: doctor.availability,
        location: doctor.location,
        specialization: doctor.specialization,
      })
    } else {
      setFormData({
        name: "",
        specialization: "",
        availability: "",
        location: "",
      })
    }
  }, [doctor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (doctor) {
        await axiosInstance.put(`/api/doctors/${doctor.id}`, formData)
        toast({
          title: "Success",
          description: "Doctor updated successfully",
        })
      } else {
          console.log("formData", formData)
        await axiosInstance.post("/api/doctors", formData)
        toast({
          title: "Success",
          description: "Doctor added successfully",
        })
      }

      onSuccess()
    } catch (error) {
        console.error("Failed to add the doctor", error)
      toast({
        title: "Error",
        description: doctor ? "Failed to update doctor" : "Failed to add doctor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <select
              id="specialization"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.specialization}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              required
            >
              <option value="">Select Specialization</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availability: e.target.value,
                }))
              }
              placeholder="e.g., 9 AM - 5 PM"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Loaction</Label>
            <Input
              id="location"
              type="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (doctor ? "Updating..." : "Adding...") : doctor ? "Update Doctor" : "Add Doctor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


import { Request, Response } from "express";
import { Patient } from "../entities/Patient";

// Get all patients
export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find();
    res.json(patients); // Send response
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients", error });
  }
};

// Get a single patient by ID
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findOneBy({ id: parseInt(req.params.id) });
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient", error });
  }
};

// Create a new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  const { name, gender, contactNumber, email, dob, patientType } = req.body;

  try {
    const patient = Patient.create({
      name,
      gender,
      contactNumber,
      email,
      dob,
      patientType,
    });
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to create patient", error });
  }
};

// Update a patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findOneBy({ id: parseInt(req.params.id) });
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    const updatedPatient = Object.assign(patient, req.body);
    await updatedPatient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Failed to update patient", error });
  }
};

// Delete a patient
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findOneBy({ id: parseInt(req.params.id) });
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    await patient.remove();
    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete patient", error });
  }
};

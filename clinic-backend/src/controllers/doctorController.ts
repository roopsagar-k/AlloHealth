import { Request, Response } from "express";
import * as DoctorService from "../services/doctorServices";
import { validateDoctor } from "../validators/doctorValidation";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await DoctorService.getDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error });
  }
};

export const createDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Creaet doctors");
    const { error } = validateDoctor(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const doctor = await DoctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Failed to create doctor", error });
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const doctorId = parseInt(req.params.id);
    const doctor = await DoctorService.updateDoctor(doctorId, req.body);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update doctor", error });
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const doctorId = parseInt(req.params.id);
    await DoctorService.deleteDoctor(doctorId);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete doctor", error });
  }
};

import express from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";

const patientRouter = express.Router();

patientRouter.get("/", getPatients);
patientRouter.get("/:id", getPatientById);
patientRouter.post("/", createPatient);
patientRouter.put("/:id", updatePatient);
patientRouter.delete("/:id", deletePatient);

export default patientRouter;

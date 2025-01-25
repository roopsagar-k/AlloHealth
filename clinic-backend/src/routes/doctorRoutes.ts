import express from "express";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController";

const doctorRouter = express.Router();

doctorRouter.get("/", getDoctors);
doctorRouter.post("/", createDoctor);
doctorRouter.put("/:id", updateDoctor);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;

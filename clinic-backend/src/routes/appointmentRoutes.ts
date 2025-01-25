// routes/appointment.routes.ts
import express from "express";
import {
    bookAppointment,
    getAppointments,
    updateAppointment,
    cancelAppointment,
    checkAvailability,
} from "../controllers/appointmentController";
import { validateAppointment } from "../validators/appointmentValidators";
import { validateRequest } from "../middlewares/validationMiddleware";

const appointmentRouter = express.Router();

appointmentRouter.post("/", validateRequest(validateAppointment), bookAppointment);
appointmentRouter.get("/", getAppointments);
appointmentRouter.put("/:id", updateAppointment);
appointmentRouter.put("/:id/cancel", cancelAppointment);
appointmentRouter.get("/availability", checkAvailability);

export default appointmentRouter;

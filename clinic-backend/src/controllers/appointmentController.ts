import { Request, Response } from "express";
import { appointmentService } from "../services/appointmentServices";
import { validationResult } from "express-validator";

// Book an Appointment
export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validation result check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error",
                errors: errors.array(),
            });
            return; // Exit after sending the response
        }

        // Proceed with booking the appointment
        const appointment = await appointmentService.bookAppointment(req.body);
        res.status(201).json({
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (error: any) {
        // Handle internal errors
        res.status(500).json({
            message: error.message || "An error occurred while booking the appointment.",
            error: error.stack || null,
        });
    }
};

// Get Appointments
export const getAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get appointments based on query
        const appointments = await appointmentService.getAppointments(req.query);
        res.status(200).json(appointments);
    } catch (error: any) {
        // Handle internal errors
        res.status(500).json({
            message: error.message || "An error occurred while fetching appointments.",
            error: error.stack || null,
        });
    }
};

// Update Appointment
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validation result check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error",
                errors: errors.array(),
            });
            return; // Exit after sending the response
        }

        // Proceed with updating the appointment
        const updatedAppointment = await appointmentService.updateAppointment(req.params.id, req.body);
        res.status(200).json({
            message: "Appointment updated successfully",
            updatedAppointment,
        });
    } catch (error: any) {
        // Handle internal errors
        res.status(500).json({
            message: error.message || "An error occurred while updating the appointment.",
            error: error.stack || null,
        });
    }
};

// Cancel Appointment
export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validation result check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation error",
                errors: errors.array(),
            });
            return; // Exit after sending the response
        }

        // Proceed with canceling the appointment
        const canceledAppointment = await appointmentService.cancelAppointment(req.params.id, req.body.reason);
        res.status(200).json({
            message: "Appointment canceled successfully",
            canceledAppointment,
        });
    } catch (error: any) {
        // Handle internal errors
        res.status(500).json({
            message: error.message || "An error occurred while canceling the appointment.",
            error: error.stack || null,
        });
    }
};

// Check Doctor Availability
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get doctor availability
        const availability = await appointmentService.checkAvailability(req.query);
        res.status(200).json(availability);
    } catch (error: any) {
        // Handle internal errors
        res.status(500).json({
            message: error.message || "An error occurred while checking doctor availability.",
            error: error.stack || null,
        });
    }
};

import Joi from "joi";

export const validateAppointment = Joi.object({
    doctorId: Joi.number().integer().required().messages({
        "number.base": "Doctor ID must be a number",
        "number.integer": "Doctor ID must be an integer",
        "any.required": "Doctor ID is required",
    }),
    patientId: Joi.number().integer().required().messages({
        "number.base": "Patient ID must be a number",
        "number.integer": "Patient ID must be an integer",
        "any.required": "Patient ID is required",
    }),
    appointmentDate: Joi.date().iso().required().messages({
        "date.base": "Appointment date must be a valid date",
        "date.format": "Appointment date must be in ISO 8601 format",
        "any.required": "Appointment date is required",
    }),
    appointmentTime: Joi.string().required().messages({
        "string.base": "Appointment time must be a string",
        "any.required": "Appointment time is required",
    }),
});

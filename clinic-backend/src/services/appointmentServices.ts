import { Appointment } from "../entities/Appointment";
import { Doctor } from "../entities/Doctor";
import { Patient } from "../entities/Patient";
import { FindOptionsWhere } from "typeorm";

class AppointmentService {
    async bookAppointment(data: {
        doctorId: number;
        patientId: number;
        appointmentDate: Date;
        appointmentTime: string;
    }) {
        const { doctorId, patientId, appointmentDate, appointmentTime } = data;

        console.log("appoitment date from front-end", appointmentDate)

        // Validate doctor and patient existence
        const doctor = await Doctor.findOneBy({ id: doctorId });
        const patient = await Patient.findOneBy({ id: patientId });

        if (!doctor) throw new Error("Doctor not found");
        if (!patient) throw new Error("Patient not found");

        // Check for overlapping appointments
        const overlappingAppointment = await Appointment.findOne({
            where: { doctor, appointmentDate, appointmentTime, status: "booked" },
        });

        if (overlappingAppointment) {
            throw new Error("Doctor is not available at the selected time");
        }

        // Create and save appointment
        const newAppointment = Appointment.create({ doctor, patient, appointmentDate, appointmentTime });
        return await newAppointment.save();
    }

    async getAppointments(query: any) {
        const { doctorId, patientId, status, date } = query;

        const where: FindOptionsWhere<Appointment> = {};
        if (doctorId) where.doctor = { id: parseInt(doctorId) };
        if (patientId) where.patient = { id: parseInt(patientId) };
        if (status) where.status = status;
        if (date) where.appointmentDate = date;

        return await Appointment.find({ where, relations: ["doctor", "patient"] });
    }

    async updateAppointment(id: string, data: any) {
        const appointment = await Appointment.findOneBy({ id: parseInt(id) });

        if (!appointment) throw new Error("Appointment not found");

        Object.assign(appointment, data);
        return await appointment.save();
    }

    async cancelAppointment(id: string, reason?: string) {
        const appointment = await Appointment.findOneBy({ id: parseInt(id) });

        if (!appointment || appointment.status === "canceled") {
            throw new Error("Appointment not found or already canceled");
        }

        appointment.status = "canceled";
        appointment.reason = reason || "No reason provided";

        return await appointment.save();
    }

    async checkAvailability(query: any) {
        const { doctorId, date, time } = query;

        const overlappingAppointment = await Appointment.findOne({
            where: { doctor: { id: parseInt(doctorId) }, appointmentDate: date, appointmentTime: time, status: "booked" },
        });

        return { available: !overlappingAppointment };
    }
}

export const appointmentService = new AppointmentService();

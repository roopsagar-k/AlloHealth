import { Request, Response } from "express";
import { Appointment } from "../entities/Appointment";
import { Patient } from "../entities/Patient";
import { Queue } from "../entities/Queue";
import { Between } from "typeorm";

export const fetchStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );
    const endOfDay = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + 1
      )
    );

    const appointmentsCount = await Appointment.count({
      where: {
        status: "booked", 
        appointmentDate: Between(startOfDay, endOfDay),
      },
    });

    console.log("appointment count", appointmentsCount);

    // Query the database for total completed appointments today
    const totalCompletedTodayCount = await Appointment.count({
      where: {
        status: "completed",
      },
    });

    // Query the database for total number of patients
    const totalPatientsCount = await Patient.count();

    // Query the database for total number of patients waiting in the queue
    const waitingPatientsCount = await Queue.count({
      where: {
        status: "waiting",
      },
    });

    res.status(200).json({
      todayAppointments: appointmentsCount,
      completedToday: totalCompletedTodayCount,
      totalPatients: totalPatientsCount,
      activeQueue: waitingPatientsCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

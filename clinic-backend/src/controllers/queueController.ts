import { Request, Response } from "express";
import { Queue } from "../entities/Queue";
import { Patient } from "../entities/Patient";

// Add a walk-in patient to the queue
export const addToQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.body;

    // Find the patient
    const patient = await Patient.findOne({ where: { id: patientId } });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    // Create a new queue entry for the patient
    const queueNumber = (await Queue.count()) + 1; // Increment queue number
    const queue = new Queue();
    queue.patient = patient;
    queue.queueNumber = queueNumber;
    queue.status = "waiting"; // Initial status is "waiting"

    await queue.save();

    res.status(201).json({ message: "Patient added to queue", queue });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "An error occurred while adding to the queue.",
    });
  }
};

// Update the status of a patient in the queue
export const updateQueueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    if (!["waiting", "with-doctor", "completed"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    // Ensure ID is a number
    const queueId = parseInt(id, 10);
    if (isNaN(queueId)) {
      res.status(400).json({ message: "Invalid queue ID" });
      return;
    }

    // Find the queue entry by ID
    const queue = await Queue.findOne({ where: { id: queueId } });

    if (!queue) {
      res.status(404).json({ message: "Queue entry not found" });
      return;
    }

    // Update the status of the queue entry
    queue.status = status;
    await queue.save();

    res.status(200).json({ message: "Queue status updated", queue });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || "An error occurred while updating the queue status.",
    });
  }
};
// Get the current queue
// Get the current queue
export const getQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all queue entries
    const queueList = await Queue.find({ relations: ["patient"] });

    res.status(200).json(queueList);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "An error occurred while fetching the queue.",
    });
  }
};

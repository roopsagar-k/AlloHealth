import express from 'express';
import { addToQueue, updateQueueStatus, getQueue } from '../controllers/queueController';

const queueRouter = express.Router();

// Add a walk-in patient to the queue
queueRouter.post('/add', addToQueue);

// Update the status of a patient in the queue (e.g., "waiting", "with-doctor", "completed")
queueRouter.put('/update/:id/', updateQueueStatus);

// Get the current queue
queueRouter.get('/', getQueue);

export default queueRouter;

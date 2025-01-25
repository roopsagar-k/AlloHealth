import express from 'express';
import { fetchStats } from '../controllers/statsContoller';

const statsRouter = express.Router();

statsRouter.get("/", fetchStats);

export default statsRouter;
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/authRoutes";
import doctorRouter from "./routes/doctorRoutes";
import patientRouter from "./routes/patientRouter";
import appointmentRouter from "./routes/appointmentRoutes";
import queueRouter from "./routes/queueRoutes";
import statsRouter from "./routes/statsRoutes";

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => console.error("Database connection error:", err));

app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/patients", patientRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/queue", queueRouter);
app.use("/api/stats", statsRouter);

app.get("/", (req, res) => {
  res.send("Front Desk System API is running.");
});

export default app;

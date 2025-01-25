import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import { Doctor } from "./Doctor";
import { Patient } from "./Patient";

@Entity()
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Doctor, (doctor) => doctor.id, { onDelete: "CASCADE" })
    doctor!: Doctor;

    @ManyToOne(() => Patient, (patient) => patient.id, { onDelete: "CASCADE" })
    patient!: Patient;

    @Column()
    appointmentDate!: Date;

    @Column()
    appointmentTime!: string; // e.g., "10:30 AM"

    @Column({ default: "booked" }) // "booked", "completed", or "canceled"
    status!: string;

    @Column({ nullable: true })
    reason!: string; // Reason for cancellation or rescheduling, if applicable

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

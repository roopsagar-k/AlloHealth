import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { Patient } from "./Patient";

@Entity()
export class Queue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Patient, (patient) => patient.id, { onDelete: "CASCADE" })
  patient!: Patient;

  @Column()
  queueNumber!: number;

  @Column({ default: "waiting" }) // "waiting", "with-doctor", "completed"
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

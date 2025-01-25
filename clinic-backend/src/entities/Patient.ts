import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  gender!: string;

  @Column()
  contactNumber!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  dob!: Date; // Date of Birth

  @Column({ default: "walk-in" }) // "walk-in" or "appointment"
  patientType!: string;
}

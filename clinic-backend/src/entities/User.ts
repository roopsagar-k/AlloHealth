import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "front-desk" }) // Default role is front-desk
  role!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column()
  username!: string; 
}

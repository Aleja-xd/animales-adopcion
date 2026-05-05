import { AdoptionRequestService } from '../adoption-request.service';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Animal } from '../../animals/entities/animal.entity';

export enum AdoptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('adoption_requests')
export class AdoptionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.AdoptionRequests, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Animal, (animal) => animal.adoptionRequests, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  animal: Animal;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({
    type: 'enum',
    enum: AdoptionStatus,
    default: AdoptionStatus.PENDING,
  })
  status: AdoptionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
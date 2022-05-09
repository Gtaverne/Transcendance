import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  //autoincrement
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  //Now let us check where is this used
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}

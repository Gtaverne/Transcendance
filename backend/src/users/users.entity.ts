import { BaseEntity } from '../../base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;
  @Column({ type: 'boolean', nullable: false })
  admin: boolean;
  @Column({ type: 'integer', nullable: false })
  lvl: number;
}

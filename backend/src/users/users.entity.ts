import { BaseEntity } from '../../base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;
  @Column({ type: 'varchar', length: 300, nullable: true })
  avatar: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;
  @Column({ type: 'boolean', default: false, nullable: true })
  doublefa: boolean;
  @Column({ type: 'integer', nullable: false })
  lvl: number;
  @Column({ type: 'int', nullable: true, array: true})
  friendsList: number[];
  @Column({ type: 'int', nullable: true, array: true})
  blockedUsers: number[];
}

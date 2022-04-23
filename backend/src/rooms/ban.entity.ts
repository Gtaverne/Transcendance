import { BaseEntity } from '../../base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { RoomsEntity } from './rooms.entity';
import { UsersEntity } from 'src/users/users.entity';

@Entity('ban')
export class BanEntity extends BaseEntity {
  @Column('timestamp')
  timestamp: Date;
  @ManyToOne(() => RoomsEntity, (rooms) => rooms.banList)
  baned: RoomsEntity;
  @OneToOne(() => UsersEntity)
  banedUser: UsersEntity;
}

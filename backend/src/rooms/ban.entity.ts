import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RoomsEntity } from './rooms.entity';
import { UsersEntity } from 'src/users/users.entity';
import { type } from 'os';

@Entity('ban')
export class BanEntity extends BaseEntity {
  @Column({type: 'timestamp'})
  timestamp: Date;

  @ManyToOne(() => RoomsEntity, (rooms) => rooms.banList)
  baned: RoomsEntity;
  @ManyToOne(() => UsersEntity, (user) => user.bannedInARoom)
  banedUser: UsersEntity;
}

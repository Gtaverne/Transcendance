import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RoomsEntity } from './rooms.entity';
import { UsersEntity } from 'src/users/users.entity';

@Entity('mute')
export class MuteEntity extends BaseEntity {
  @Column({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(() => RoomsEntity, (rooms) => rooms.muteList)
  muted: RoomsEntity;
  @ManyToOne(() => UsersEntity, (user) => user.mutedInARoom)
  mutedUser: UsersEntity;
}

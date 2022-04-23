import { BaseEntity } from '../../base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { RoomsEntity } from './rooms.entity';
import { UsersEntity } from 'src/users/users.entity';

@Entity('mute')
export class MuteEntity extends BaseEntity {
  @Column('timestamp')
  timestamp: Date;
  @ManyToOne(() => RoomsEntity, (rooms) => rooms.muteList)
  muted: RoomsEntity;
  @OneToOne(() => UsersEntity)
  @JoinColumn()
  mutedUser: UsersEntity;
}

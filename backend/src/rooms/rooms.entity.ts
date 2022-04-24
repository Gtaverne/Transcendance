import { BaseEntity } from '../../base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { MuteEntity } from './mute.entity';
import { MessagesEntity } from 'src/messages/messages.entity';
import { BanEntity } from './ban.entity';
import { UsersEntity } from 'src/users/users.entity';

@Entity('rooms')
export class RoomsEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  channelName: string;
  @Column({ type: 'varchar', length: 300, nullable: true })
  password: string;
  @Column({ type: 'varchar', length: 300, nullable: true })
  status: string;
  @Column({ type: 'boolean', default: true, nullable: true })
  isDm: boolean;
  @OneToMany(() => MuteEntity, (mute) => mute.muted)
  muteList: MuteEntity[];
  @OneToMany(() => BanEntity, (ban) => ban.baned)
  banList: BanEntity[];
  @OneToMany(() => MessagesEntity, messages => messages.room)
  messagesList: MessagesEntity[];
  @ManyToMany(() => UsersEntity, user => user.accessToList)
  accessList: UsersEntity[];
  @ManyToOne(() => UsersEntity, user => user.ownedRooms)
  owner: UsersEntity;
  @ManyToMany(() => UsersEntity, user => user.administratingRooms)
  @JoinTable()
  admins: UsersEntity[];
}

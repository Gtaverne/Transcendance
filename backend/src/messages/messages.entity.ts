import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';

@Entity('messages')
export class MessagesEntity extends BaseEntity {
  @Column({ type: 'text', default: '' })
  message: string;
  @ManyToOne(() => UsersEntity, (user) => user.messagesList)
  owner: UsersEntity;
  @ManyToOne(() => RoomsEntity, (room) => room.messagesList)
  room: RoomsEntity;
}

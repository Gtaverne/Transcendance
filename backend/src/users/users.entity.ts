import { BaseEntity } from '../../base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { GamesEntity } from 'src/games/games.entity';
import { MessagesEntity } from 'src/messages/messages.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';

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
  @Column({ type: 'integer', default: 0, nullable: false })
  lvl: number;

  @OneToMany(() => UsersEntity, (user) => user.followingMeList)
  iFollowList: UsersEntity[];

  @OneToMany(() => UsersEntity, (user) => user.iFollowList)
  @JoinTable()
  followingMeList: UsersEntity[];

  @OneToMany(() => UsersEntity, (user) => user.blockedMeList)
  iBlockedList: UsersEntity[];

  @OneToMany(() => UsersEntity, (user) => user.iBlockedList)
  @JoinTable()
  blockedMeList: UsersEntity[];

  @OneToMany(() => MessagesEntity, messages => messages.owner)
  messagesList: MessagesEntity[];

  @ManyToMany(() => RoomsEntity, room => room.accessList)
  @JoinTable()
  accessToList: RoomsEntity[];

  @OneToMany(() => GamesEntity, game => game.user1)
  gamePlayer1: GamesEntity[];

  @OneToMany(() => GamesEntity, game => game.user2)
  gamePlayer2: GamesEntity[];

  @OneToMany(() => RoomsEntity, room => room.owner)
  ownedRooms: RoomsEntity[];

  @ManyToMany(() => RoomsEntity, room => room.admins)
  administratingRooms: RoomsEntity[];
}

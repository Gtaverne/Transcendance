import { BaseEntity } from '../../base.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { GamesEntity } from 'src/games/games.entity';
import { MessagesEntity } from 'src/messages/messages.entity';
import { AchievementsEntity } from 'src/achievements/achievements.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { MuteEntity } from 'src/rooms/mute.entity';
import { BanEntity } from 'src/rooms/ban.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;
  @Column({ type: 'varchar', length: 300, nullable: true })
  avatar: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;
  @Column({ type: 'integer', default: 0, nullable: true })
  doublefa: number;
  @Column({ type: 'varchar', length: 150, nullable: true })
  secret: string;
  @Column({ type: 'integer', default: 0, nullable: false })
  lvl: number;

  //Penser à ajouter un default type
  @ManyToMany(() => UsersEntity, (user) => user.followingMeList)
  iFollowList: UsersEntity[];

  @ManyToMany(() => UsersEntity, (user) => user.iFollowList)
  @JoinTable()
  followingMeList: UsersEntity[];

  @ManyToMany(() => UsersEntity, (user) => user.blockedMeList)
  iBlockedList: UsersEntity[];

  @ManyToMany(() => UsersEntity, (user) => user.iBlockedList)
  @JoinTable()
  blockedMeList: UsersEntity[];


  @ManyToMany(() => AchievementsEntity, (achievements) => achievements.achievers)
  achievementsList: AchievementsEntity[];

  @OneToMany(() => MessagesEntity, (messages) => messages.owner)
  messagesList: MessagesEntity[];

  @ManyToMany(() => RoomsEntity, (room) => room.accessList)
  @JoinTable()
  accessToList: RoomsEntity[];

  @OneToMany(() => GamesEntity, (game) => game.user1)
  gamePlayer1: GamesEntity[];

  @OneToMany(() => GamesEntity, (game) => game.user2)
  gamePlayer2: GamesEntity[];

  @OneToMany(() => RoomsEntity, (room) => room.owner)
  ownedRooms: RoomsEntity[];

  @ManyToMany(() => RoomsEntity, (room) => room.admins)
  administratingRooms: RoomsEntity[];

  @OneToMany(() => MuteEntity, (mute) => mute.mutedUser)
  mutedInARoom: MuteEntity[];

  @OneToMany(() => BanEntity, (ban) => ban.banedUser)
  bannedInARoom: BanEntity[];
}

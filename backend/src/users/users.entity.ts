import { BaseEntity } from '../../base.entity';
import { Column, Entity, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { GamesEntity } from 'src/games/games.entity';
import { MessagesEntity } from 'src/messages/messages.entity';

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
}

import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { MuteEntity } from './mute.entity';
import { MessagesEntity } from 'src/messages/messages.entity';
import { BanEntity } from './ban.entity';

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
  //   @Column({ type: 'varchar', length: 150, nullable: true })
  //   email: string;
  //   @Column({ type: 'integer', default: 0, nullable: false })
  //   lvl: number;
  //   @Column({ type: 'int', default: [], nullable: true, array: true})
  //   friendsList: number[];
  //   @Column({ type: 'int', default: [], nullable: true, array: true})
  //   blockedUsers: number[];
  //   @OneToMany(type => GamesEntity, game => game.user1)
  //   games: GamesEntity[];
}

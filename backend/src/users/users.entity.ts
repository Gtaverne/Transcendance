import { BaseEntity } from '../../base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { GamesEntity } from 'src/games/games.entity';

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
  @Column({ type: 'int', default: [], nullable: true, array: true})
  friendsList: number[];
  @Column({ type: 'int', default: [], nullable: true, array: true})
  blockedUsers: number[];
//   @OneToMany(type => GamesEntity, game => game.user1)
//   games: GamesEntity[];
}

import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';

@Entity('games')
export class GamesEntity extends BaseEntity {
  @ManyToOne(() => UsersEntity, (user) => user.gamePlayer1)
  user1: UsersEntity;
  @ManyToOne(() => UsersEntity, (user) => user.gamePlayer2)
  user2: UsersEntity;
  @Column({ type: 'integer', nullable: false })
  score1: number;
  @Column({ type: 'integer', nullable: false })
  score2: number;
  @Column({ type: 'integer', nullable: false })
  levelA: number;
  @Column({ type: 'integer', nullable: false })
  levelB: number;
}

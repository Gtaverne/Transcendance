import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';

@Entity('games')
export class GamesEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  status: string;
  @ManyToOne(() => UsersEntity, user => user.gamePlayer1)
  user1: number;
  @ManyToOne(() => UsersEntity, user => user.gamePlayer2)
  user2: number;
  @Column({ type: 'integer', nullable: false })
  score1: number;
  @Column({ type: 'integer', nullable: false })
  score2: number;
}

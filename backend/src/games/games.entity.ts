import { BaseEntity } from '../../base.entity';
import { Column, Entity } from 'typeorm';

@Entity('games')
export class GamesEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  status: string;
  @Column({ type: 'integer', nullable: false })
  user1: number;
  @Column({ type: 'integer', nullable: false })
  user2: number;
  @Column({ type: 'integer', nullable: false })
  score1: number;
  @Column({ type: 'integer', nullable: false })
  score2: number;
}

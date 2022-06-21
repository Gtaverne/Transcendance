import { BaseEntity } from '../../base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';

@Entity('achievements')
export class AchievementsEntity extends BaseEntity {
  @Column({ type: 'text', default: '' })
  achievementName: string;
  @Column({ type: 'text', default: '' })
  achievemenDescription: string;
  @Column({ type: 'text', default: '' })
  achievementLogo: string;
  @ManyToMany(() => UsersEntity, (user) => user.achievementsList)
  @JoinTable()
  achievers: UsersEntity[];
}

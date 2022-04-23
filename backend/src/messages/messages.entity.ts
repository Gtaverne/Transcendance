import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';

@Entity('messages')
export class MessagesEntity extends BaseEntity {
	@Column({type: 'text', default: ""})
	message: string;
	@ManyToOne(() => UsersEntity, user => user.messagesList)
	owner: UsersEntity;
	@ManyToOne(() => RoomsEntity, room => room.messagesList)
	room: RoomsEntity;
//   @Column({ type: 'varchar', length: 100, nullable: false })
//   username: string;
//   @Column({ type: 'varchar', length: 300, nullable: true })
//   avatar: string;
//   @Column({ type: 'varchar', length: 150, nullable: true })
//   email: string;
//   @Column({ type: 'boolean', default: false, nullable: true })
//   doublefa: boolean;
//   @Column({ type: 'integer', default: 0, nullable: false })
//   lvl: number;
//   @Column({ type: 'int', default: [], nullable: true, array: true})
//   friendsList: number[];
//   @Column({ type: 'int', default: [], nullable: true, array: true})
//   blockedUsers: number[];
//   @OneToMany(type => GamesEntity, game => game.user1)
//   games: GamesEntity[];
}

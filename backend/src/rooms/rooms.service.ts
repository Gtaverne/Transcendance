import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomDTO } from './dto/room.dto';
import { RoomsEntity } from './rooms.entity';
import { UsersService } from 'src/users/users.service';
import { identity } from 'rxjs';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsEntity)
    private roomsRepository: Repository<RoomsEntity>,
    private usersService: UsersService,
  ) {}

  async create(createRoom: CreateRoomDTO) {
    console.log(createRoom);
    const newRoom = await this.roomsRepository.create();

    if (createRoom.isDm == true) {
      const user1 = await this.usersService.findOne(createRoom.owner);
      const user2 = await this.usersService.findOne(createRoom.secondMemberDm);
      if (!user1 || !user2) {
        console.log('One of the users is was not found');
        return;
      }
      console.log(user1);
      console.log(user2);
      newRoom.accessList = [user1, user2];
      newRoom.category = createRoom.category;
      newRoom.owner = user1;
      newRoom.isDm = true;
      newRoom.channelName = createRoom.channelName;
    } else {
      console.log('Room Category Not Valid Sorry');
      return;
    }

    await this.roomsRepository.save(newRoom);
    console.log('We added to the db:', newRoom);
    return newRoom;
    // return JSON.stringify(newUser);
    // return 'Tout est opérationnel :)';
  }

  async findRooms(userId: number) {
    // const p1 = await this.roomsRepository.find({ accessList: {$in: userId} });
    const p1 = await this.roomsRepository.find({ where: { isDm: true } });
    // const p2 = await this.roomsRepository.find({ category: 'public' });
    // return p1.concat(p2);
    // const query = this.roomsRepository.createQueryBuilder('room').leftJoinAndSelect('room.admins', 'admins').where('users.id = :id', { id: userId })

    return p1;
  }

  async findOne(id: number) {
    const user = await this.roomsRepository.findOne(id);
    return user;
  }
}

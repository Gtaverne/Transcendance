import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => UsersService))
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
    return this.usersService.accessList(userId);
  }

  async findOne(id: number) {
    const user = await this.roomsRepository.findOne(id);
    return user;
  }

  findAll() {
    return `This action returns all tuto`;
  }

  async findRoomUsers(roomId: number) {
    const users = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['accessList'],
    });
    return users.accessList;
  }
}

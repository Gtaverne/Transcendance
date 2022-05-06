import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomDTO } from './dto/room.dto';
import { RoomsEntity } from './rooms.entity';
import { UsersService } from 'src/users/users.service';
import { identity } from 'rxjs';
import { JoinRoomDTO } from './dto/join-room';

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
    const user1 = await this.usersService.findOne(createRoom.owner);
    console.log(user1);

    if (createRoom.category === 'directMessage') {
      const user2 = await this.usersService.findOneWithName(
        createRoom.secondMemberDm,
      );
      if (!user1 || !user2 || user1 === user2) {
        console.log('One of the users is was not found or duplicate');
        return;
      }
      console.log(user2);
      newRoom.accessList = [user1, user2];
      newRoom.category = createRoom.category;
      newRoom.owner = user1;
      newRoom.isDm = true;
      newRoom.channelName = createRoom.channelName;
    } else if (createRoom.category === 'public') {
      if (
        createRoom.channelName === '-' ||
        createRoom.channelName.length >= 300
      ) {
        console.log('Wrong Data');
        return;
      }
      newRoom.accessList = [user1];
      newRoom.category = createRoom.category;
      newRoom.owner = user1;
      newRoom.channelName = createRoom.channelName;
    } else if (createRoom.category === 'passwordProtected') {
      if (
        createRoom.channelName === '-' ||
        createRoom.channelName.length >= 300 ||
        createRoom.password.length >= 200
      ) {
        console.log('Wrong Data');
        return;
      }
      newRoom.accessList = [user1];
      newRoom.category = createRoom.category;
      newRoom.owner = user1;
      newRoom.channelName = createRoom.channelName;
      newRoom.password = createRoom.password;
    } else {
      console.log('Room Category Not Valid Sorry');
      return;
    }

    await this.roomsRepository.save(newRoom);
    console.log('We added to the db:', newRoom);
    return newRoom;
  }

  async join(join: JoinRoomDTO) {
    console.log(join);
    const user = await this.usersService.accessListUser(join.owner);
    const room = await this.roomsRepository.findOne(join.convId);
    if (!user || !room) return;
    // console.log(user.accessToList);
    // console.log('-------------------------------------------');
    user.accessToList.push(room);
    // console.log(user.accessToList);
    this.usersService.save(user);
    return room;
  }

  async findRooms(userId: number) {
    return this.usersService.accessList(userId);
  }

  //Bonus: Make this function more compact for real
  async findRoomsCanJoin(userId: number) {
    const accessList = await this.usersService.accessList(userId);
    const accessListNum = [];
    for (let i = 0; i < accessList.length; i++)
      accessListNum.push(accessList[i].id);
    const allRooms = await this.roomsRepository.find();
    const ret = [];
    for (let i = 0; i < allRooms.length; i++) {
      if (allRooms[i].isDm === false && !accessListNum.includes(allRooms[i].id))
        ret.push(allRooms[i]);
    }
	// console.log("I can join", ret.length, "rooms");
    return ret;
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

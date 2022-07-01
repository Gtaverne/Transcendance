import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomsEntity } from './rooms.entity';
import { UsersService } from 'src/users/users.service';
import { JoinRoomDTO } from './dto/join-room';
import { compare, genSalt, hash } from 'bcrypt';
import { ChangeRoleDTO } from './dto/change-status.dto';
import { MuteBanDTO } from './dto/mute-ban.dto';
import { MuteEntity } from './mute.entity';
import { BanEntity } from './ban.entity';

var jwt = require('jsonwebtoken');
const TOKEN_SECRET = process.env.JWT_Secret;

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsEntity)
    private roomsRepository: Repository<RoomsEntity>,
    @InjectRepository(MuteEntity)
    private muteRepository: Repository<MuteEntity>,
    @InjectRepository(BanEntity)
    private banRepository: Repository<BanEntity>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async invite(data: ChangeRoleDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) return false;
    const user = await this.usersService.findOneWithName(data.role);
    const banList = await this.banList(data.channelId);
    const room = await this.roomsRepository.findOne({
      where: { id: data.channelId },
      relations: ['accessList', 'admins', 'owner'],
    });
    const roomMembers = await this.findRoomUsersId(data.channelId);
    if (!user || !room) return false;
    if (!roomMembers.includes(data.user.id)) return false;
    const adminList: number[] = [];
    for (let i = 0; i < room.admins.length; i++) {
      adminList.push(room.admins[i].id);
    }

    //If the user is banned, only owner or admin can invite him
    if (banList.includes(user.id)) {
      if (!(room.owner.id == data.user.id || adminList.includes(data.user.id)))
        return false;
    }

    for (let i = 0; i < room.accessList.length; i++) {
      if (room.accessList[i].id === user.id) {
        console.log('User Already in the Room');
        return false;
      }
    }
    room.accessList.push(user);
    this.roomsRepository.save(room);
    return true;
  }

  async muteList(id: number): Promise<number[]> {
    const room = await this.roomsRepository
      .createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.muteList', 'muteList')
      .leftJoinAndSelect('muteList.mutedUser', 'mutedUser')
      .where('rooms.id = :id', { id })
      .getOne();
    const list: number[] = [];
    let now = new Date();
    for (let i = 0; i < room.muteList.length; i++)
      if (now < new Date(room.muteList[i].timestamp))
        list.push(room.muteList[i].mutedUser.id);
    return list;
  }

  async banList(id: number): Promise<number[]> {
    const room = await this.roomsRepository
      .createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.banList', 'banList')
      .leftJoinAndSelect('banList.banedUser', 'banedUser')
      .where('rooms.id = :id', { id })
      .getOne();
    const list: number[] = [];
    let now = new Date();
    for (let i = 0; i < room.banList.length; i++)
      if (now < new Date(room.banList[i].timestamp))
        list.push(room.banList[i].banedUser.id);
    return list;
  }

  async mute(data: MuteBanDTO, token: string) {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) {
      console.log('WRONG JWT', jwt.verify(token, TOKEN_SECRET), data.user.id);
      return false;
    }
    if (data.time < 0) {
      console.log("Can't mute a negative time");
      return false;
    }
    const user = await this.usersService.findOne(data.appointedId);
    const room = await this.roomsRepository.findOne(data.channelId);
    const newMute = new MuteEntity();
    newMute.mutedUser = user;
    newMute.muted = room;
    newMute.timestamp = new Date(new Date().getTime() + data.time * 60000);
    const roomXL = await this.roomsRepository
      .createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.muteList', 'muteList')
      .leftJoinAndSelect('muteList.mutedUser', 'mutedUser')
      .leftJoinAndSelect('muteList.muted', 'muted')
      .leftJoinAndSelect('rooms.owner', 'owner')
      .leftJoinAndSelect('rooms.admins', 'admins')
      .where('rooms.id = :a', { a: data.channelId })
      .getOne();
    let adminList = [];
    for (let i = 0; i < roomXL.admins.length; i++)
      adminList.push(roomXL.admins[i].id);
    if (roomXL.owner.id !== data.user.id && !adminList.includes(data.user.id)) {
      console.log('User Request is not comming from Owner or Admin');
      return false;
    }
    if (
      adminList.includes(data.appointedId) ||
      data.appointedId === data.user.id ||
      roomXL.owner.id === data.appointedId
    ) {
      console.log("User can't mute an Admin or Owner or Himself");
      return false;
    }
    const mutedEntity = await this.muteRepository
      .createQueryBuilder('mute')
      .leftJoinAndSelect('mute.muted', 'muted')
      .leftJoinAndSelect('mute.mutedUser', 'mutedUser')
      .where('muted.id = :a', { a: data.channelId })
      .andWhere('mutedUser.id = :b', { b: data.appointedId })
      .getOne();
    if (!mutedEntity) {
      await this.muteRepository.save(newMute);
      console.log('New Mute Created');
      return true;
    }
    mutedEntity.timestamp = newMute.timestamp;
    this.muteRepository.save(mutedEntity);
    console.log('Mute Edited');
    return true;
  }

  async ban(data: MuteBanDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) return false;
    if (data.time < 0) {
      console.log("Can't ban a negative time");
      return false;
    }
    const user = await this.usersService.findOne(data.appointedId);
    const room = await this.roomsRepository.findOne(data.channelId);
    const newBan = new BanEntity();
    newBan.banedUser = user;
    newBan.baned = room;
    newBan.timestamp = new Date(new Date().getTime() + data.time * 60000);
    const roomXL = await this.roomsRepository
      .createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.banList', 'banList')
      .leftJoinAndSelect('banList.banedUser', 'banedUser')
      .leftJoinAndSelect('banList.baned', 'baned')
      .leftJoinAndSelect('rooms.owner', 'owner')
      .leftJoinAndSelect('rooms.admins', 'admins')
      .where('rooms.id = :a', { a: data.channelId })
      .getOne();
    let adminList = [];
    for (let i = 0; i < roomXL.admins.length; i++)
      adminList.push(roomXL.admins[i].id);
    if (roomXL.owner.id !== data.user.id && !adminList.includes(data.user.id)) {
      console.log('User Request is not comming from Owner or Admin');
      return false;
    }
    if (
      adminList.includes(data.appointedId) ||
      data.appointedId === data.user.id ||
      roomXL.owner.id === data.appointedId
    ) {
      console.log("User can't ban an Admin or Owner or Himself");
      return false;
    }
    const banedEntity = await this.banRepository
      .createQueryBuilder('ban')
      .leftJoinAndSelect('ban.baned', 'baned')
      .leftJoinAndSelect('ban.banedUser', 'banedUser')
      .where('baned.id = :a', { a: data.channelId })
      .andWhere('banedUser.id = :b', { b: data.appointedId })
      .getOne();
    if (!banedEntity) {
      await this.banRepository.save(newBan);
      console.log('New Ban Created');
    } else {
      banedEntity.timestamp = newBan.timestamp;
      this.banRepository.save(banedEntity);
      console.log('Ban Edited');
    }
    this.leaveRoom({
      user,
      channelId: data.channelId,
      appointedId: 0,
      role: 'leave',
    });
    return true;
  }

  async changePassword(data: ChangeRoleDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) return;
    const room = await this.roomsRepository.findOne({
      where: { id: data.channelId },
      relations: ['owner'],
    });
    if (room.category === 'private' || room.category === 'directMessage')
      return false;
    if (room.owner.id !== data.user.id) {
      console.log('User Request is not comming from Owner');
      return false;
    }
    if (data.role.length >= 300) {
      console.log('Password is too long');
      return false;
    }
    if (data.appointedId === -1) {
      room.password = '';
      room.category = 'public';
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(data.role, salt);
      room.password = hashedPassword;
      room.category = 'passwordProtected';
    }
    await this.roomsRepository.save(room);
    return true;
  }

  async leaveRoom(data: ChangeRoleDTO) {
    const room = await this.roomsRepository.findOne({
      where: { id: data.channelId },
      relations: ['accessList', 'owner', 'admins'],
    });
    const user = await this.usersService.findOne(data.user.id);
    if (room.owner.id === data.user.id) {
      console.log("Owner can't leave the room");
      return false;
    }
    if (data.role !== 'leave') {
      console.log('Wrong Request Role');
      return false;
    }
    for (let i = 0; i < room.accessList.length; i++) {
      if (room.accessList[i].id === user.id) {
        console.log('User', user.id, 'Found in the Room', room.id, 'Leaving');
        room.accessList.splice(i, 1);
        for (let j = 0; j < room.admins.length; j++) {
          if (room.admins[j].id === user.id) {
            console.log('User was also admin, removing the role');
            room.admins.splice(j, 1);
          }
        }
        await this.roomsRepository.save(room);
        return true;
      }
    }
    console.log('User is not in the room');
    return false;
  }

  async changeAdmin(data: ChangeRoleDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) return;
    const room = await this.roomsRepository.findOne({
      where: { id: data.channelId },
      relations: ['owner', 'admins'],
    });
    const newAdmin = await this.usersService.findOne(data.appointedId);
    if (room.owner.id !== data.user.id) {
      console.log('User Request is not comming from Owner');
      return false;
    }
    if (data.role !== 'admin') {
      console.log('Wrong Request Role');
      return false;
    }
    for (let i = 0; i < room.admins.length; i++) {
      if (room.admins[i].id === data.appointedId) {
        console.log('User is already Admin, removing the role');
        room.admins.splice(i, 1);
        await this.roomsRepository.save(room);
        return true;
      }
    }
    room.admins.push(newAdmin);
    await this.roomsRepository.save(room);
    return true;
  }

  async changeOwner(data: ChangeRoleDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != data.user.id) return;
    const room = await this.roomsRepository.findOne({
      where: { id: data.channelId },
      relations: ['owner'],
    });
    const newOwner = await this.usersService.findOne(data.appointedId);
    if (room.owner.id !== data.user.id) {
      console.log('User Request is not comming from Owner');
      return false;
    }
    if (data.role !== 'owner') {
      console.log('Wrong Request Role');
      return false;
    }
    room.owner = newOwner;
    await this.roomsRepository.save(room);
    return true;
  }

  async create(createRoom: CreateRoomDTO) {
    console.log(createRoom);
    const newRoom = await this.roomsRepository.create();
    const user1 = await this.usersService.findOne(createRoom.owner);
    if (createRoom.channelName.length > 30) return;

    if (createRoom.category === 'directMessage') {
      const user2 = await this.usersService.findOneWithName(
        createRoom.secondMemberDm,
      );
      if (!user1 || !user2 || user1.id === user2.id) {
        console.log('One of the users was not found or is duplicate');
        return;
      }
      newRoom.accessList = [user1, user2];
      newRoom.category = createRoom.category;
      newRoom.owner = user1;
      newRoom.isDm = true;
      newRoom.channelName = createRoom.channelName;
    } else if (
      createRoom.category === 'public' ||
      createRoom.category === 'private'
    ) {
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
      newRoom.admins = [user1];
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
      const salt = await genSalt(10);
      const hashedPassword = await hash(createRoom.password, salt);
      newRoom.accessList = [user1];
      newRoom.category = createRoom.category;
      newRoom.owner = user1;
      newRoom.admins = [user1];
      newRoom.channelName = createRoom.channelName;
      newRoom.password = hashedPassword;
    } else {
      console.log('Room Category Not Valid Sorry');
      return;
    }

    await this.roomsRepository.save(newRoom);
    // console.log('We added to the db:', newRoom);
    return newRoom;
  }

  async join(join: JoinRoomDTO, token: String) {
    if (jwt.verify(token, TOKEN_SECRET) != join.owner) return;
    const user = await this.usersService.accessListUser(join.owner);
    const room = await this.roomsRepository.findOne(join.convId);
    const bannedFrom = await this.usersService.findBanned(join.owner);
    if (!user || !room) return;
    if (bannedFrom.includes(join.convId)) {
      console.log("Can't join a room you are banned from");
      return;
    }
    // console.log(1, join.password);
    // const salt = await genSalt();
    // console.log(2, salt);
    // const hashedPassword = await hash(join.password, salt);
    // console.log(3, hashedPassword);
    const res = await compare(join.password, room.password);
    // console.log(4, res);

    if (join.private && !res) {
      console.log('Wrong Password, Access to the Room Denied');
      return;
    }
    // console.log(room.password, '-', join.password, join.private);
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
      if (
        allRooms[i].isDm === false &&
        !accessListNum.includes(allRooms[i].id) &&
        allRooms[i].category !== 'private'
      )
        ret.push(allRooms[i]);
    }
    // console.log("I can join", ret.length, "rooms");
    return ret;
  }

  async findOne(roomId: number) {
    const user = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['muteList', 'banList', 'accessList', 'owner', 'admins'],
    });
    return user;
  }

  async findRoomUsers(roomId: number) {
    const users = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['accessList'],
    });
    return users.accessList;
  }

  async findRoomUsersId(roomId: number): Promise<number[]> {
    const users = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['accessList'],
    });
    const list: number[] = [];
    for (let i = 0; i < users.accessList.length; i++)
      list.push(users.accessList[i].id);
    return list;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomDTO } from './dto/room.dto';
import { RoomsEntity } from './rooms.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsEntity)
    private roomsRepository: Repository<RoomsEntity>,
  ) {}

  async create(room: RoomDTO) {
    if (room.isDm == true && room.accessList.length === 2) {
      room.owner = room.accessList[0];
	  console.log('NEW ROOM DM');

    } else {
      console.log('Room Category Not Valid Sorry');
      return;
    }

    const newRoom = await this.roomsRepository.create(room);
    await this.roomsRepository.save(newRoom);
    console.log('We added to the db:', newRoom);
    return newRoom;
    // return JSON.stringify(newUser);
    // return 'Tout est opérationnel :)';
  }
}

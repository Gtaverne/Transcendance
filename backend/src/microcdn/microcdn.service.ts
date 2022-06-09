import { Get, Injectable, Param } from '@nestjs/common';

@Injectable()
export class MicrocdnService {
  constructor() {}

  getAvatarPath(id: number): string {
    console.log('Get avatar of id: ', id);

    return `/microcdn/avatar/${id}.jpg`;
  }
}

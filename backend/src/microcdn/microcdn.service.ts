import { Get, Injectable, Param } from '@nestjs/common';
import * as fs from 'fs';

const CDN_PATH = '/app/microcdn';

@Injectable()
export class MicrocdnService {
  constructor() {}

  getAvatarPath(id: number): string {
    const path = CDN_PATH + `/avatar/${id}.jpg`;
    console.log('Get avatar of id: ', id, ' trying path: ', path);
    // console.log('PAth exists? ', fs.existsSync(path));

    try {
      if (fs.existsSync(path)) {
        console.log('Picture found');

        return path;
      } else {
        console.log('Return default');
        return '/app/microcdn/avatar/default.jpg';
      }
    } catch (error) {
      console.log('Error in path: ', error);

      return '/app/microcdn/avatar/1.jpg';
    }
  }
}

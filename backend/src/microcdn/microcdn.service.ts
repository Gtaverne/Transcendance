import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const CDN_PATH = '/app/microcdn';

@Injectable()
export class MicrocdnService {
  constructor() {}

  getContentPath(reference: string): string {
    const path = CDN_PATH + `/siteimages/${reference}`;

    try {
      if (fs.existsSync(path)) {
        return path;
      } else if (fs.existsSync(path + '.jpg')) {
        return path + '.jpg';
      } else if (fs.existsSync(path + '.png')) {
        return path + '.png';
      } else if (fs.existsSync(CDN_PATH + '/siteimages/default.jpg')) {
        return CDN_PATH + '/siteimages/default.jpg';
      }
    } catch {
      console.log(
        'No CDN, please create a /siteimage/default.jpg file in the cdn volume',
      );
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/512px-42_Logo.svg.png';
    }

    return path;
  }

  getAvatarPath(id: number): string {
    const path = CDN_PATH + `/avatar/${id}.`;
    try {
      if (fs.existsSync(path+'jpg')) {  
        return path+'jpg';
      } else if (fs.existsSync(path+'gif')) {  
        return path+'gif';
      } else if (fs.existsSync(path+'png')) {  
        return path+'png';
      } else {
        console.log('Return default picture');
        return '/app/microcdn/avatar/default.jpg';
      }
    } catch (error) {
      console.log('Error in path: ', error);

      return '/app/microcdn/avatar/default.jpg';
    }
  }
}

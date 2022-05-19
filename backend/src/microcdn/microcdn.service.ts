import { Get, Injectable, Param } from '@nestjs/common';

@Injectable()
export class MicrocdnService {
  constructor() {}

  async getAvatar(id: number): Promise<any> {
    console.log('Get avatar of id: ', id);
    // const file = createReadStream(join(process.cwd(), 'package.json'));
    // file.pipe(file);

    
    return 'plop';
  }
}

import { Injectable } from '@nestjs/common';
import { CreateTutoDto } from './dto/create-tuto.dto';
import { UpdateTutoDto } from './dto/update-tuto.dto';

@Injectable()
export class TutoService {
  create(createTutoDto: CreateTutoDto) {
    return 'This action adds a new tuto';
  }

  findAll() {
    return `This action returns all tuto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tuto`;
  }

  update(id: number, updateTutoDto: UpdateTutoDto) {
    return `This action updates a #${id} tuto`;
  }

  remove(id: number) {
    return `This action removes a #${id} tuto`;
  }
}

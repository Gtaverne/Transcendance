import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { TutoService } from './tuto.service';
import { CreateTutoDto } from './dto/create-tuto.dto';
import { UpdateTutoDto } from './dto/update-tuto.dto';

@WebSocketGateway()
export class TutoGateway {
  constructor(private readonly tutoService: TutoService) {}

  @SubscribeMessage('createTuto')
  create(@MessageBody() createTutoDto: CreateTutoDto) {
    return this.tutoService.create(createTutoDto);
  }

  @SubscribeMessage('findAllTuto')
  findAll() {
    return this.tutoService.findAll();
  }

  @SubscribeMessage('findOneTuto')
  findOne(@MessageBody() id: number) {
    return this.tutoService.findOne(id);
  }

  @SubscribeMessage('updateTuto')
  update(@MessageBody() updateTutoDto: UpdateTutoDto) {
    return this.tutoService.update(updateTutoDto.id, updateTutoDto);
  }

  @SubscribeMessage('removeTuto')
  remove(@MessageBody() id: number) {
    return this.tutoService.remove(id);
  }
}

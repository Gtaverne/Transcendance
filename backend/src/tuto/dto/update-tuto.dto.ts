import { PartialType } from '@nestjs/mapped-types';
import { CreateTutoDto } from './create-tuto.dto';

export class UpdateTutoDto extends PartialType(CreateTutoDto) {
  id: number;
}

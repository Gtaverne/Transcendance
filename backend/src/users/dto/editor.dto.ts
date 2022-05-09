import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditorDTO {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  readonly field: string;
  @IsNotEmpty()
  readonly value: any;
}

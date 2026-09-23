import { IsOptional, IsString, MinLength } from 'class-validator';

export class CrearAutorDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsOptional()
  @IsString()
  nacionalidad?: string;
}

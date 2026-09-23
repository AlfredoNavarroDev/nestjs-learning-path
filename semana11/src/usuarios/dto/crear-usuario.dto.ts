import { IsEmail, IsString, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsEmail()
  email!: string;
}

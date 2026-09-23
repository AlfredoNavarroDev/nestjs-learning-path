import { IsUUID } from 'class-validator';

export class CrearPrestamoDto {
  @IsUUID('4')
  libroId!: string;

  @IsUUID('4')
  usuarioId!: string;
}

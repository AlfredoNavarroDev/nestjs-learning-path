import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SolicitanteDto } from './solicitante.dto';

export class CrearPrestamoDto {
  @IsString()
  libroId!: string;

  // @ValidateNested valida el objeto anidado con las reglas de su propio DTO;
  // @Type() le dice a class-transformer a qué clase instanciar el objeto
  // plano que llega en el JSON (si no, `solicitante` sería un objeto sin
  // decoradores y @ValidateNested no tendría nada que validar).
  @ValidateNested()
  @Type(() => SolicitanteDto)
  solicitante!: SolicitanteDto;

  // @ValidateIf: solo se valida `notas` si el solicitante puso algo (no es
  // obligatorio, pero si viene, tiene que ser string).
  @ValidateIf((o) => o.notas !== undefined)
  @IsOptional()
  @IsString()
  notas?: string;
}

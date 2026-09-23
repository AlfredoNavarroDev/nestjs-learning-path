import { PartialType } from '@nestjs/mapped-types';
import { CrearAutorDto } from './crear-autor.dto';

export class ActualizarAutorDto extends PartialType(CrearAutorDto) {}

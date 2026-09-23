import { PartialType } from '@nestjs/mapped-types';
import { CrearLibroDto } from './crear-libro.dto';

// PartialType convierte todos los campos del DTO base en opcionales,
// conservando sus reglas de validación (tu misma idea que `Partial<T>`
// de la semana 1, ya integrada con class-validator).
export class ActualizarLibroDto extends PartialType(CrearLibroDto) {}

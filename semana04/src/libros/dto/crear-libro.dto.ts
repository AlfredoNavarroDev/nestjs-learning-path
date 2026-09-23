import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

// DTO ≠ Entity: el DTO es el contrato de lo que entra por HTTP; la Entity
// (semana 5) es el modelo de persistencia. No siempre coinciden campo a campo.
export class CrearLibroDto {
  @IsString()
  @MinLength(2)
  titulo!: string;

  @IsString()
  autorId!: string;

  @Matches(/^(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d$/, {
    message: 'isbn debe tener formato ISBN-10 o ISBN-13',
  })
  isbn!: string;

  @IsInt()
  @Min(1450)
  @Max(new Date().getFullYear())
  anio!: number;

  @IsOptional()
  @IsBoolean()
  prestado?: boolean;
}

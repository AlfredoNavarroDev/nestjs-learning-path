import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

// DTO ≠ Entity: el DTO es el contrato de lo que entra por HTTP (recibe
// `autoresIds`, no objetos `Autor` completos); la Entity resuelve la
// relación real contra la base de datos en el service.
export class CrearLibroDto {
  @IsString()
  @MinLength(2)
  titulo!: string;

  @Matches(/^(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d$/, {
    message: 'isbn debe tener formato ISBN-10 o ISBN-13',
  })
  isbn!: string;

  @IsInt()
  @Min(1450)
  @Max(new Date().getFullYear())
  anio!: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  autoresIds!: string[];
}

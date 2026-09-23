// ── TODO 2: agregar los decoradores de class-validator que faltan ──
// import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min, MinLength } from 'class-validator';

export class CrearLibroDto {
  titulo!: string;

  autorId!: string;

  isbn!: string;

  anio!: number;

  prestado?: boolean;
}

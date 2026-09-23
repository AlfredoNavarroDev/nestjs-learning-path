import { IsOptional, IsString } from 'class-validator';
import { SolicitanteDto } from './solicitante.dto';

export class CrearPrestamoDto {
  @IsString()
  libroId!: string;

  // ── TODO 4: @ValidateNested() + @Type(() => SolicitanteDto) ────────
  solicitante!: SolicitanteDto;

  @IsOptional()
  @IsString()
  notas?: string;
}

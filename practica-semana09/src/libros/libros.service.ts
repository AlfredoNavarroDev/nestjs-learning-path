import { Injectable } from '@nestjs/common';
import { Libro, ResultadoPaginado } from './libro.interface';

const CATEGORIAS = ['ficcion', 'tecnico', 'historia'];

export interface BusquedaLibros {
  page: number;
  limit: number;
  categoria?: string;
  disponible?: boolean;
  sort?: 'titulo' | 'categoria';
  order?: 'asc' | 'desc';
}

@Injectable()
export class LibrosService {
  private readonly libros: Libro[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    titulo: `Libro ${String(i + 1).padStart(2, '0')}`,
    categoria: CATEGORIAS[i % CATEGORIAS.length],
    disponible: i % 4 !== 0,
  }));

  buscar(filtro: BusquedaLibros): ResultadoPaginado<Libro> {
    let resultado = [...this.libros];

    // ── TODO 1: filtrar por filtro.categoria si vino ──────────────
    // ── TODO 2: filtrar por filtro.disponible si vino (!== undefined) ──
    // ── TODO 3: si filtro.sort vino, ordenar con localeCompare y
    // respetar filtro.order ('asc'/'desc') ───────────────────────

    const total = resultado.length;
    // ── TODO 4: calcular start = (filtro.page - 1) * filtro.limit
    // y data = resultado.slice(start, start + filtro.limit) ──────
    const start = 0;
    const data = resultado.slice(start, start + filtro.limit);

    return {
      data,
      total,
      page: filtro.page,
      totalPages: Math.ceil(total / filtro.limit),
    };
  }
}

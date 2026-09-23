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
  // 12 libros de prueba, suficientes para demostrar paginación real (con
  // limit=5 hay 3 páginas).
  private readonly libros: Libro[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    titulo: `Libro ${String(i + 1).padStart(2, '0')}`,
    categoria: CATEGORIAS[i % CATEGORIAS.length],
    disponible: i % 4 !== 0,
  }));

  // Paginación offset-based: skip/take + metadata de la página actual.
  buscar(filtro: BusquedaLibros): ResultadoPaginado<Libro> {
    let resultado = [...this.libros];

    if (filtro.categoria) {
      resultado = resultado.filter((l) => l.categoria === filtro.categoria);
    }
    if (filtro.disponible !== undefined) {
      resultado = resultado.filter((l) => l.disponible === filtro.disponible);
    }

    // Whitelist de columnas ordenables: nunca aceptar un nombre de columna
    // arbitrario del query param (evita ordenar por algo inesperado/inseguro).
    if (filtro.sort) {
      const dir = filtro.order === 'desc' ? -1 : 1;
      resultado.sort((a, b) => a[filtro.sort!].localeCompare(b[filtro.sort!]) * dir);
    }

    const total = resultado.length;
    const start = (filtro.page - 1) * filtro.limit;
    const data = resultado.slice(start, start + filtro.limit);

    return {
      data,
      total,
      page: filtro.page,
      totalPages: Math.ceil(total / filtro.limit),
    };
  }
}

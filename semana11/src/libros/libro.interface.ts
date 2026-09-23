export interface ResultadoPaginado<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BusquedaLibrosFiltro {
  page: number;
  limit: number;
  titulo?: string;
  categoria?: string;
  autorId?: string;
  disponible?: boolean;
  sort?: 'titulo' | 'anio';
  order?: 'asc' | 'desc';
}

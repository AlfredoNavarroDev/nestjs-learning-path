export interface Libro {
  id: string;
  titulo: string;
  categoria: string;
  disponible: boolean;
}

export interface ResultadoPaginado<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Día 1 — Tipos avanzados (generics, union types, utility types)

// Union type: NO existe en Java nativo (lo más cercano: sealed interfaces en Java 17+)
type Estado = 'pendiente' | 'prestado' | 'devuelto';

// Generic: misma sintaxis que <T> en Java, pero TS infiere mucho mejor
interface Paginado<T> {
  items: T[];
  page: number;
  total: number;
}

function paginate<T>(items: T[], page: number, size = 10): Paginado<T> {
  const start = (page - 1) * size;
  return {
    items: items.slice(start, start + size),
    page,
    total: items.length,
  };
}

// Utility types: no tienen equivalente directo en Java (Lombok/MapStruct es lo más cercano)
interface Libro {
  id: string;
  titulo: string;
  autor: string;
  prestado: boolean;
}

type LibroCrear = Omit<Libro, 'id'>; // todo menos id
type LibroEditar = Partial<Libro>; // todo opcional
type LibroIdTitulo = Pick<Libro, 'id' | 'titulo'>;

const catalogo: Libro[] = [
  { id: '1', titulo: 'Clean Code', autor: 'Martin', prestado: false },
  { id: '2', titulo: 'DDD', autor: 'Evans', prestado: true },
];

const pagina1 = paginate(catalogo, 1, 1);
console.log('Página 1:', JSON.stringify(pagina1.items));

const nuevo: LibroCrear = { titulo: 'Refactoring', autor: 'Fowler', prestado: false };
console.log('LibroCrear (sin id):', JSON.stringify(nuevo));

const estado: Estado = 'prestado';
console.log('Estado (union literal):', estado);

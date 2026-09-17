// Día 1 — Tipos avanzados (generics + utility types + union)
// Los `// TODO` marcan lo que tenés que implementar.

// ── Ya completo: modelo y datos de ejemplo ─────────────────────
interface Libro {
  id: string;
  titulo: string;
  autor: string;
  prestado: boolean;
}

type Estado = 'pendiente' | 'prestado' | 'devuelto';

const catalogo: Libro[] = [
  { id: '1', titulo: 'Clean Code', autor: 'Martin', prestado: false },
  { id: '2', titulo: 'DDD', autor: 'Evans', prestado: true },
];

// ── Ya completo: interface del resultado paginado ──────────────
interface Paginado<T> {
  items: T[];
  page: number;
  total: number;
}

// ── TODO 1: función genérica ───────────────────────────────────
function paginate<T>(items: T[], page: number, size = 10): Paginado<T> {
  // TODO: const start = (page - 1) * size
  // TODO: return { items: items.slice(start, start + size), page, total: items.length }
  throw new Error('TODO: implementar paginate');
}

// ── TODO 2: utility types ──────────────────────────────────────
// Reemplazá `any` por el utility type correcto.
type LibroCrear = any; // TODO: Omit<Libro, 'id'>
type LibroEditar = any; // TODO: Partial<Libro>
type LibroIdTitulo = any; // TODO: Pick<Libro, 'id' | 'titulo'>

// ── Verificación ───────────────────────────────────────────────
// Al terminar, `npm run dia1` debe imprimir sin lanzar error:
const pagina1 = paginate(catalogo, 1, 1);
console.log('Página 1:', JSON.stringify(pagina1.items));

const nuevo: LibroCrear = { titulo: 'Refactoring', autor: 'Fowler', prestado: false };
console.log('LibroCrear (sin id):', JSON.stringify(nuevo));

const estado: Estado = 'prestado';
console.log('Estado (union literal):', estado);

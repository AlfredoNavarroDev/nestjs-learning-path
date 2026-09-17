// Día 3 — interface vs type vs class (tipado estructural)

// ── TODO 1: interface ──────────────────────────────────────────
interface LibroInterface {
  // TODO: titulo: string
  titulo: string,
  // TODO: autor: string
  autor: string
}

// ── TODO 2: type ───────────────────────────────────────────────
type LibroType = {
  // TODO: titulo: string
  titulo: string,
  // TODO: autor: string
  autor: string
};

// ── Ya completo: clase ─────────────────────────────────────────
class LibroClass {
  constructor(
    public readonly titulo: string,
    public readonly autor: string,
  ) {}
}

// ── Verificación ───────────────────────────────────────────────
// Al completar los campos, esto compila SIN `implements` (tipado estructural):
const deInterface: LibroInterface = new LibroClass('Clean Code', 'Martin');
const deType: LibroType = new LibroClass('DDD', 'Evans');

console.log('Class como Interface:', JSON.stringify(deInterface));
console.log('Class como Type:', JSON.stringify(deType));

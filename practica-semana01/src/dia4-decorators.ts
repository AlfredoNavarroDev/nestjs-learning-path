// Día 4/6-7 — Decorators desde cero
import 'reflect-metadata';

// ── TODO 1: decorator de clase ─────────────────────────────────
// Debe devolver una clase que loguee cada `new`.
function LogInstancia<T extends { new (...args: any[]): object }>(ctor: T): T {
  // TODO: return class extends ctor {
  //         constructor(...args: any[]) {
  //           super(...args);
  //           console.log(`[instancia] ${ctor.name} creado`);
  //         }
  //       } as T
  return ctor;
}

// ── TODO 2: decorator de método ────────────────────────────────
// Debe envolver descriptor.value y medir la duración.
function MedirTiempo(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  // TODO: const original = descriptor.value
  // TODO: descriptor.value = function (...args: any[]) { medir Date.now() y loguear }
  return descriptor;
}

// ── TODO 3: decorator de propiedad ─────────────────────────────
// Debe adjuntar metadata con Reflect.defineMetadata.
function Timestamp(target: any, propertyKey: string): void {
  // TODO: Reflect.defineMetadata('timestamp', Date.now(), target, propertyKey)
}

@LogInstancia
class Libro {
  @Timestamp
  titulo: string;

  constructor(titulo: string) {
    this.titulo = titulo;
  }

  @MedirTiempo
  resumen(): string {
    return `"${this.titulo}"`;
  }
}

const libro = new Libro('Clean Code');
console.log('Resumen:', libro.resumen());
console.log(
  'Timestamp metadata:',
  Reflect.getMetadata('timestamp', Libro.prototype, 'titulo') !== undefined
    ? 'presente'
    : 'ausente',
);

// Día 4/6-7 — Decorators desde cero (equivalente a annotations Java, pero EJECUTAN)
import 'reflect-metadata';

// 1) Decorator de clase: envuelve el constructor y loguea la instanciación
function LogInstancia<T extends { new (...args: any[]): object }>(ctor: T): T {
  return class extends ctor {
    constructor(...args: any[]) {
      super(...args);
      console.log(`[instancia] ${ctor.name} creado`);
    }
  } as T;
}

// 2) Decorator de método: mide y loguea la duración
function MedirTiempo(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const inicio = Date.now();
    const resultado = original.apply(this, args);
    console.log(`[método] ${propertyKey} tardó ${Date.now() - inicio}ms`);
    return resultado;
  };
  return descriptor;
}

// 3) Decorator de propiedad: adjunta metadata (timestamp) vía reflect-metadata
function Timestamp(target: any, propertyKey: string): void {
  Reflect.defineMetadata('timestamp', Date.now(), target, propertyKey);
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

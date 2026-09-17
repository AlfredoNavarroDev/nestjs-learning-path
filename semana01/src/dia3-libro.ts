// Día 3 — interface vs type vs class (tipado estructural vs nominal)

interface LibroInterface {
  titulo: string;
  autor: string;
}

type LibroType = {
  titulo: string;
  autor: string;
};

class LibroClass {
  constructor(
    public readonly titulo: string,
    public readonly autor: string,
  ) {}
}

// Diferencia clave con Java: TS es ESTRUCTURAL, no nominal.
// No hace falta `implements LibroInterface` para que sea compatible:
// si la forma coincide, es válido (duck typing).
const deInterface: LibroInterface = new LibroClass('Clean Code', 'Martin');
const deType: LibroType = new LibroClass('DDD', 'Evans');

console.log('Class como Interface:', JSON.stringify(deInterface));
console.log('Class como Type:', JSON.stringify(deType));

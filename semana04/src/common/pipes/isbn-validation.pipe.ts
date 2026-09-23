import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// Anatomía de un Pipe: implementa `PipeTransform` y el método `transform()`,
// que recibe el valor crudo y devuelve el valor transformado/validado.
// Mismo rol que `ParseIntPipe`/`ParseUUIDPipe`, pero para una regla propia.
@Injectable()
export class IsbnValidationPipe implements PipeTransform<string, string> {
  // ISBN-13 simplificado: 13 dígitos, con o sin guiones.
  private readonly ISBN_REGEX = /^(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d$/;

  transform(value: string, _metadata: ArgumentMetadata): string {
    const limpio = value.replace(/-/g, '');
    if (!/^\d{10}(\d{3})?$/.test(limpio) || !this.ISBN_REGEX.test(value)) {
      throw new BadRequestException(`ISBN inválido: "${value}"`);
    }
    return value;
  }
}

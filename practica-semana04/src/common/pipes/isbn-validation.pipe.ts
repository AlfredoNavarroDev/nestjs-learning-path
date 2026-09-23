import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IsbnValidationPipe implements PipeTransform<string, string> {
  private readonly ISBN_REGEX = /^(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d$/;

  transform(value: string, _metadata: ArgumentMetadata): string {
    // ── TODO 3: validar `value` contra ISBN_REGEX; si no matchea,
    // lanzar `BadRequestException` con un mensaje que incluya el valor ──
    return value;
  }
}

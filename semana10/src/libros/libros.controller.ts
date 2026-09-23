import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { LibrosService } from './libros.service';
import { Libro } from './libro.interface';

const MIME_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAX_BYTES = 2 * 1024 * 1024; // 2MB

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Libro {
    return this.librosService.findOne(id);
  }

  // @UseInterceptors(FileInterceptor('file')) intercepta multipart/form-data
  // y expone el archivo con @UploadedFile(). diskStorage + un nombre único
  // (uuid) evita colisiones entre portadas de libros distintos.
  @Post(':id/portada')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/portadas',
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: TAMANO_MAX_BYTES },
      fileFilter: (_req, file, cb) => {
        cb(null, MIME_PERMITIDOS.includes(file.mimetype));
      },
    }),
  )
  subirPortada(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Libro {
    if (!file) {
      throw new BadRequestException(
        `Archivo inválido: debe ser ${MIME_PERMITIDOS.join('/')} y menor a 2MB`,
      );
    }
    return this.librosService.setPortada(id, file.filename);
  }
}

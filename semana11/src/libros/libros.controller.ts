import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { LibrosService } from './libros.service';
import { Libro } from './libro.entity';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';
import { ResultadoPaginado } from './libro.interface';

const MIME_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAX_BYTES = 2 * 1024 * 1024; // 2MB

// Versionado por URI: esta ruta vive en /api/v1/libros. El resto de módulos
// hereda la versión '1' por defecto declarada en main.ts.
@Controller({ path: 'libros', version: '1' })
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // GET /api/v1/libros?page=1&limit=10&titulo=clean&categoria=ficcion&autorId=<uuid>&disponible=true&sort=titulo&order=asc
  @Get()
  buscar(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('titulo') titulo?: string,
    @Query('categoria') categoria?: string,
    @Query('autorId') autorId?: string,
    @Query('disponible') disponible?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ): Promise<ResultadoPaginado<Libro>> {
    return this.librosService.buscar({
      page: Number(page),
      limit: Number(limit),
      titulo,
      categoria,
      autorId,
      disponible: disponible === undefined ? undefined : disponible === 'true',
      sort: sort === 'anio' ? 'anio' : 'titulo',
      order: order === 'desc' ? 'desc' : 'asc',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Libro> {
    return this.librosService.findOne(id);
  }

  @Post()
  crear(@Body() dto: CrearLibroDto): Promise<Libro> {
    return this.librosService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarLibroDto,
  ): Promise<Libro> {
    return this.librosService.actualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.librosService.eliminar(id);
  }

  // FileInterceptor intercepta multipart/form-data y expone el archivo con
  // @UploadedFile(). diskStorage + un nombre único (uuid) evita colisiones
  // entre portadas de libros distintos.
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
  ): Promise<Libro> {
    if (!file) {
      throw new BadRequestException(
        `Archivo inválido: debe ser ${MIME_PERMITIDOS.join('/')} y menor a 2MB`,
      );
    }
    return this.librosService.setPortada(id, file.filename);
  }
}

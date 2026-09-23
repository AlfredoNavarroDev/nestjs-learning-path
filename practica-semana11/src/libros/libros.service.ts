import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { AutoresService } from '../autores/autores.service';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';
import { BusquedaLibrosFiltro, ResultadoPaginado } from './libro.interface';

const SORT_PERMITIDOS = ['titulo', 'anio'] as const;

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro) private readonly librosRepo: Repository<Libro>,
    private readonly autoresService: AutoresService,
  ) {}

  async crear(dto: CrearLibroDto): Promise<Libro> {
    const existente = await this.librosRepo.findOneBy({ isbn: dto.isbn });
    if (existente) {
      throw new ConflictException(`Ya existe un libro con isbn ${dto.isbn}`);
    }
    const autores = await this.autoresService.findByIds(dto.autoresIds);
    const libro = this.librosRepo.create({
      titulo: dto.titulo,
      isbn: dto.isbn,
      anio: dto.anio,
      categoria: dto.categoria ?? null,
      autores,
    });
    return this.librosRepo.save(libro);
  }

  // Paginación offset-based (skip/take + metadata) + filtros/orden dinámico
  // resueltos con Query Builder: un join explícito evita el N+1 de pedir
  // `autores` libro por libro, y cada condición se agrega solo si vino en
  // el filtro (nunca se concatena el valor crudo directo en el SQL).
  async buscar(filtro: BusquedaLibrosFiltro): Promise<ResultadoPaginado<Libro>> {
    const qb = this.librosRepo
      .createQueryBuilder('libro')
      .leftJoinAndSelect('libro.autores', 'autor');

    if (filtro.titulo) {
      qb.andWhere('libro.titulo ILIKE :titulo', {
        titulo: `%${filtro.titulo}%`,
      });
    }
    if (filtro.categoria) {
      qb.andWhere('libro.categoria = :categoria', {
        categoria: filtro.categoria,
      });
    }
    if (filtro.autorId) {
      qb.andWhere('autor.id = :autorId', { autorId: filtro.autorId });
    }
    if (filtro.disponible !== undefined) {
      qb.andWhere('libro.prestado = :prestado', {
        prestado: !filtro.disponible,
      });
    }

    // Whitelist de columnas ordenables: nunca aceptar un nombre de columna
    // arbitrario del query param.
    const sort = SORT_PERMITIDOS.includes(filtro.sort as any)
      ? filtro.sort
      : 'titulo';
    qb.orderBy(`libro.${sort}`, filtro.order === 'desc' ? 'DESC' : 'ASC');

    const total = await qb.getCount();
    const data = await qb
      .skip((filtro.page - 1) * filtro.limit)
      .take(filtro.limit)
      .getMany();

    return {
      data,
      total,
      page: filtro.page,
      totalPages: Math.ceil(total / filtro.limit),
    };
  }

  async findOne(id: string): Promise<Libro> {
    const libro = await this.librosRepo.findOne({
      where: { id },
      relations: ['autores'],
    });
    if (!libro) throw new NotFoundException(`Libro ${id} no existe`);
    return libro;
  }

  async actualizar(id: string, dto: ActualizarLibroDto): Promise<Libro> {
    const libro = await this.findOne(id);
    if (dto.autoresIds) {
      libro.autores = await this.autoresService.findByIds(dto.autoresIds);
    }
    Object.assign(libro, {
      ...dto,
      autoresIds: undefined,
    });
    return this.librosRepo.save(libro);
  }

  async eliminar(id: string): Promise<void> {
    const libro = await this.findOne(id);
    await this.librosRepo.remove(libro);
  }

  async marcarPrestado(id: string, prestado: boolean): Promise<void> {
    await this.librosRepo.update({ id }, { prestado });
  }

  async setPortada(id: string, filename: string): Promise<Libro> {
    await this.findOne(id);
    await this.librosRepo.update(
      { id },
      { portadaUrl: `/uploads/portadas/${filename}` },
    );
    return this.findOne(id);
  }
}

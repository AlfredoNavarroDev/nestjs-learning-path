import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';

export interface BusquedaLibrosFiltro {
  titulo?: string;
  autorId?: string;
  disponible?: boolean;
}

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro) private readonly librosRepo: Repository<Libro>,
  ) {}

  // Query Builder básico: join explícito para traer libros con sus autores
  // en una sola query (evita el N+1 de pedir `autores` libro por libro).
  findAllConAutores(): Promise<Libro[]> {
    return this.librosRepo
      .createQueryBuilder('libro')
      .leftJoinAndSelect('libro.autores', 'autor')
      .getMany();
  }

  // Filtros dinámicos combinables: cada condición se agrega solo si vino en
  // el filtro (nunca se concatena el valor crudo directo en el SQL).
  buscar(filtro: BusquedaLibrosFiltro): Promise<Libro[]> {
    const qb = this.librosRepo
      .createQueryBuilder('libro')
      .leftJoinAndSelect('libro.autores', 'autor');

    if (filtro.titulo) {
      qb.andWhere('libro.titulo ILIKE :titulo', {
        titulo: `%${filtro.titulo}%`,
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

    return qb.getMany();
  }

  findOne(id: string): Promise<Libro | null> {
    return this.librosRepo.findOne({ where: { id }, relations: ['autores'] });
  }

  marcarPrestado(id: string, prestado: boolean): Promise<void> {
    return this.librosRepo
      .update({ id }, { prestado })
      .then(() => undefined);
  }
}

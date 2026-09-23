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

  findAllConAutores(): Promise<Libro[]> {
    // ── TODO 6: createQueryBuilder('libro').leftJoinAndSelect('libro.autores',
    // 'autor').getMany() ─────────────────────────────────────
    throw new Error('TODO: implementar findAllConAutores');
  }

  buscar(filtro: BusquedaLibrosFiltro): Promise<Libro[]> {
    const qb = this.librosRepo
      .createQueryBuilder('libro')
      .leftJoinAndSelect('libro.autores', 'autor');

    // ── TODO 7: si filtro.titulo viene, qb.andWhere('libro.titulo ILIKE
    // :titulo', { titulo: `%${filtro.titulo}%` }) ────────────────
    // ── TODO 8: si filtro.autorId viene, qb.andWhere('autor.id = :autorId',
    // { autorId: filtro.autorId }) ───────────────────────────
    // ── TODO 9: si filtro.disponible !== undefined, qb.andWhere(
    // 'libro.prestado = :prestado', { prestado: !filtro.disponible }) ──

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

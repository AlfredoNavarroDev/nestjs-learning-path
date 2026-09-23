import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { AutoresService } from '../autores/autores.service';

@Injectable()
export class LibrosService {
  constructor(private readonly autoresService: AutoresService) {}

  findAll(): Promise<Libro[]> {
    throw new Error('TODO: implementar findAll');
  }

  findOne(id: string): Promise<Libro | null> {
    throw new Error('TODO: implementar findOne');
  }

  async create(data: Omit<Libro, 'id'>): Promise<Libro> {
    // ── TODO 13: validar autor con this.autoresService.existe(),
    // luego this.librosRepo.create(data) + save() ─────────────
    throw new Error('TODO: implementar create');
  }

  async update(id: string, data: Partial<Libro>): Promise<Libro | null> {
    // ── TODO 14: this.librosRepo.update({ id }, data) + findOne() ──
    throw new Error('TODO: implementar update');
  }

  async remove(id: string): Promise<void> {
    // ── TODO 15: this.librosRepo.delete({ id }) ────────────────
  }
}

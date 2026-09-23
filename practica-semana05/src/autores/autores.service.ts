import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Autor } from './autor.entity';

@Injectable()
export class AutoresService {
  // ── TODO 7: inyectar @InjectRepository(Autor) autoresRepo: Repository<Autor> ──
  constructor() {}

  findAll(): Promise<Autor[]> {
    // ── TODO 8: this.autoresRepo.find() ───────────────────────
    throw new Error('TODO: implementar findAll');
  }

  findOne(id: string): Promise<Autor | null> {
    // ── TODO 9: this.autoresRepo.findOneBy({ id }) ────────────
    throw new Error('TODO: implementar findOne');
  }

  async existe(id: string): Promise<boolean> {
    // ── TODO 10: (await this.autoresRepo.countBy({ id })) > 0 ──
    return false;
  }

  create(data: Omit<Autor, 'id'>): Promise<Autor> {
    // ── TODO 11: this.autoresRepo.create(data) + save() ───────
    throw new Error('TODO: implementar create');
  }
}
